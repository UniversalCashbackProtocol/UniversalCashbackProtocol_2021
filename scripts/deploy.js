// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [deployer] = await ethers.getSigners();
  console.log("El owner es" + deployer.address)

  // We get the contract to deploy
  
  const UCPToken = await hre.ethers.getContractFactory("UCPToken");
  const USD = await hre.ethers.getContractFactory("USDT");
  const Store = await hre.ethers.getContractFactory("Store");
  
  const usdt = await USD.deploy(10000);
  await usdt.deployed();

  const ucp = await UCPToken.deploy(usdt.address);
  await ucp.deployed();
  const store = await Store.deploy(deployer.address, 1, "McDonalds", ucp.address);  
  

  console.log("UCP Token deployed to:", ucp.address);
  console.log("USDT Token deployed to:", usdt.address);
  console.log("Store deployed to:", store.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
