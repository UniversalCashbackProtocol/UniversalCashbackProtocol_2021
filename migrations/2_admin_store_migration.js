const AdminStore = artifacts.require("AdminStore");
const UCP = artifacts.require("UCPToken");
const USDT = artifacts.require("USDT");


module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(UCP, 10 * 10 ** 8) ;
  const ucp = await UCP.deployed();
  console.log("El address de UCP es: " + ucp.address)
  
  await deployer.deploy(USDT, 10 * 10 ** 8);
  const usdt = await USDT.deployed();
  console.log("El address de USDT es: " + usdt.address)

  
  await deployer.deploy(AdminStore, usdt.address);
  const adminStore = await AdminStore.deployed();
  console.log("El address de admin store es: " + adminStore.address)
};
