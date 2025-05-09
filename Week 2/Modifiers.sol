// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ModifierExample {
    address public owner;
    uint public value;
    bool public isLocked;

    // Constructor Sets Contract Deployer as the Owner
    constructor() {
        owner = msg.sender;
        isLocked = false;
    }

    // ** Modifier: onlyOwner
    // Restricts access to only the owner of the Contract
    modifier onlyOwner() {
        require(msg.sender == owner, "Not The Contract Onwer");
        _; // This tells Solidity to continue Executing the Function
    }

    // ** Modifier: lockable
    // Prevents a function from being run if the Contract is Locked
    modifier whenNotLocked() {
        require(isLocked, "Function is currently Locked!");
        _;
    }

    // ** Modifier: with logging
    modifier logAction(string memory actionName) {
        _;
        // This is a Post-Function Execution (Logging / Emitting Events)
        emit ActionLogged(actionName, msg.sender);
    }

    // Event for Logging Actions
    event ActionLogged(string action, address triggeredBy);

    // Function restricted only to the Owner
    function changeValue(
        uint _value
    ) public onlyOwner whenNotLocked logAction("changeValue") {
        value = _value;
    }

    // Function to Toggle the Lock
    function toggleLock() public onlyOwner logAction("toggleLock") {
        isLocked = !isLocked;
    }

    // Public Function anyone can call but it is also logged
    function viewValue() public logAction("viewValue") returns (uint) {
        return value;
    }
}
