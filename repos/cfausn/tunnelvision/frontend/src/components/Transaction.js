import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import moment from 'moment'


//Then inside your component

const url = "http://127.0.0.1:8000/"

export const Transaction = () => {
    const { id } = useParams();
    let timestamp = 0
    const refreshInterval = 5000 // 5 seconds
    const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

    const [txFee, setTxFee] = useState("")
    const [timeSince, setTimeSince] = useState("")
    const [transferLogElements, setTransferLogElements] = useState([])
    const [currentTx, setCurrentTx] = useState({
        hash: "",
        blockHash: "",
        blockNumber: 0,
        chainId: "",
        from: "",
        gas: 0,
        gasPrice: "",
        input: "",
        nonce: 0,
        r: "",
        s: "",
        to: "",
        transactionIndex: 0,
        type: 0,
        v: "",
        value: ""
    })
    const [currentBlock, setCurrentBlock] = useState({
        block: 0,
        baseFeePerGas: 0,
        difficulty: "0",
        extraData: "",
        gasLimit: 0,
        gasUsed: 0,
        hash: "",
        logsBloom: "",
        miner: "",
        mixHash: "",
        nonce: "",
        number: 0,
        parentHash: "",
        receiptsRoot: "",
        sha3Uncles: "",
        size: 0,
        stateRoot: "",
        timestamp: 0,
        totalDifficulty: "",
        transactions: [],
        transactionsRoot: "",
        uncles: []
    })
    const [txReceipt, setTxReceipt] = useState({
        status: false,
        transactionHash: "",
        transactionIndex: 0,
        blockHash: "",
        blockNumber: 0,
        contractAddress: "",
        cumulativeGasUsed: 0,
        gasUsed: 0,
        logs: []
    })
    
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
        fetch(`${url}requestNewToken`)
            .then((res) => res.json())
            .then((data) => {
                token = data
                getTxInfo()
            })
    }
   

    // gets the basic tx info from the backend 
    const getTxInfo = () => {
        fetch(`${url}getTx?tx=${id}`, getRequestOptions())
            .then((res) => res.json())
            .then((data) => {
                setCurrentTx(data.tx)
                getBlockInfo(data.tx)
                getTxReceiptInfo(data.tx)
            })
    }

    // gets the receipt of the tx from the backend (for log & gas info)
    const getTxReceiptInfo = (tx) => {
        fetch(`${url}getTxReceipt?tx=${id}`, getRequestOptions())
            .then((res) => res.json())
            .then((data) => {
                const gasPrice = new Web3.utils.BN(tx.gasPrice)
                const txFeeTotal = gasPrice.mul(new Web3.utils.BN(data.tx.gasUsed))
        
                if (data.tx.logs.length > 0) getTransferInfo(data.tx.logs)
                setTxFee(txFeeTotal)
                setTxReceipt(data.tx)
            })
    }

    // gets the info of the logs from the backend
    const getTransferInfo = async (logs) => {
        let transferLogs = []
        for (let i = 0; i < logs.length; i++ ) {
            let transferElement
            let log = logs[i]     

            let topics = log.topics
            if (topics[0] == transferTopic) {
    
                let from = `0x${(topics[1].slice(26)).slice(0,12)}...`
                let to = `0x${(topics[2].slice(26)).slice(0,12)}...`;
    
                // must get decimals and name from the ERC20 token
                let tokenInfo = (await (await fetch(`${url}getTokenInfo?address=${log.address}`, getRequestOptions())).json())
    
                let tokenDecimals = tokenInfo.decimals
                let tokenName = tokenInfo.name
    
    
                let amount = parseInt(log.data, 16) / 10**tokenDecimals       

                transferElement = 
                    <Card.Header key={from}>
                        <div className="row">
                            <div className='col-4'>
                                From: {from}
                            </div> 
                            <div className='col-4' >
                                To: {to}
                            </div> 
                            <div className='col-4' >
                                For: {amount} {tokenName}
                            </div> 
                        </div>
                    </Card.Header>
                transferLogs.push(transferElement)
            }

        }
        setTransferLogElements(transferLogs)
    }

    // gets the info of the selected block from the backend
    const getBlockInfo = (tx) => {
        fetch(`${url}getBlock?block=${tx.blockNumber}`, getRequestOptions())
        .then((res) => res.json())
        .then((data) => {
            setCurrentBlock(data.block)
            timestamp = data.block.timestamp
            updateTimeSince()
        })
    }
    
    // allows for users to see how much time has occurred since the block was mined
    // updates every refreshInterval (defaults to 5 seconds)
    // TODO: if there's time, move this to a utility function external to this component
    const updateTimeSince = () => {
        let startDate = moment(Date.now());
        let timeEnd = moment(new Date(timestamp * 1000));
        let diff = startDate.diff(timeEnd);
        let diffDuration = moment.duration(diff);

        if (diffDuration.years() > 0) {
            setTimeSince(diffDuration.years() + ' years ' + diffDuration.months() + ' months ' + diffDuration.days() + ' days ' + diffDuration.hours() + ' hrs ' + diffDuration.minutes() + ' mins ago' )
        }
        else if (diffDuration.months() > 0) {
            setTimeSince(diffDuration.months() + ' months ' + diffDuration.days() + ' days ' + diffDuration.hours() + ' hrs ' + diffDuration.minutes() + ' mins ago' )
        }
        else if (diffDuration.days() > 0) {
            setTimeSince(diffDuration.days() + ' days ' + diffDuration.hours() + ' hrs ' + diffDuration.minutes() + ' mins ago' )
        }
        else if (diffDuration.hours() > 0) {
            setTimeSince(diffDuration.hours() + ' hrs ' + diffDuration.minutes() + ' mins ago' )
        }
        else {
            setTimeSince(diffDuration.minutes() + ' mins ago' )
        }

        setTimeout(() => {
            // your code
            updateTimeSince();
        }, refreshInterval);
    }

    // renders the UI
    return <div className="container">
            <div className="row">
                <Card>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                Transaction Hash:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentTx.hash} 
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                Block:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                <a href={`/block/${currentTx.blockNumber}`}>{currentTx.blockNumber} </a>
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                Timestamp:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {timeSince} ({ new Date(currentBlock.timestamp*1000).toLocaleString() }) 
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                From:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentTx.from} 
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                Interacted With (To):
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentTx.to} 
                            </div> 
                        </div>
                    </Card.Header>
                    {
                        transferLogElements.length > 0 ? 
                        <Card.Header>
                            <div className="row">
                                <div className='col-6'>
                                    ERC-20 Tokens Transferred:
                                </div> 
                                <div className='col-6' style={{textAlign: 'left'}}>
                                    {transferLogElements} 
                                </div> 
                            </div>
                        </Card.Header>
                        :
                        <></>
                    }
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                Value:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {Web3.utils.fromWei(currentTx.value, 'ether')} ETH
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                Transaction Fee:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {Web3.utils.fromWei(txFee, 'ether')} ETH
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                Gas Price:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {Web3.utils.fromWei(currentTx.gasPrice, 'ether')} ETH
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                Gas Limit:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentTx.gas}
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                                Gas Used:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {txReceipt.gasUsed}
                            </div> 
                        </div>
                    </Card.Header>
                    
                </Card>
            </div>
        </div>
}
export default Transaction