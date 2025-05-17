// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MappingDemo {
    // Mapping from an Address to a uint (eg: token balances)
    mapping(address => uint256) public balances;

    // Nested Mapping: (address) => (address => bool), to track allowances
    mapping(address => mapping(address => bool)) public isTrusted;

    // Set the balance for the Sender
    function setBalance(uint256 _balance) public {
        balances[msg.sender] = _balance;
    }

    // Get the Balance of the Sender
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    // Set another address as trusted
    function trust(address _trustedRecipient) public {
        isTrusted[msg.sender][_trustedRecipient] = true;
    }

    // Check if one address trusts another
    function checkTrust(address _from, address _to) public view returns (bool) {
        return isTrusted[_from][_to];
    }

    // Reset balance
    function clearBalance() public {
        delete balances[msg.sender];
    }
}
