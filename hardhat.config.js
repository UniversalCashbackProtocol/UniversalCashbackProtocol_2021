require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

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
 const ALCHEMY_API_KEY = "7E6QZXLKIETo41-wmfK_EbPsWFPBmKKO";
 const ROPSTEN_PRIVATE_KEY = "a5c94a796e80f0b01369ed56ea5a7359a4447ea2a9b67e1c0a9cf11ac62c2995";

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.0",
  networks: {
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts:
      [`0x${ROPSTEN_PRIVATE_KEY}`]
    },
    hardhat:{
      forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL        
      }
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
