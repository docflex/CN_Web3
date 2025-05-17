// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleBank
 * @dev A minimal Contract to Demonstrate Deposits, withdrawals, events, access control
 *
 */
contract SimpleBank {
    address public owner;
    mapping(address => uint256) private balances;

    // ! Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event OwnershipTransferred(
        address indexed oldOwner,
        address indexed newOwner
    );

    // ! Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the Contract Owner!");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ! Functions
    function deposit() public payable {
        require(msg.value > 0, "You Must Send Some Ether.");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient Balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    // ! Check Balance
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    // Transfer Ownership of Contract
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New Owner Cannot have 0 Address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
