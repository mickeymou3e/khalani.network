pragma solidity ^0.8.0;

import "../../src/InterchainLiquidityHub/BalancerTypes.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../src/Tokens/IERC20MintableBurnable.sol";
import "forge-std/console.sol";

contract MockBalancerVault is IVault {

    bool shouldPass = true;
    address public bpt;

    constructor(address _bptToken) {
        bpt = _bptToken;
    }

    function setPass(bool _shouldPass) external {
        shouldPass = _shouldPass;
    }

    function batchSwap(SwapKind kind,
        BatchSwapStep[] memory swaps,
        IAsset[] memory assets,
        FundManagement memory funds,
        int256[] memory limits,
        uint256 deadline
    ) external payable returns (int256[] memory assetDeltas) {
        _transferAndApproveAssets(assets, limits);
        if(shouldPass){
            for(uint i; i<assets.length; i++){
                if(limits[i]<0){
                    IERC20(address(assets[i])).transfer(funds.recipient, uint(limits[i]*-1));
                }
            }
            return limits;
        }else{
            revert("MockBalancerVault: batchSwap failed");
        }
    }

    function queryBatchSwap(
        SwapKind kind,
        BatchSwapStep[] memory swaps,
        IAsset[] memory assets,
        FundManagement memory funds
    ) external returns (int256[] memory assetDeltas) {
        //mocking convention for ILH
        //all swaps are GIVEN_IN
        //convention : asset length is 2 index: 0 is in and 1 is out
        //convention : asset length is 3 index: 0 is in, 1 is out and 2 is intermediate token
        int256[] memory deltas;
        if(swaps.length == 1){
            deltas = new int256[](2);
            deltas[0] = int(swaps[0].amount);
            deltas[1] = int(swaps[0].amount) * -1;
        } else {
            deltas = new int256[](3);
            deltas[0] = int(swaps[0].amount);
            deltas[1] = int(swaps[0].amount)* -1;
            deltas[2] = 0;
        }
        return deltas;
    }

    function _transferAndApproveAssets(
        IAsset[] memory assets,
        int256[] memory limits
    ) internal {
        for (uint i; i < limits.length;) {
            if (limits[i] > 0) {
                IERC20 token = IERC20(address(assets[i]));
                uint256 limit = uint256(limits[i]);

                SafeERC20.safeTransferFrom(token, msg.sender, address(this), limit);
            }
            unchecked {
                ++i;
            }
        }
    }
}