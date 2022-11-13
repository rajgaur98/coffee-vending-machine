const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("CoffeeMachine", function () {
  async function deployCoffeeMachineFixture() {
    const addresses = await ethers.getSigners();
    const CM = await ethers.getContractFactory("CoffeeMachine");
    const cm = await CM.deploy(addresses[0].address);

    return { cm, addresses };
  }

  it("should mint tokens for the user", async function () {
    const { cm, addresses } = await loadFixture(deployCoffeeMachineFixture);
    const [owner, addr1] = addresses;

    await expect(
      cm.connect(addr1).mintTokens({
        value: ethers.utils.parseEther("0.0012"),
      })
    )
      .to.changeEtherBalance(owner, ethers.utils.parseEther("0.001"))
      .to.changeEtherBalance(addr1, ethers.utils.parseEther("-0.001"));

    expect(await cm.connect(addr1).getTokenBalance()).to.equal(2);
  });

  it("should not mint tokens for the owner", async function () {
    const { cm } = await loadFixture(deployCoffeeMachineFixture);

    await expect(
      cm.mintTokens({
        value: ethers.utils.parseEther("0.001"),
      })
    ).to.be.revertedWith("cant mint tokens for the owner");
  });

  it("should not mint tokens if eth is less than 0.0005", async function () {
    const { cm, addresses } = await loadFixture(deployCoffeeMachineFixture);
    const [, addr1] = addresses;

    await expect(
      cm.connect(addr1).mintTokens({
        value: ethers.utils.parseEther("0.0004"),
      })
    ).to.be.revertedWithCustomError(cm, "MinimumValue");
  });

  it("should transfer tokens from one user to another", async function () {
    const { cm, addresses } = await loadFixture(deployCoffeeMachineFixture);
    const [, addr1, addr2] = addresses;

    await cm.connect(addr1).mintTokens({
      value: ethers.utils.parseEther("0.01"),
    });
    expect(await cm.connect(addr1).getTokenBalance()).to.equal(20);

    await cm.connect(addr1).transferTokens(addr2.address, 10);
    expect(await cm.connect(addr1).getTokenBalance()).to.equal(10);
    expect(await cm.connect(addr2).getTokenBalance()).to.equal(10);
  });

  it("should not transfer tokens if low balance", async function () {
    const { cm, addresses } = await loadFixture(deployCoffeeMachineFixture);
    const [, addr1, addr2] = addresses;

    await cm.connect(addr1).mintTokens({
      value: ethers.utils.parseEther("0.01"),
    });
    expect(await cm.connect(addr1).getTokenBalance()).to.equal(20);

    await expect(
      cm.connect(addr1).transferTokens(addr2.address, 200)
    ).to.be.rejectedWith("account balance is low");
  });

  it("should return token balance", async function () {
    const { cm, addresses } = await loadFixture(deployCoffeeMachineFixture);
    const [, addr1] = addresses;

    await cm.connect(addr1).mintTokens({
      value: ethers.utils.parseEther("0.001"),
    });
    expect(await cm.connect(addr1).getTokenBalance()).to.equal(2);
  });

  it("should purchase coffee", async function () {
    const { cm, addresses } = await loadFixture(deployCoffeeMachineFixture);
    const [, addr1] = addresses;

    await cm.connect(addr1).mintTokens({
      value: ethers.utils.parseEther("0.001"),
    });
    expect(await cm.connect(addr1).getTokenBalance()).to.equal(2);
    await cm.connect(addr1).purchaseCoffee(1);
    expect(await cm.connect(addr1).getTokenBalance()).to.equal(1);
  });

  it("should not purchase coffee if low balance", async function () {
    const { cm, addresses } = await loadFixture(deployCoffeeMachineFixture);
    const [, addr1] = addresses;

    await cm.connect(addr1).mintTokens({
      value: ethers.utils.parseEther("0.001"),
    });
    expect(await cm.connect(addr1).getTokenBalance()).to.equal(2);

    await expect(cm.connect(addr1).purchaseCoffee(3)).to.be.revertedWith(
      "account balance is low"
    );
  });
});
