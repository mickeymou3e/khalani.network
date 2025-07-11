import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Web3 from 'web3';

const url = "http://127.0.0.1:8000/"

export const Explorer = () => {
    // state variables
    const [currentBlock, setCurrentBlock] = useState(0)
    const [currentGasPrice, setCurrentGasPrice] = useState("")
    const [blockList, setBlockList] = useState([])
    const [blockListElements, setBlockListElements] = useState([])
    const [txList, setTxList] = useState([])
    const [txListElements, setTxListElements] = useState([])

    // local variables
    const refreshInterval = 15000 // 15 second to start
    let currentBlockLocal = 0
    let bulkLimit = 10  // limit to 10 to avoid overloading web3 provider
    let token = ""

    // on component render
    useEffect(() => {
        getToken()
    }, [])

    // authorization headers
    const getRequestOptions = () => {
        return {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        };
    }

    // request a token from the backend
    const getToken = () => {
        fetch(`${url}requestNewToken`, getRequestOptions())
            .then((res) => res.json())
            .then((data) => {
                token = data
                checkIfBlockChanged()
                setInterval(checkIfBlockChanged, refreshInterval);
            })
    }

    // only fetch bulk info from backend if the block has changed
    const checkIfBlockChanged = () => {
        fetch(`${url}getCurrentBlock`, getRequestOptions())
            .then((res) => res.json())
            .then((data) => {
                if (data.currentBlock > currentBlockLocal) {
                    setCurrentBlock(data.currentBlock)
                    currentBlockLocal = data.currentBlock
                    getBlockList(data.currentBlock)
                    getTxList(data.currentBlock)
                    getGasPrice()
                }
            })
    }

    // gets the last x blocks from the backend
    const getBlockList = (toBlock) => {
        let start = toBlock - bulkLimit + 1
        fetch(`${url}getBlocks?start=${start}&end=${toBlock}`, getRequestOptions())
            .then((res) => res.json())
            .then((data) => {
                setBlockList(data.blocks)
                buildBlockElements(data.blocks)
            })

    }

    // gets the current gas price from the backend 
    const getGasPrice = () => {
        fetch(`${url}getCurrentGasPrice`, getRequestOptions())
            .then((res) => res.json())
            .then((data) => {
                setCurrentGasPrice(Web3.utils.fromWei(data.gasPrice, 'gwei').substring(0, 5) + ' GWEI')
            })
    }

    // gets the Tx's of the given block
    const getTxList = (block) => {
        fetch(`${url}getTxsOfBlock?block=${block}`, getRequestOptions())
            .then((res) => res.json())
            .then((data) => {
                setTxList(data.txs)
                buildTxElements(data.txs)
            })

    }

    // builds the list of blocks to display to the user
    const buildBlockElements = (blocks) => {
        let blockElements = []
        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            let blockElement = <ListGroup.Item key={block.number}>
                    <div className="d-flex flex-row">
                        <div className="p-2"><a href={`/block/${block.number}`}>{block.number}</a></div>
                        <div className="p-2">Fee Recipient: <a href='/'>{block.miner.substring(0, 7) + '...'}</a></div>
                    </div>
                </ListGroup.Item>
            blockElements.push(blockElement)
        }
        setBlockListElements(blockElements)
    }

    // builds the list of txs to display to the user
    const buildTxElements = (txs) => {
        let txElements = []
        for(let i = 0; i < txs.length; i++) {
            let tx = txs[i]
            let hash = tx.hash.substring(0, 17) + '...'
            let from = tx.from ? tx.from.substring(0, 7) + '...' : "0x0"
            let to = tx.to ? tx.to.substring(0, 7) + '...' : "0x0"

            let txElement = <ListGroup.Item key={tx.hash}>
                    <div className="d-flex flex-row">
                        <div className="p-2"><a href={`/tx/${tx.hash}`}>{hash}</a></div>
                        <div className="p-2">From: {from}</div>
                        <div className="p-2">To: {to}</div>
                    </div>
                </ListGroup.Item>
            txElements.push(txElement)
        }
        setTxListElements(txElements)
    }

    // renders the UI
    return <div className="container">
        <div className="row">
        <p>Current Block: {currentBlock}</p>
        <p>Current Gas Price: {currentGasPrice}</p>
        </div>
        <div className="row">
            <div className="col-6">
                <Card>
                    <Card.Header>Blocks</Card.Header>
                    <ListGroup variant="flush">
                        {blockListElements}
                    </ListGroup>
                </Card>
            </div>
            <div className="col-6">
                <Card>
                    <Card.Header>Transactions</Card.Header>
                    <ListGroup variant="flush">
                        {txListElements}
                    </ListGroup>
                </Card>
            </div>
        </div>
    </div>
}
export default Explorer