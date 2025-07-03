pragma solidity ^0.8.4;

import {ProverRegistry} from "./ProverRegistry.sol";

//can be deployed as a stand-alone contract
//and this registry can be referred by other contract to "view" the address
//Deployed on Khalani chain , keeps registry of only GMP based provers
contract GMPProverRegistry is ProverRegistry{
}