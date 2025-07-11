const express = require("express");
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
const Web3 = require('web3');

// get config vars
dotenv.config();
const ethProviderUrl = process.env.ethProviderUrl 

const ethProvider = new Web3.providers.WebsocketProvider(
    ethProviderUrl,
    {
        clientConfig: {
            keepalive: true,
            keepaliveInterval: 60000
        },
        reconnect: {
            auto: true,
            delay: 5000,
            maxAttempts: 5,
            onTimeout: false
        }
    }
  );

const web3Eth = new Web3(ethProvider)
  
// Connection URL
const url = `mongodb://localhost:27017`;

// Database Name
const dbName = 'tunnelvision';
const client = new MongoClient(url, {useNewUrlParser: true});

const hostname = '127.0.0.1' //'192.168.0.127'
const port = 8000;

const app = express();
app.use(cors())
app.use(require('body-parser').json());

const db = client.db(dbName);
const refreshRate = 150

const erc20ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
        {
            "name": "",
            "type": "string"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
   "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "type": "function"
  }]

//// FUNCTIONAL COMPONENTS 
/**
 *  getBlock
 * 1. gets a single block XXXX
 * 2. check if the block is stored in mongo
 * 3. if the block is stored in mongo, use that record
 * 4. if the block isn't stored in mongo, query web3 provider and add to mongo
 * 5. return json of block
 */

const getBlock = async (block) => {
  // const db = client.db(dbName);
  let collectionBlocks = db.collection('blocks')

  const query = { block: block };

  const result = await collectionBlocks.find(query).next()

  if (result) {
    // Have a cached item (below prints too often)
    return result
  }
  else {
    // Need to call Web3 provider 
    console.log(`Adding block ${block} to Mongo.`)
    let blockResult = await web3Eth.eth.getBlock(block)

    collectionBlocks.updateOne({block: block}, { $set: blockResult,}, {upsert: true})

    return blockResult
  }
}

/**
 *  getTx
 * 1. get a transaction by hash
 * 2. check if TXid is stored in mongo
 * 3. if it's stored in mongo, use that tx
 * 4. if it's not stored in mongo, query web3 provider and add to mongo
 * 5. return json of tx
 */

const getTx = async (tx) => {
  let collectionTxs = db.collection('transactions')

  const query = { hash: tx };

  const result = await collectionTxs.find(query).next()

  if (result) {
    // Have a cached item
    return result
  }
  else {
    // Need to call Web3 provider
    console.log(`Adding tx ${tx} to Mongo.`)
    let txResult = await web3Eth.eth.getTransaction(tx)

    collectionTxs.updateOne({hash: tx}, { $set: txResult,}, {upsert: true})

    return txResult
  }
}

/**
 *  getTxReceipt
 * 1. get a transaction receipt by hash
 * 2. check if transactionHash is stored in mongo
 * 3. if it's stored in mongo, use that tx receipt
 * 4. if it's not stored in mongo, query web3 provider and add to mongo
 * 5. return json of tx
 */

const getTxReceipt = async (tx) => {
  let collectionTxs = db.collection('transactionReceipts')

  const query = { transactionHash: tx };

  const result = await collectionTxs.find(query).next()

  if (result) {
    // Have a cached item
    return result
  }
  else {
    // Need to call Web3 provider
    console.log(`Adding tx ${tx} to Mongo.`)
    let txResult = await web3Eth.eth.getTransactionReceipt(tx)

    collectionTxs.updateOne({transactionHash: tx}, { $set: txResult,}, {upsert: true})

    return txResult
  }
}

/**
 *  getBulkTXs (don't allow more than 500)
 * 1. get a query for a list of tx's passed
 * 2. for each block in the range, call getTx(hash)
 * 3. return json list of blocks
 */

const getBulkTXs = async (txs) => {
  let bulkTxs = []
  for(let i = 0; i < txs.length; i++) {
    let txResult = await getTx(txs[i])
    bulkTxs.push(txResult)
    await new Promise(resolve => setTimeout(resolve, refreshRate));
  }
  // TODO: sort by timestamp
  return bulkTxs
}

/**
 *  authenticateToken
 * 
 *  Makes sure that the passed token is valid, redirects to 403 if it's not.
 */

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    console.log("user:", user)
    req.user = user

    next()
  })
}

