// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
    @title Visibility Example
*/
contract VisibilityExample {
    // ** State Variables
    uint public stateNumber; // Visible to Everyone
    string private secretNote; // Visible to State only
    string public ownerName;

    constructor(string memory _ownerName) {
        stateNumber = 42;
        ownerName = _ownerName;
        secretNote = "Top Secret Note";
    }

    // ** PUBLIC Functions
    // Anyone can call this function. It is visible both externally and internally.
    function updateStatePublic(uint _newNumber) public returns (string memory) {
        uint localTemp = _newNumber + 10; // Local Variable
        stateNumber = localTemp;
        return "State Updated via Public Function";
    }

    // ** EXTERNAL Functions
    // Can only be called from outside the contract (Not Internally)
    function updateStateExternal(
        uint _newNumber
    ) external returns (string memory) {
        stateNumber = _newNumber;
        return "State Updated via External Function";
    }

    // ** INTERNAL Functions
    // Can be called from within the SC or from a Derived (Inherited) SC
    function internalMessage() internal pure returns (string memory) {
        return "Hello From Internal Function";
    }

    // ** PRIVATE Functions
    // Can only be called from within this contract.
    function privateNote() private view returns (string memory) {
        return secretNote;
    }

    // A PUBLIC function that demonstrates Calling an Internal and Private Function
    function revealInternals()
        public
        view
        returns (string memory, string memory)
    {
        string memory internalMsg = internalMessage();
        string memory note = privateNote();
        return (internalMsg, note);
    }
}
