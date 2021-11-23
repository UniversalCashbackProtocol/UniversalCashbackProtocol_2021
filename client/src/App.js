import React, { Component, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import CreateStore from "./Components/CreateStore"
import CreatePromotion from "./Components/CreatePromotion"

import AdminProtocol from "./artifacts/contracts/AdminProtocol.sol/AdminProtocol.json"
import Store from "./artifacts/contracts/Store.sol/Store.json"
import UCP from "./artifacts/contracts/UCPToken.sol/UCPToken.json"

import "./App.css";
import ProtocolContext from "./context/ProtocolContext";
import ListStore from "./Components/ListStore";


function App() {
  const { Moralis, authenticate, isAuthenticated, user } = useMoralis();
  const { web3, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, web3EnableError } = useMoralis()
  const [ adminProtocol, setAdminProtocol] = useState(undefined);  
  const [ ucp, setUCP ] = useState(undefined);
  const [ walletAddress, setWalletAddress] = useState(undefined)
  const [w3, setW3] = useState(undefined)

  useEffect(() => {
    Moralis.onAccountsChanged(function(address){
      setWalletAddress(address[0])
    })
  });

  useEffect(
    () => setWalletAddress(web3.givenProvider.selectedAddress || user.get("ethAddress")),
    [web3, user]
  )
  
  useEffect(() => {
      const init = async() => {
        try {
          
          const wb3 = await Moralis.enableWeb3()
                          
          const protocolContract = new wb3.eth.Contract(AdminProtocol.abi, "0xb89cd5247A1c05dC9A11300C3D3d0EC0d0e55d41");          
          const ucpContract = new wb3.eth.Contract(UCP.abi, UCP.address);
          
          setAdminProtocol(protocolContract)          
          setUCP(ucpContract)
          setW3(wb3)
          
        } catch (error) {
          alert(
            `failed to load Contracts`,
          );
        }
      }
      init();
  }, []);

  if(typeof adminProtocol === 'undefined' ){
   
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  if (!isAuthenticated && !isWeb3Enabled) {
    return (
      <div>
        <button onClick={() => authenticate()}>Authenticate</button>
      </div>
    );
  }
  return (
    <ProtocolContext.Provider value={{w3, adminProtocol, ucp, walletAddress, Moralis}}>
    <div className="container">
      <div>
        <h1>Account: {walletAddress}</h1>               
      </div>
      <div>
        <CreateStore />        
        <ListStore />
      </div>
    </div>
    </ProtocolContext.Provider>
  );
}

export default App;