/**
 *  generateAccessToken
 * 
 *  Returns a token signed by the project secret with the ip origin of the caller
 */

const generateAccessToken = (origin) => {
  return jwt.sign({origin: origin}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

//// API ENDPOINTS

/**
 *  requestNewToken 
 * 
 *  returns: a token for the calling user
 */
app.get('/requestNewToken', function requestHandler(req, res){
  let origin = req.ip
  console.log("Token request from: ", req.ip)
  const token = generateAccessToken({ origin });
  res.json(token);
})

/**
 *  getBlock 
 * 
 *  requires the 'block' query parameter, expected to be a number
 * 
 *  returns: a json of the block
 */
app.get('/getBlock', authenticateToken, async function requestHandler(req, res) {
  const block = req.query.block
  console.log("block", block)

  let blockResult = await getBlock(block)
  res.json({ block : blockResult })
})


/**
 *  getBlocks
 * 
 *  requires the 'start' query parameter, the first block to search from
 *  requires the 'end' query parameter, the block to end the search to
 * 
 *  NOTES: limits to blockLimit (to prevent web3 provider spam)
 * 
 *  returns: a list of jsons of the blocks
 */
app.get('/getBlocks', authenticateToken, async function requestHandler(req, res) {
  const blockLimit = 500

  const start = parseInt(req.query.start)
  const end = parseInt(req.query.end)

  if (end < start) {
    res.sendStatus(400) // bad query params
    return
  }

  if (end - start > blockLimit) {
    res.sendStatus(400) // over block limit
    return
  }

  let blocks = []
  for(let i = start; i <= end; i++) {
    blocks.push(await getBlock(i))
    await new Promise(resolve => setTimeout(resolve, refreshRate));
  }

  res.json({ blocks : blocks.reverse() })
})

/**
 *  getCurrentBlock
 * 
 *  returns: the most recent block (number)
 */

app.get('/getCurrentBlock', authenticateToken, async function requestHandler(req, res) {
    res.json({ currentBlock : await web3Eth.eth.getBlockNumber() })
})

/**
 *  getTx
 * 
 *  requires the 'tx' query parameter, the hash of the tx to get
 * 
 *  returns: a json of the tx
 */

app.get('/getTx',  authenticateToken, async function requestHandler(req, res) {
    const tx = req.query.tx

    let txResult = await getTx(tx)
    res.json({ tx : txResult })
})


/**
 *  getTxReceipt
 * 
 *  requires the 'tx' query parameter, the hash of the tx to get
 * 
 *  returns: a json of the tx receipt
 */

app.get('/getTxReceipt', authenticateToken, async function requestHandler(req, res) {
    const tx = req.query.tx

    let txResult = await getTxReceipt(tx)
    res.json({ tx : txResult })
})

/**
 *  getTxsOfBlock
 * 
 *  requires the 'block' query parameter, expected to be a number
 * 
 *  returns: a json of all tx's in the block
 */

app.get('/getTxsOfBlock', authenticateToken, async function requestHandler(req, res) {
  const block = req.query.block
  console.log("block", block)

  let blockResult = await getBlock(block)
  
  let txLimit = 10
  let txsFromBlock = blockResult.transactions.reverse().slice(0, txLimit)
  let bulkTxs = await getBulkTXs(txsFromBlock)

  res.json({ txs : bulkTxs })
})

/**
 *  getCurrentGasPrice
 * 
 *  returns: the most recent gas price (number)
 */

app.get('/getCurrentGasPrice', authenticateToken, async function requestHandler(req, res) {
  let gasPrice = await web3Eth.eth.getGasPrice()

  res.json({ gasPrice })
})

/**
 *  getTokenInfo
 * 
 *  requires the 'address' query parameter, expected to be an eth address
 * 
 *  returns: the decimals and name of the token
 */

app.get('/getTokenInfo', authenticateToken, async function requestHandler(req, res) {
  const address = req.query.address
  const tokenContract = await new web3Eth.eth.Contract(erc20ABI, address);
  let decimals = await tokenContract.methods.decimals().call();
  let name = await tokenContract.methods.name().call();

  res.json({ decimals, name })
})

// const server = await 
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});