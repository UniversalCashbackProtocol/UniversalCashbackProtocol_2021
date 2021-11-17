const { expect } = require("chai");
const { ethers } = require("hardhat");
const storeABI = require("../artifacts/contracts/Store.sol/Store.json")


describe("Store Contract", function () {
  it("Should be deployed", async function () {
    const [deployer] = await ethers.getSigners();

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

    
    const storeByAdminProtocol = await adminProtocol.createStore("McDonalds");
    const infoStore = await adminProtocol.getInfoStore(1)
    const localStore = await new ethers.Contract(infoStore.contractAddress, JSON.stringify(storeABI.abi), deployer)    
    
    
    const setAdminProtocol = ucp.setContractProtocol(adminProtocol.address);
    //await ucp.transfer(deployer.address, 100000)
    
    const contractAmountPrev = await usdt.balanceOf(localStore.address)
    const deployerAmountPrev = await usdt.balanceOf(deployer.address)
    
    console.log("La cantidad de USDT de la tienda al desplegarse son: " + ethers.utils.formatUnits(contractAmountPrev, "ether") );
    console.log("La cantidad de USDT del deployer son: " + ethers.utils.formatUnits(deployerAmountPrev, "ether"));

    const resApprove = await usdt.approve(localStore.address, ethers.utils.parseEther('1000000'))
    const allowance = await usdt.allowance(deployer.address, localStore.address)    

    console.log("El allowance del contrato es: " + allowance);
    console.log("El contrato store en un inicio tiene UCP: " + await ucp.balanceOf(localStore.address));
    
    //Contract Price Feed USDT Mainnet Etherem
    let chainlinkUSDTContract = "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D";
    //USDT contract Mainnet Etherem
    let USDTContract = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    
    await adminProtocol.addTokenToPriceFeed(USDTContract, chainlinkUSDTContract);

    let contractAmount1 = await usdt.balanceOf(localStore.address)
    let deployerAmount1 = await usdt.balanceOf(deployer.address)
    let finalAllowance1 = await usdt.allowance(deployer.address, localStore.address)

    contractAmount1 = ethers.utils.formatUnits(contractAmount1, "ether")
    deployerAmount1 = ethers.utils.formatUnits(deployerAmount1, "ether")
    finalAllowance1 = ethers.utils.formatUnits(finalAllowance1, "ether")

    const buy10 = await localStore.buyToken(ethers.utils.parseEther('10'), USDTContract);

    const pay10 = await adminProtocol.calculateUSDPricePerToken(ethers.utils.parseEther('100'), USDTContract);


    console.log("El monto en USDT x 10 a pagar es: " + ethers.utils.formatUnits(pay10, 6));
   

    const priceUSDT = await adminProtocol.getTokenPriceByChainlink(USDTContract);
    console.log("El precio de USDT es: " + ethers.utils.formatUnits(priceUSDT, 8));
    
    
    let contractAmount = await usdt.balanceOf(adminProtocol.address)
    let deployerAmount = await usdt.balanceOf(deployer.address)
    let finalAllowance = await usdt.allowance(deployer.address, localStore.address)

    contractAmount = ethers.utils.formatUnits(contractAmount, 6)
    deployerAmount = ethers.utils.formatUnits(deployerAmount, "ether")
    finalAllowance = ethers.utils.formatUnits(finalAllowance, "ether")
    
    console.log("La cantidad de USDT del contrato admin protocol es: " + contractAmount);
    console.log("La cantidad de USDT del deployer es: " + deployerAmount);
    console.log("El allowance final en USDT es: " + finalAllowance);

    let ucpStoreContract = await ucp.balanceOf(localStore.address);

    console.log("El contrato store AHORA! tiene UCP: " + await ethers.utils.formatUnits(ucpStoreContract, "ether"));

    let deployerUCPAmount = await ucp.balanceOf(deployer.address);
    console.log("El usuario tiene UCP " + ethers.utils.formatUnits(deployerUCPAmount, "ether"));
    
    
    //let amountToClaim = await adminProtocol.calculateQtyTokenClaim(, USDTContract);
    let uctQuantity = "10"
    let uctQuantity2 = "100"
    let amountToClaim = await adminProtocol.calculateQtyTokenClaim(ethers.utils.parseEther(uctQuantity), USDTContract);
    let amountToClaim2 = await adminProtocol.calculateQtyTokenClaim(ethers.utils.parseEther(uctQuantity2), USDTContract);
    console.log("El monto a reclamar en USD x " + uctQuantity + " UCT es: " + ethers.utils.formatUnits(amountToClaim,6));
    console.log("El monto a reclamar en USD x " + uctQuantity + " UCT es: " + ethers.utils.formatUnits(amountToClaim2,6));
    //console.log("El monto a reclamar en USD x UCT es: " + ethers.utils.formatUnits(amountToClaim, "ether"));
    //let claimCashBack = await adminProtocol.claimCashBack(1);
    
  });

  it.skip("should return valid price", async function(){
    const [deployer] = await ethers.getSigners();

    const UCPToken = await hre.ethers.getContractFactory("UCPToken");
    const USD = await hre.ethers.getContractFactory("USDT");
    const Store = await hre.ethers.getContractFactory("Store");
    
    const usdt = await USD.deploy(ethers.utils.parseEther('100000000'));
    await usdt.deployed();
  
    const ucp = await UCPToken.deploy(usdt.address);
    await ucp.deployed();
    const store = await Store.deploy(deployer.address, 1, "McDonalds", usdt.address, ucp.address); 

    let chainlinkUSDTContract = "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D";
    let USDTContract = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    let resultAddPriceFeed = await store.addTokenToPriceFeed(USDTContract, chainlinkUSDTContract);

    const priceFeed = await store.getTokenPriceByChainlink(USDTContract)
    
    console.log("El precio es: " + priceFeed);
  });
});
