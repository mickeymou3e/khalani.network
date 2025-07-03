// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

contract DIAOracleV2 {
    mapping (string => uint256) public values;
    address oracleUpdater;
    
    event OracleUpdate(string key, uint128 value, uint128 timestamp);
    event UpdaterAddressChange(address newUpdater);
    
     constructor() public {
        oracleUpdater = msg.sender;
        values['DAI/USD'] =  10 ** 8;
        values['USDC/USD'] =  10 ** 8;
        values['USDT/USD'] = 993 * 10 ** 5;
        values['CKB/USD'] =  239 * 10 **3;
        values['ETH/USD'] =  239082 * 10 ** 6;
        values['BNB/USD'] =  39692 * 10 ** 6;
        values['BTC/USD'] =  3000692 * 10 ** 6;
        values['ADA/USD']=  10 ** 8;
 

        emit OracleUpdate("DAI/USD", uint64(values['DAI/USD"']), uint64(block.timestamp));
        emit OracleUpdate("USDC/USD", uint64(values['USDC/USD']), uint64(block.timestamp));
        emit OracleUpdate("USDT/USD", uint64(values['USDT/USD']), uint64(block.timestamp));
        emit OracleUpdate("CKB/USD", uint64(values['CKB/USD']), uint64(block.timestamp));
        emit OracleUpdate("ETH/USD", uint64(values['ETH/USD']), uint64(block.timestamp));
        emit OracleUpdate("BNB/USD", uint64(values['BNB/USD']), uint64(block.timestamp));
        emit OracleUpdate("BTC/USD", uint64(values['BTC/USD']), uint64(block.timestamp));
        emit OracleUpdate("ADA/USD", uint64(values['ADA/USD']), uint64(block.timestamp));
    }
    
    function setValue(string memory key, uint128 value, uint128 timestamp) public {
        require(msg.sender == oracleUpdater);
        uint256 cValue = (((uint256)(value)) << 128) + timestamp;
        values[key] = cValue;
        emit OracleUpdate(key, value, timestamp);
    }
    
    function getValue(string memory key) external view returns (uint128, uint128) {
        uint256 cValue = values[key];
        uint128 timestamp = (uint128)(cValue % 2**128);
        uint128 value = (uint128)(cValue >> 128);
        return (value, timestamp);
    }
    
    function updateOracleUpdaterAddress(address newOracleUpdaterAddress) public {
        require(msg.sender == oracleUpdater);
        oracleUpdater = newOracleUpdaterAddress;
        emit UpdaterAddressChange(newOracleUpdaterAddress);
    }
}
