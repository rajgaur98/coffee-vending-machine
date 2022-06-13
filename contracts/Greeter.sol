//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CoffeeMachine {
    address payable public owner;
    mapping(address => uint256) tokens;

    constructor(address payable _owner) {
        owner = _owner;
    }

    function mintTokens(address addr) external payable {
        require(addr != owner, "cant mint tokens for owner");
        require(
            msg.value >= 0.0005 * 10**18,
            "miniumum required Eth is 0.0005"
        );
        uint256 noOfTokens = msg.value / (0.0005 * 10**18);
        uint256 remainingEth = msg.value % (0.0005 * 10**18);
        owner.transfer(msg.value - remainingEth);
        payable(addr).transfer(remainingEth);
        tokens[addr] += noOfTokens;
    }

    function transferTokens(
        address from,
        address to,
        uint256 amount
    ) public {
        require(tokens[from] >= amount, "account balance is low");
        tokens[from] -= amount;
        tokens[to] += amount;
    }

    function getTokenBalance(address addr) public view returns (uint256) {
        return tokens[addr];
    }

    function purchaseCoffee(address addr, uint256 price) public {
        require(tokens[addr] >= price, "account balance is low");
        tokens[addr] -= price;
    }
}
