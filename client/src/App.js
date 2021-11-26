import React, { Component, useEffect, useState } from "react";
import { useMoralis, ByMoralis } from "react-moralis";

import AdminProtocol from "./artifacts/contracts/AdminProtocol.sol/AdminProtocol.json"
import Store from "./artifacts/contracts/Store.sol/Store.json"
import UCP from "./artifacts/contracts/UCPToken.sol/UCPToken.json"
import USDT from "./artifacts/contracts/USDT.sol/USDT.json"
 
import "./App.css";
import ProtocolContext from "./context/ProtocolContext";
import BuyProduct from "./Components/BuyProduct"
import ClaimCashBack from "./Components/ClaimCashBack";
import Information from "./Components/Information";
const { contracts } = require ('./env/data.json')


function App() {
  const adminProtocolAddress = contracts.AdminProtocol.address
  const storeAddress = contracts.Store.address
  const ucpAddress = contracts.UCP.address
  const usdtAddress = contracts.USDT.address

  const { Moralis, authenticate, isAuthenticated, user } = useMoralis();
  const { web3, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, web3EnableError } = useMoralis()
  const [ adminProtocol, setAdminProtocol] = useState(undefined);  
  const [ store, setStore ] = useState(undefined);
  const [ ucp, setUCP ] = useState(undefined);
  const [ usdt, setUSDT ] = useState(undefined);
  const [ walletAddress, setWalletAddress] = useState(undefined)
  const [ w3, setW3] = useState(undefined) 


  useEffect(() => {
    Moralis.onAccountsChanged(function(address){
      setWalletAddress(address[0])
    })
  });

  useEffect(
    () => { enableWeb3(); setWalletAddress(web3.givenProvider.selectedAddress) },
    [web3]
  )
  
  useEffect(() => {
      const init = async() => {
        try {
          
          const wb3 = await Moralis.enableWeb3()
                          
          const protocolContract = new wb3.eth.Contract(AdminProtocol.abi, adminProtocolAddress);      
          const storeContract = new wb3.eth.Contract(Store.abi, storeAddress);    
          const ucpContract = new wb3.eth.Contract(UCP.abi, ucpAddress);          
          const usdtContract = new wb3.eth.Contract(USDT.abi, usdtAddress);
                    
          setAdminProtocol(protocolContract)                    
          setStore(storeContract)
          setUCP(ucpContract)
          setUSDT(usdtContract)
          setW3(wb3)

          
        } catch (error) {
          alert(
            `failed to load Contracts`,
          );
        }
      }
      init();
  }, []);


  if((typeof store === 'undefined') 
        || (typeof adminProtocol === 'undefined') 
        || (typeof ucp === 'undefined')
        || (typeof walletAddress === 'undefined')
        || (typeof usdt === 'undefined') )
  {   
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  if (!isAuthenticated && !isWeb3Enabled) {
    return (
      <div className="row justify-content-center">
      
        <button className="btn btn-primary  btn-lg" onClick={() => authenticate()}>Please press to Authenticate</button>
      </div>
    );
  }
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
}

export default App;
