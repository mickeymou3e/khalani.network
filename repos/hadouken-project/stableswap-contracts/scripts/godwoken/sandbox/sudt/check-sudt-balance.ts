require('dotenv').config()

import { deployer, transactionOverrides, translateAddress } from '../../deployment.godwoken'
import { connectSudtERC20Contract } from '../../tokens.godwoken';

const SUDT_PROXY_CONTRACT_ADDRESS = '0xf91b71FD0D282Fb18b9beb9ce4929f2b8E9a8d5a';

const RECIPIENT_ADDRESS = '0xd46aC0Bc23dB5e8AfDAAB9Ad35E9A3bA05E092E8';


(async () => {
    const sudtERC20Contract = connectSudtERC20Contract(SUDT_PROXY_CONTRACT_ADDRESS, deployer)
    const polyjuiceAddress = translateAddress(deployer.address);
    console.log(`Corresponding Polyjuice address: ${polyjuiceAddress}`);

    console.log(`Checking SUDT balance using proxy contract with address: ${SUDT_PROXY_CONTRACT_ADDRESS}...`);

    const balanceBN = await sudtERC20Contract.callStatic.balanceOf(polyjuiceAddress, transactionOverrides)

    const sudtERC20Symbol = await sudtERC20Contract.symbol()

    console.log('SUDT ERC20 symbol', sudtERC20Symbol)
    console.log(`${polyjuiceAddress} ${sudtERC20Contract.address} balance`, balanceBN.toString())

    // const recipientPolyjuiceAddress = translateAddress(RECIPIENT_ADDRESS)
    // console.log(`Transfer from ${polyjuiceAddress} to ${recipientPolyjuiceAddress}`)


    // const recipientBalanceBN = await sudtERC20Contract.callStatic.balanceOf(recipientPolyjuiceAddress, transactionOverrides)
    // console.log(`${polyjuiceAddress} ${sudtERC20Contract.address} balance`, recipientBalanceBN.toString())

    // console.log('Approve')
    // const approveTransaction = await sudtERC20Contract.approve(recipientPolyjuiceAddress, balanceBN.div(10), transactionOverrides)
    // console.log('Approve Transaction', approveTransaction.hash)
    // await approveTransaction.wait()
    
    // console.log('Transfer to', recipientPolyjuiceAddress, balanceBN.div(10).toString())
    // const transferTransaction = await sudtERC20Contract.transfer(recipientPolyjuiceAddress, balanceBN.div(2), transactionOverrides)
    // console.log('Transfer Transaction hash', transferTransaction.hash)
    
    // await transferTransaction.wait()

    // const balanceBN2 = await sudtERC20Contract.callStatic.balanceOf(polyjuiceAddress, transactionOverrides)
    // console.log(`${polyjuiceAddress} ${sudtERC20Contract.address} balance`, balanceBN2.toString())
    // const recipientBalanceBN2 = await sudtERC20Contract.callStatic.balanceOf(recipientPolyjuiceAddress, transactionOverrides)
    // console.log(`${polyjuiceAddress} ${sudtERC20Contract.address} balance`, recipientBalanceBN2.toString())
})();
