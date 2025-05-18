// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubscriptionManager {
    address public owner;
    uint256 public subscriptionFee;
    mapping(address => uint256) public subscribers; // address => timestamp

    event Subscribed(address indexed user, uint256 expiry);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not The Owner");
        _;
    }

    constructor(uint256 _fee) {
        owner = msg.sender;
        subscriptionFee = _fee;
    }

    function subscribe() external payable {
        require(msg.value == subscriptionFee, "Incorrect Amount");
        uint256 expiry = block.timestamp + 30 days;
        subscribers[msg.sender] = expiry;
        emit Subscribed(msg.sender, expiry);
    }

    function isActiveSubscriber(address user) external view returns (bool) {
        return subscribers[user] > block.timestamp;
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to Withdraw");

        payable(owner).transfer(amount);
        emit Withdrawn(owner, amount);
    }
}
