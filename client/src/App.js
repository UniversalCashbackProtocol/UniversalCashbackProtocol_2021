import React, { Component, useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import { useMoralis } from "react-moralis";

import "./App.css";

function App() {
  const { authenticate, isAuthenticated, user } = useMoralis();
  const { web3, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, web3EnableError } = useMoralis()
  const { adminProtocol, setAdminProtocol } = useState(undefined);
  
  useEffect( () => {
    const init = async() => {
      try {
        
      } catch (error) {
        alert("Failed to load information")
      }
    }
  })
  

  if (!isWeb3Enabled) {
    return (
      <div>
        <button onClick={() => authenticate()}>Authenticate</button>
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome {user.get("username")}</h1>
    </div>
  );
}

export default App;
