pragma solidity ^0.8.0;

interface IERC20MintableBurnable {
    function mint(address account, uint256 amount) external;
    function burnFrom(address account, uint256 amount) external;
    function decimals() external view returns (uint8);
}