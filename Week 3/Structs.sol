// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StructsDemo {
    // Define a Custom Struct to Represent a User
    struct User {
        string name;
        uint256 age;
        bool isActive;
    }

    // Mapping to Store Users By Address
    mapping(address => User) public users;

    // Function to Add or Update a User
    function setUser(string memory _name, uint256 _age, bool _isActive) public {
        users[msg.sender] = User(_name, _age, _isActive);
    }

    // Function to get user data
    function getUser(
        address _userAddress
    ) public view returns (string memory, uint256, bool) {
        User memory user = users[_userAddress];
        return (user.name, user.age, user.isActive);
    }

    // Function to deactivate a user
    function deactivateUser() public {
        users[msg.sender].isActive = false;
    }
}
