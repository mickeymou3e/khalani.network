// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.19;

/**
 * @title Errors library
 */
library LiquidationErrors {
  //common errors
  string public constant NOT_ENOUGHT_BALANCE_IN_BACKSTOP = '1'; // 'there is not enought balance in backstop'
  string public constant NOT_ENOUGHT_DEBT_TOKENS = '2'; // after swaping before the liquidation there is not enought debt tokens
  string public constant NO_STEPS = '4'; // No steps in swap
  
  string public constant WRONG_CONFIGURATION_OR_UNDERYLING_TOKEN = '7'; // Wrong underyling token or pools configuration
  string public constant WRONG_UNDERYLING_TOKEN_TO_LINEAR_TOKEN = '8'; // Wrong underyling token to get linear token
  string public constant WRONG_UNDERYLING_TOKEN_TO_POOL_ID = '9'; // Wrong underyling token to get poolId
  string public constant ADDRESS_NOT_FOUND = '10'; //Address not found
  string public constant WRONG_ADDRESS_FOR_WRAPPED_TOKENS = '11'; // Wrong address to find wrapped tokens

}