pragma solidity ^0.8.4;

interface IRewarder {
    function reward(uint32 chainId, address token, uint256 amount, address to) external;
    function reward(address token, uint256 amount, address to) external;
    function setRewardSource(address rewardSource) external;
}