// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConstructorDemo {
    address public owner;
    string public contractName;
    uint256 public createdAt;

    // Constructor: runs once when the contract is deployed
    constructor(string memory _name) {
        owner = msg.sender; // Set the contract deployer as the owner
        contractName = _name; // Set the contract name
        createdAt = block.timestamp; // Save the deployment time
    }

    // Example function that only the owner can call
    function changeName(string memory _newName) public {
        require(msg.sender == owner, "Only owner can change the name");
        contractName = _newName;
    }
}
