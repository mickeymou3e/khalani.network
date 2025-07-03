pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockRewarder {
    address mirrortoken;

    constructor(address _token) {
        mirrortoken = _token;
    }

    function reward(
        uint32 chainId,
        address token,
        uint256 amount,
        address to
    ) external virtual {
        IERC20(mirrortoken).transfer(to, amount);
    }
}
