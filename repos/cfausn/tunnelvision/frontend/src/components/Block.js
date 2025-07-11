import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from 'react-router-dom';
import moment from 'moment'

//Then inside your component

const url = "http://127.0.0.1:8000/"

export const Block = () => {
    // state variables
    const [timeSince, setTimeSince] = useState("")
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

    // params from routing
    const { id } = useParams();

    // local variables
    const refreshInterval = 5000 // 5 seconds
    let timestamp = 0
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
                getBlockInfo()
            })
    }

    // gets the info of the selected block from the backend
    const getBlockInfo = () => {
        fetch(`${url}getBlock?block=${id}`, getRequestOptions())
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
                                Block Height:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentBlock.number} 
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
                            Fee Recipient:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentBlock.miner} 
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                            Total Difficulty:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentBlock.totalDifficulty} 
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                            Size:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentBlock.size.toLocaleString()} bytes 
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                            Gas Used:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentBlock.gasUsed.toLocaleString()} 
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                            Gas Limit:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentBlock.gasLimit.toLocaleString()} 
                            </div> 
                        </div>
                    </Card.Header>
                    <Card.Header>
                        <div className="row">
                            <div className='col-6'>
                            Extra Data:
                            </div> 
                            <div className='col-6' style={{textAlign: 'left'}}>
                                {currentBlock.extraData} 
                            </div> 
                        </div>
                    </Card.Header>
                </Card>
            </div>
        </div>
}
export default Block