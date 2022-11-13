//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/// @title Sample Coffee Vending Machine
/// @author Rajkumar Gaur
/// @notice This generates fake coffee tokens
contract CoffeeMachine {
    address payable public owner;
    mapping(address => uint256) tokens;

    /// @param _owner Contract deployer's address
    constructor(address payable _owner) {
        owner = _owner;
    }

    /// @notice "miniumum required Eth is 0.0005"
    error MinimumValue();

    /// @notice Mint tokens by sending ETH
    function mintTokens() external payable {
        require(msg.sender != owner, "cant mint tokens for the owner");
        if (msg.value < 0.0005 * 10**18) {
            revert MinimumValue();
        }
        uint256 noOfTokens = msg.value / (0.0005 * 10**18);
        uint256 remainingEth = msg.value % (0.0005 * 10**18);
        owner.transfer(msg.value - remainingEth);
        payable(msg.sender).transfer(remainingEth);
        tokens[msg.sender] += noOfTokens;
    }

    /// @notice Gift `to` tokens to `address`
    /// @dev Transfers tokens to another user
    /// @param to The recipient address
    /// @param amount Amount of tokens to transfer
    function transferTokens(address to, uint256 amount) external {
        require(tokens[msg.sender] >= amount, "account balance is low");
        tokens[msg.sender] -= amount;
        tokens[to] += amount;
    }

    /// @notice Fetch your token balance
    /// @dev Gets token balance of the calling address
    /// @return "Total tokens in the calling address"
    function getTokenBalance() external view returns (uint256) {
        return tokens[msg.sender];
    }

    /// @notice Purchase coffee with your tokens
    /// @dev Subtract total tokens from the user's account
    /// @param price number of tokens to subtract
    function purchaseCoffee(uint256 price) external {
        require(tokens[msg.sender] >= price, "account balance is low");
        tokens[msg.sender] -= price;
    }
}
