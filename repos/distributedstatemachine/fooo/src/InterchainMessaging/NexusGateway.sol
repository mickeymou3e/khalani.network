// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./libraries/LibAppStorage.sol";
import "../diamondCommons/interfaces/IDiamondCut.sol";
import "../diamondCommons/interfaces/IDiamondLoupe.sol";
import "../diamondCommons/interfaces/IERC173.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "../diamondCommons/libraries/LibDiamondStorage.sol";
pragma abicoder v2;



// This is used in diamond constructor
// more arguments are added to this struct
// this avoids stack too deep errors
    struct DiamondArgs {
        address owner;
        address init;
        bytes initCalldata;
    }

contract Nexus is Modifiers {

    constructor(IDiamondCut.FacetCut[] memory _diamondCut, DiamondArgs memory _args) payable {
        require(_args.owner!=address(0), "owner must not be 0x0");
        LibDiamond.setContractOwner(_args.owner);
        LibDiamond.diamondCut(_diamondCut, _args.init, _args.initCalldata);

        // Code can be added here to perform actions and set state variables.
        LibDiamondStorage.DiamondStorage storage ds = LibDiamondStorage.diamondStorage();

        // adding ERC165 data
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;

        ds.supportedInterfaces[type(IERC173).interfaceId] = true;
    }


    // Find facet for function that is called and execute the
    // function if a facet is found and return any value.
    fallback() external payable {
        LibDiamondStorage.DiamondStorage storage ds;
        bytes32 position = LibDiamondStorage.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }
        // get facet from function selector
        address facet = ds.facetAddressAndSelectorPosition[msg.sig].facetAddress;
        require(facet != address(0), "Diamond: Function does not exist");
        // Execute external function from facet using delegatecall and return any value.
        assembly {
        // copy function selector and any arguments
            calldatacopy(0, 0, calldatasize())
        // execute function call using the facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
        // get any return value
            returndatacopy(0, 0, returndatasize())
        // return any return value or error back to the caller
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {}
}
