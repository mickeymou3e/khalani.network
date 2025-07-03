// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import {IPriceOracleGetter} from '../interfaces/oracle/IPriceOracleGetter.sol';
import {Ownable} from '../dependencies/openzeppelin/contracts/Ownable.sol';
import {IStdReference} from '../interfaces/oracle/IStdReference.sol';

contract BandOracleProvider is IPriceOracleGetter, Ownable {
    IStdReference ref;
    mapping(address => string) private symbolMapping;

    constructor(IStdReference _ref, address[] memory tokenAddresses,  string[] memory tokenSymbols) public {
        ref = _ref;
         for (uint i=0; i < tokenAddresses.length; ++i) {
            symbolMapping[tokenAddresses[i]] = tokenSymbols[i];
        } 
    }

    function getAssetPrice(address asset)  public override view returns (uint256) {
        try ref.getReferenceData(symbolMapping[asset], "USD") returns (IStdReference.ReferenceData memory data) {
            return (data.rate);
        } catch {
            return uint256(0);
        }
    }

    function getAssetPrices(address[] calldata assets) external view returns (uint256[] memory) {
        string [] memory symbols = new string[](assets.length);
        string [] memory currency  = new string[](assets.length);
        uint256 [] memory rates  = new uint256[](assets.length);

        for (uint i=0; i < assets.length; ++i) {    
          currency[i] = "USD";
          symbols[i] = (symbolMapping[assets[i]]);
        }

        IStdReference.ReferenceData[] memory data = ref.getReferenceDataBulk(symbols, currency);

        for (uint i=0; i < data.length; ++i) {
            rates[i] = uint256(data[i].rate);
        } 

        return rates;
    }

    function updateMappings(address[] calldata tokenAddresses, string[] memory tokenSymbols) external onlyOwner {
        for (uint i=0; i < tokenAddresses.length; ++i) {
            symbolMapping[tokenAddresses[i]] = tokenSymbols[i];
        } 
    }

}