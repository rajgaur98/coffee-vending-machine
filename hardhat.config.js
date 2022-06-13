require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      loggingEnabled: true,
    },
    kovan: {
      loggingEnabled: true,
      url: "https://kovan.infura.io/v3/afadbce8b75a4c45a47d891705d881e1",
      accounts: [
        "fcf10ed56d88ff62b39ac926442c86c7df5749ba64afe18dfa5ffd8ad2df9aa5",
      ],
    },
    rinkeby: {
      loggingEnabled: true,
      url: "https://rinkeby.infura.io/v3/afadbce8b75a4c45a47d891705d881e1",
      accounts: [
        "fcf10ed56d88ff62b39ac926442c86c7df5749ba64afe18dfa5ffd8ad2df9aa5",
      ],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
};
