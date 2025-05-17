// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventDemo {
    // Event declarations
    event ValueUpdated(
        address indexed user,
        uint256 oldValue,
        uint256 newValue
    );
    event UserRegistered(address indexed user, string name);
    event OwnershipTransferred(
        address indexed oldOwner,
        address indexed newOwner
    );

    address public owner;
    mapping(address => string) public names;
    mapping(address => uint256) public values;

    constructor() {
        owner = msg.sender;
    }

    // Register a user with a name
    function register(string memory _name) public {
        names[msg.sender] = _name;
        emit UserRegistered(msg.sender, _name); // Emit event
    }

    // Update the user's value
    function updateValue(uint256 _newValue) public {
        uint256 old = values[msg.sender];
        values[msg.sender] = _newValue;
        emit ValueUpdated(msg.sender, old, _newValue); // Emit event
    }

    // Change ownership of the contract
    function transferOwnership(address _newOwner) public {
        require(msg.sender == owner, "Only owner can transfer ownership");
        address oldOwner = owner;
        owner = _newOwner;
        emit OwnershipTransferred(oldOwner, _newOwner); // Emit event
    }
}
