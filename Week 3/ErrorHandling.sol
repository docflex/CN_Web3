// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ErrorHandlingDemo {
    address public owner;
    uint256 public value;

    constructor() {
        owner = msg.sender;
        value = 1;
    }

    // ✅ Require: Validate input or access control
    function setValue(uint256 _newValue) public {
        require(_newValue > 0, "Value must be greater than 0");
        value = _newValue;
    }

    // ✅ Revert: Custom error message with complex logic
    function transferOwnership(address _newOwner) public {
        if (msg.sender != owner) {
            revert("Only owner can transfer ownership");
        }
        owner = _newOwner;
    }

    // ✅ Assert: Ensure internal invariant
    function doubleValue() public {
        uint256 oldValue = value;
        value = value * 2;
        // Should never happen if multiplication is safe
        assert(value / 2 == oldValue);
    }
}
