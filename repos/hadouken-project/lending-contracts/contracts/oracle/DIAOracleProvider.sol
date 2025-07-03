// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import {IPriceOracleGetter} from '../interfaces/oracle/IPriceOracleGetter.sol';
import {IDiaOracle} from '../interfaces/oracle/IDiaOracle.sol';
import {Ownable} from '../dependencies/openzeppelin/contracts/Ownable.sol';

contract DIAOracleProvider is IPriceOracleGetter, Ownable {
   IDiaOracle _diaOracle;
   mapping(address => string) private symbolMapping;

    constructor(IDiaOracle diaOracle, address[] memory tokenAddresses,  string[] memory tokenSymbols) public {
        _diaOracle = diaOracle;

         for (uint i=0; i < tokenAddresses.length; ++i) {
            symbolMapping[tokenAddresses[i]] = tokenSymbols[i];
        } 
    }

    function getAssetPrice(address asset)  public override view returns (uint256) {

    string memory assetSymbol = symbolMapping[asset];

     try _diaOracle.getValue(string(abi.encodePacked(assetSymbol, "/USD"))) returns (uint128 value, uint128) {
            return uint256(value) * 10 ** 10;
        } catch {
            return uint256(0);
        }
    }

    function updateMappings(address[] calldata tokenAddresses, string[] memory tokenSymbols) external onlyOwner {
        for (uint i=0; i < tokenAddresses.length; ++i) {
            symbolMapping[tokenAddresses[i]] = tokenSymbols[i];
        } 
    }
}