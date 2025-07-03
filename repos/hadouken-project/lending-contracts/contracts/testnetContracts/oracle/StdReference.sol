// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import {IStdReference} from '../../interfaces/oracle/IStdReference.sol';

contract StdReference is IStdReference {

    mapping(string => uint256) private symbolMappingUSD;
    mapping(string => uint256) private symbolMappingETH;
    event RefDataUpdate(string symbol, uint64 price, uint64 timestamp, uint64 id);

    constructor() public {
        symbolMappingUSD["DAI"] = 10 ** 18; // 1 $
        emit RefDataUpdate("DAI", uint64(symbolMappingUSD["DAI"]), uint64(block.timestamp), 1);
        symbolMappingUSD["USDC"] = 993 * 10 ** 15; // 0.993$
        emit RefDataUpdate("USDC", uint64(symbolMappingUSD["USDC"]), uint64(block.timestamp), 1);
        symbolMappingUSD["USDT"] = 10 ** 18; // 1 $
        emit RefDataUpdate("USDT", uint64(symbolMappingUSD["USDT"]), uint64(block.timestamp), 1);
        symbolMappingUSD["CKB"] =  23908200000000000; // 0.023982 $
        emit RefDataUpdate("CKB", uint64(symbolMappingUSD["CKB"]), uint64(block.timestamp), 1);
        symbolMappingUSD["dCKB"] =  24908200000000000; // 0.024982 $
        emit RefDataUpdate("dCKB", uint64(symbolMappingUSD["dCKB"]), uint64(block.timestamp), 1);
         symbolMappingUSD["ETH"] =  2390820000000000000000; // 2390.82 $
        emit RefDataUpdate("ETH", uint64(symbolMappingUSD["ETH"]), uint64(block.timestamp), 1);
        symbolMappingUSD["BNB"] =  306920000000000000000; // 396.92 $
        emit RefDataUpdate("BNB", uint64(symbolMappingUSD["BNB"]), uint64(block.timestamp), 1);
        symbolMappingUSD["BTC"] =  30006920000000000000000; // 30 692.00 $
        emit RefDataUpdate("BTC", uint64(symbolMappingUSD["BTC"]), uint64(block.timestamp), 1);
        symbolMappingUSD["WBTC"] =  30006920000000000000000; // 30 692.00 $
        emit RefDataUpdate("WBTC", uint64(symbolMappingUSD["WBTC"]), uint64(block.timestamp), 1);
        symbolMappingUSD["ADA"] = 10 ** 18;  // 1 $
        emit RefDataUpdate("ADA", uint64(symbolMappingUSD["ADA"]), uint64(block.timestamp), 1);
        
        symbolMappingETH["DAI"] = 4195000000000000; // 0,00041915 ETH 
        symbolMappingETH["USDC"] = 4195000000000000; // 0,00041915 ETH
        symbolMappingETH["USDT"] = 4195000000000000; // 0,00041915 ETH
        symbolMappingETH["ADA"] = 8195000000000000; // 0,00081915 ETH
        symbolMappingETH["CKB"] =  10 ** 18; // 1 ETH
        symbolMappingETH["dCKB"] =  10 ** 18; // 1 ETH
        symbolMappingETH["ETH"] =  10 ** 18; // 1 ETH
        symbolMappingETH["BNB"] =  128259900000000000000000000; // 0.1282599 ETH
        symbolMappingETH["WBTC"] =  12825990000000000000000000000; // 0.1282599 ETH
        symbolMappingETH["BTC"] =  12825990000000000000000000000; // 12.82599 ETH
    }

    /// Returns the price data for the given base/quote pair. Revert if not available.
    function getReferenceData(string memory _base, string memory _quote)
        external view override returns (ReferenceData memory) {
            if(keccak256(abi.encodePacked(_quote)) == keccak256(abi.encodePacked("USD"))) {
                ReferenceData memory data = ReferenceData(symbolMappingUSD[_base],1,1);
                return data;
            }

            if(keccak256(abi.encodePacked(_quote)) == keccak256(abi.encodePacked("ETH"))) {
                ReferenceData memory data = ReferenceData(symbolMappingETH[_base],1,1);
                return data;
            }

            ReferenceData memory data = ReferenceData(1000000,1,1);
            return data;
        }
    
    /// Similar to getReferenceData, but with multiple base/quote pairs at once.
    function getReferenceDataBulk(string[] memory _bases, string[] memory _quotes)
        external view override returns (ReferenceData[] memory) {
            ReferenceData[] memory data = new ReferenceData[](_bases.length);

            for (uint i=0; i < _bases.length; ++i) {
               data[i] = this.getReferenceData(_bases[i], _quotes[i]);
            }
    
            return data;
    }


    function updatePriceUSD(string memory _base, uint256 price) public {
        symbolMappingUSD[_base] = price; 
        emit RefDataUpdate(_base, uint64(price), uint64(block.timestamp), 1);
    }


}