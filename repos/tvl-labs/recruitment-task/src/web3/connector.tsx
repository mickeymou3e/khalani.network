import React, { useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import Staking from '../components/staking'
 
export default function Activator () {

    const context = useWeb3Context()
 
    useEffect(() => {
        //connect to Etehreum Network through Infura
        context.setConnector('Infura')
    }, [])

    // Wait untill connection is established, then display Staking component
    if (!context.active && !context.error) {
      return (<div>Loading ...</div>)
    } else if (context.error) {
      return (<div>Error</div>)
    }else{
      return (
        <div>
            <Staking></Staking>
        </div>
      )
    }
}