pragma solidity ^0.8.4;


import "./VerifierRegistry.sol";
import "../proof/impl/GMPIntentEventVeifier.sol";

//can be deployed as a stand-alone contract
//and this registry can be referred by other contract to "view" the address
contract GMPVerifierRegistry is VerifierRegistry {
}