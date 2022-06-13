const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoffeeMachine", function () {
  it("should send tokens to the user", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const CM = await ethers.getContractFactory("CoffeeMachine");
    const cm = await CM.deploy();
    await cm.deployed();

    await cm.sendTokens(addr1.address);
    await cm.sendTokens(addr2.address);

    expect(await cm.getTokenBalance(addr1.address)).to.equal(1000);
    expect(await cm.getTokenBalance(addr2.address)).to.equal(1000);
    expect(await cm.getTokenBalance(owner.address)).to.equal(8000);
  });
  it("should brew coffee and subtract the tokens", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const CM = await ethers.getContractFactory("CoffeeMachine");
    const cm = await CM.deploy();
    await cm.deployed();

    await cm.sendTokens(addr1.address);

    let initialBalance = await cm.getTokenBalance(addr1.address);
    await cm.brewCoffee(addr1.address, "black_coffee");
    let price = await cm.brewPrice("black_coffee");
    expect(await cm.getTokenBalance(addr1.address)).to.equal(
      initialBalance - price
    );

    initialBalance = await cm.getTokenBalance(addr1.address);
    await cm.brewCoffee(addr1.address, "cappucino");
    price = await cm.brewPrice("cappucino");
    expect(await cm.getTokenBalance(addr1.address)).to.equal(
      initialBalance - price
    );

    expect(await cm.getTokenBalance(owner.address)).to.equal(9039);
  });
  it("should not brew coffee if tokens are low", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const CM = await ethers.getContractFactory("CoffeeMachine");
    const cm = await CM.deploy();
    await cm.deployed();

    try {
      await cm.brewCoffee(addr1.address, "black_coffee");
    } catch (error) {
      expect(error)
        .to.be.an("error")
        .with.property(
          "message",
          "VM Exception while processing transaction: reverted with reason string 'not enough tokens'"
        );
    }
  });
});
