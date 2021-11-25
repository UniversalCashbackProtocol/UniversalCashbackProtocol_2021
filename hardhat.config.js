require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

const {  ALCHEMY_API_KEY, 
          KOVAN_PRIVATE_KEY, 
          ALCHEMY_MUMBAI_API_KEY, 
          MUMBAI_PRIVATE_KEY 
        } = require ('./secret-data.json')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});



/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.0",
  networks: {
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts:
      [`0x${KOVAN_PRIVATE_KEY}`],
      gasPrice: 'auto'
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_MUMBAI_API_KEY}`,
      accounts:
      [`0x${MUMBAI_PRIVATE_KEY}`]      
    },
    hardhat:{
      forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL        
      }
    },
  },
  etherscan: {
    apiKey: "ABC123ABC123ABC123ABC123ABC123ABC1"
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
