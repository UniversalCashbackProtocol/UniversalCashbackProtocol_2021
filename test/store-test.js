const { expect } = require("chai");
const { ethers } = require("hardhat");
const storeABI = require("../artifacts/contracts/Store.sol/Store.json")


describe("Store Contract", function () {
  it.skip("Should be deployed", async function () {
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
    
    
    // Setea el contrato del protocolo para poder mintear tokens
    const setAdminProtocol = ucp.setContractProtocol(adminProtocol.address);
    
    
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

    const pay10 = await adminProtocol.calculatePricePerToken(ethers.utils.parseEther('100'), USDTContract);


    console.log("El monto en USDT x 10 a pagar es: " + ethers.utils.formatUnits(pay10, 6));
   

    const priceUSDT = await adminProtocol.getTokenPriceByChainlink(USDTContract);
    console.log("El precio de USDT es: " + ethers.utils.formatUnits(priceUSDT, 8));
    
    
    let contractAmount = await usdt.balanceOf(adminProtocol.address)
    let deployerAmount = await usdt.balanceOf(deployer.address)
    let finalAllowance = await usdt.allowance(deployer.address, localStore.address)

    contractAmount = ethers.utils.formatUnits(contractAmount, 6)
    deployerAmount = ethers.utils.formatUnits(deployerAmount, "ether")
    finalAllowance = ethers.utils.formatUnits(finalAllowance, "ether")
    
    console.log("The amount of USDT of the store when displayed are:" + contractAmount);
    console.log("The USDT amount of the deployer is: " + deployerAmount);
    console.log("The final allowance in USDT is:" + finalAllowance);

    let ucpStoreContract = await ucp.balanceOf(localStore.address);

    console.log("The store NOW! Contract has UCP: " + await ethers.utils.formatUnits(ucpStoreContract, "ether"));

    let deployerUCPAmount = await ucp.balanceOf(deployer.address);
    console.log("El usuario tiene UCP " + ethers.utils.formatUnits(deployerUCPAmount, "ether"));
    
    
    //let amountToClaim = await adminProtocol.calculateQtyTokenClaim(, USDTContract);
    let uctQuantity = "10"
    let uctQuantity2 = "100"
    let amountToClaim = await adminProtocol.calculateQtyTokenClaim(ethers.utils.parseEther(uctQuantity), USDTContract);
    let amountToClaim2 = await adminProtocol.calculateQtyTokenClaim(ethers.utils.parseEther(uctQuantity2), USDTContract);
    console.log("The amount to claim in USD x " + uctQuantity + " UCT is: " + ethers.utils.formatUnits(amountToClaim,6));
    console.log("The amount to claim in USD x " + uctQuantity + " UCT is: " + ethers.utils.formatUnits(amountToClaim2,6));
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

  it.skip("creates new product", async function(){
    const [deployer] = await ethers.getSigners();
    let chainlinkUSDTContract = "0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60";
    let USDTContractAddress = "0x13512979ADE267AB5100878E2e0f485B568328a4";

    const UCPToken = await hre.ethers.getContractFactory("UCPToken");
    const USD = await hre.ethers.getContractFactory("USDT");    
    const Store = await ethers.getContractFactory("Store");
    const AdminProtocol = await hre.ethers.getContractFactory("AdminProtocol");
    
    const usdt = await USD.deploy( ethers.utils.parseEther('100000'));
    await usdt.deployed();  

    const ucp = await UCPToken.deploy(usdt.address);
    await ucp.deployed();
    

    const adminProtocol = await AdminProtocol.deploy(usdt.address, ucp.address);
    await adminProtocol.deployed();
    
    const storeByAdminProtocol = await adminProtocol.createStore("Coffe Shop");
    const infoStore = await adminProtocol.getInfoStore(1)
    //const localStore = await new ethers.Contract(infoStore.contractAddress, JSON.stringify(storeABI.abi), deployer)    
    const localStore = await Store.attach('0x039C6Aae269C6398d262Cf781f170899A09e7693');

    const resApprove = await usdt.approve(localStore.address, ethers.utils.parseEther('1000000'))
    
    await ucp.setContractProtocol(adminProtocol.address)
    await adminProtocol.addTokenToPriceFeed(USDTContract, chainlinkUSDTContract);

    await localStore.createPromotion("Summer Promotion", ethers.utils.parseEther('10000000'), usdt.address)
    
    await localStore.createProduct("Burger", ethers.utils.parseEther('10'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Soda", ethers.utils.parseEther('10'), ethers.utils.parseEther('2'))
    await localStore.createProduct("Coffe", ethers.utils.parseEther('7'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Donut", ethers.utils.parseEther('2'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Brownie", ethers.utils.parseEther('15'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Pancake", ethers.utils.parseEther('2'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Carrot Cake", ethers.utils.parseEther('5'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Double Burger", ethers.utils.parseEther('20'), ethers.utils.parseEther('5'))
    await localStore.createProduct("Cheese Burger", ethers.utils.parseEther('8'), ethers.utils.parseEther('2'))

    console.log("El producto es: " + await localStore.getProductById(1))    

    await localStore.assignProductToPromotion(1, 1)
    await localStore.assignProductToPromotion(1, 2)
    await localStore.assignProductToPromotion(1, 3)
    await localStore.assignProductToPromotion(1, 4)
    await localStore.assignProductToPromotion(1, 5)
    await localStore.assignProductToPromotion(1, 6)
    await localStore.assignProductToPromotion(1, 7)
    await localStore.assignProductToPromotion(1, 8)
    await localStore.assignProductToPromotion(1, 9)

    const promotion = await localStore.getPromotionById(1)
    const usdtBalance = await usdt.balanceOf(deployer.address)
    const ucpBalance = await ucp.balanceOf(deployer.address)

    console.log("Promotion Inicial: "+ ethers.utils.formatUnits(promotion.initialTokens, 18));
    console.log("Promotion Inicial 2: "+ ethers.utils.formatUnits(promotion.currentTokens, 18));

    console.log("USDT Balance: "+ ethers.utils.formatUnits(usdtBalance, 18))
    console.log("UCP Balance: "+ ethers.utils.formatUnits(ucpBalance, 18))

    await localStore.buyProduct(1,1)
    await localStore.buyProduct(1,2)
    await localStore.buyProduct(1,3)
    await localStore.buyProduct(1,4)
    await localStore.buyProduct(1,5)
    await localStore.buyProduct(1,6)
    await localStore.buyProduct(1,7)
    await localStore.buyProduct(1,8)
    await localStore.buyProduct(1,9)
    
    const promotion2 = await localStore.getPromotionById(1)
    const usdtBalance2 = await usdt.balanceOf(deployer.address)
    const ucpBalance2 = await ucp.balanceOf(deployer.address)

    console.log("Promotion Inicial: "+ ethers.utils.formatUnits(promotion2.initialTokens, 18));
    console.log("Promotion Inicial 2: "+ ethers.utils.formatUnits(promotion2.currentTokens, 18));
    
    console.log("USDT Balance: "+ ethers.utils.formatUnits(usdtBalance2, 18))
    console.log("UCP Balance: "+ ethers.utils.formatUnits(ucpBalance2, 18))
        
  });

  it("creates new product with deployed contracts", async function(){
    const [deployer] = await ethers.getSigners();

    let chainlinkUSDTContract = "0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60";
    let USDTContractAddress = "0x13512979ADE267AB5100878E2e0f485B568328a4";
  
    const UCPToken = await ethers.getContractFactory("UCPToken");
    const Store = await ethers.getContractFactory("Store");
    const AdminProtocol = await ethers.getContractFactory("AdminProtocol");
    const USDTToken = await ethers.getContractFactory("USDT");
    
    const localStore = await Store.attach('0x039C6Aae269C6398d262Cf781f170899A09e7693');
    const ucp = await UCPToken.attach('0x849995aD50C5C7945033fC3729Af5AB3670De696')
    
    const admin = await AdminProtocol.attach('0x866bA9AF665eCFa6828be0a61B8F4753C35D8691')
    const usdt = await USDTToken.attach(USDTContractAddress)
    
    //await localStore.createPromotion("Summer Promotion", ethers.utils.parseEther('10000000'), USDTContractAddress)

    //const setAdminProtocol = ucp.setContractProtocol(admin.address);
    
    
    /*
    await localStore.createProduct("Burger", ethers.utils.parseEther('10'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Soda", ethers.utils.parseEther('10'), ethers.utils.parseEther('2'))
    await localStore.createProduct("Coffe", ethers.utils.parseEther('7'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Donut", ethers.utils.parseEther('2'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Brownie", ethers.utils.parseEther('15'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Pancake", ethers.utils.parseEther('2'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Carrot Cake", ethers.utils.parseEther('5'), ethers.utils.parseEther('1'))
    await localStore.createProduct("Double Burger", ethers.utils.parseEther('20'), ethers.utils.parseEther('5'))
    await localStore.createProduct("Cheese Burger", ethers.utils.parseEther('8'), ethers.utils.parseEther('2'))

    console.log("El producto es: " + await localStore.getProductById(1))    

    await localStore.assignProductToPromotion(1, 1)
    await localStore.assignProductToPromotion(1, 2)
    await localStore.assignProductToPromotion(1, 3)
    await localStore.assignProductToPromotion(1, 4)
    await localStore.assignProductToPromotion(1, 5)
    await localStore.assignProductToPromotion(1, 6)
    await localStore.assignProductToPromotion(1, 7)
    await localStore.assignProductToPromotion(1, 8)
    await localStore.assignProductToPromotion(1, 9)

    const promotion = await localStore.getPromotionById(1)
    const usdtBalance = await usdt.balanceOf(deployer.address)
    const ucpBalance = await ucp.balanceOf(deployer.address)

    console.log("Promotion Inicial: "+ ethers.utils.formatUnits(promotion.initialTokens, 18));
    console.log("Promotion Inicial 2: "+ ethers.utils.formatUnits(promotion.currentTokens, 18));

    console.log("USDT Balance: "+ ethers.utils.formatUnits(usdtBalance, 18))
    console.log("UCP Balance: "+ ethers.utils.formatUnits(ucpBalance, 18))
    */
    await localStore.buyProduct(1,1)
    /*
    await localStore.buyProduct(1,2)
    await localStore.buyProduct(1,3)
    await localStore.buyProduct(1,4)
    await localStore.buyProduct(1,5)
    await localStore.buyProduct(1,6)
    await localStore.buyProduct(1,7)
    await localStore.buyProduct(1,8)
    await localStore.buyProduct(1,9)
    
    const promotion2 = await localStore.getPromotionById(1)
    const usdtBalance2 = await usdt.balanceOf(deployer.address)
    const ucpBalance2 = await ucp.balanceOf(deployer.address)

    console.log("Promotion Inicial: "+ ethers.utils.formatUnits(promotion2.initialTokens, 18));
    console.log("Promotion Inicial 2: "+ ethers.utils.formatUnits(promotion2.currentTokens, 18));
    
    console.log("USDT Balance: "+ ethers.utils.formatUnits(usdtBalance2, 18))
    console.log("UCP Balance: "+ ethers.utils.formatUnits(ucpBalance2, 18))
    */
        
  });
});
