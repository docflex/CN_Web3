// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ModifierDemo {
    address public owner;
    bool public paused = false;
    uint256 public value;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not The Owner");
        _;
    }

    // Modifier to ensure the contract is not paused
    modifier onlyWhenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // Modifier to log changes
    modifier logChange(string memory action) {
        _;
        // This would typically be an event, but here we demonstrate logic placement
        // In real-world use: emit Log(action, msg.sender);
    }

    // Function to pause/unpause the contract, only owner can do this
    function togglePause() public onlyOwner {
        paused = !paused;
    }

    // Function that updates a value, only when not paused
    function updateValue(uint256 _newValue) public onlyWhenNotPaused logChange("Value Updated") {
        value = _newValue;
    }

    // Function that can only be executed by the owner
    function resetValue() public onlyOwner {
        value = 0;
    }
}

/**
    Restrict access to certain functions (onlyOwner).

    Validate a condition before executing logic (onlyWhenNotPaused).

    Prevent repeated code by enforcing rules through modifiers.
*/