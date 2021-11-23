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
  const AdminProtocol = await hre.ethers.getContractFactory("AdminProtocol");
  
  const usdt = await USD.deploy( ethers.utils.parseEther('100'));
  await usdt.deployed();  

  const ucp = await UCPToken.deploy(usdt.address);
  await ucp.deployed();
  

  const adminProtocol = await AdminProtocol.deploy(usdt.address, ucp.address);
  await adminProtocol.deployed();
  

  console.log("UCP Token deployed to:", ucp.address);
  console.log("USDT Token deployed to:", usdt.address);
  console.log("Admin Protocol deployed to:", adminProtocol.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
