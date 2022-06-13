// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [owner, addr1, addr2] = await ethers.getSigners();
  const CM = await hre.ethers.getContractFactory("CoffeeMachine");
  const cm = await CM.deploy(owner.address);

  await cm.deployed();

  await cm.connect(addr1).mintTokens(addr1.address, {
    value: ethers.utils.parseEther("0.1"),
  });
  // await cm.sendTokens(addr2.address);
  // await cm.requestCoffeeData();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
