## Universal Cashback Protocol
https://user-images.githubusercontent.com/85961824/143723368-182ae4c4-2ffe-4463-852b-30a1c3990f41.mp4
```javascript
{
    "contracts": {
        "UCP": {
            "address": "0x1c182A3c6f9356369186f06C22099Da306946Fe6"
        },
        "AdminProtocol": {
            "address": "0xEBfE5590bf4181D18309E711a1A3B117Aa914D1c"
        },
        "Store": {
            "address": "0x49A582096b380c89a6978e5Ba4c8eF5792D6bd91"
        },
        "USDT": {
            "address": "0xbd21a10f619be90d6066c941b04e340841f1f989"
        }
    }
}
```
**What is the Universal Cashback Protocol?**

Universal Cashback Protocol was born as a decentralized solution for the cashback service using smart contracts, without intermediaries, using UCP (Universal Cashback Protocol) as token.
The initial proposal developed works as follows: 
Affiliate companies can generate rewards with UCP tokens for the purchase of products, by accumulating UCP for purchases, it allows the user to exchange UCP tokens for USDT and buy more products.


**General objectives:**


•	Promote the inclusion of people without technical knowledge in the Crypto economy through granting Cashback benefits in a simple way.

•	Adopt Blockchain technology in everyday use cases.

•	Expose to the general population the benefits and options obtained from decentralization.

**What does this project contribute to the community?**

We believe that everyone wins: The idea is that more people can approach the ecosystem of Blockchain and cryptocurrencies in a more friendly way. And all people make purchases of different products on a daily basis.
Consumers: they will be happy to make a profit on their purchases.
Companies: we provide the tools for a simple cashback process avoiding bureaucracy and technical knowledge.
It may sound utopian, but we believe that with this project we are contributing to build freedom, and for us that is priceless.

**Actual infrastructure:**

![](https://user-images.githubusercontent.com/94859113/143722304-e3edd3db-c1e1-4a72-acfe-f6220ddc30ff.jpg)

**Scripts:**
```javascript
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
```
**Dependecies:**
```javascript
"devDependencies": {
    "@nomiclabs/hardhat-ethers": "^2.0.0",
    "@nomiclabs/hardhat-etherscan": "^2.1.8",
    "@nomiclabs/hardhat-waffle": "^2.0.0",
    "chai": "^4.2.0",
    "dotenv": "^10.0.0",
    "eslint": "^6.1.0",
    "ethereum-waffle": "^3.0.0",
    "ethers": "^5.0.0",
    "hardhat": "^2.6.8",
    "hardhat-gas-reporter": "^1.0.4",
    "prettier": "^2.3.2",
    "prettier-plugin-solidity": "^1.0.0-beta.13",
    "solhint": "^3.3.6",
    "solidity-coverage": "^0.7.16"
  },
    "dependencies": {
    "@chainlink/contracts": "^0.2.2",
    "@openzeppelin/contracts": "^4.3.2",
    "moralis": "^0.0.134",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-moralis": "^0.3.0",
    "react-scripts": "3.2.0"
  },
 ```
 **Web Moralis:**
  ```html
   return (
    <ProtocolContext.Provider value={{w3, adminProtocol, ucp, store, usdt, walletAddress, Moralis }}>
    <div className="container">
      <div>
        <Information />
      </div>
      <div>
        <h1>Account: {walletAddress}</h1>               
      </div>
      <div className="row justify-content-center">     
        <BuyProduct />
        <ClaimCashBack  />
      </div>
      <div className="row alignt-center m-5 justify-content-center">
        <ByMoralis width={220} variant="dark" />
      </div>
    </div>
    </ProtocolContext.Provider>
  );
 ```
 **Summer Promotion (example)**
  ```solidity
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
 ```
 **Create New Product:**
 ```solidity
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
```
### Link to full documentation:

`Paper UCP` :[PaperUCP.pdf](https://github.com/UniversalCashbackProtocol/UniversalCashbackProtocol_2021/files/7614055/PaperUCP.pdf)


