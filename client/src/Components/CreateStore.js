import React, { useContext, Component, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import ProtocolContext from "../context/ProtocolContext"
import AdminProtocol from "../artifacts/contracts/AdminProtocol.sol/AdminProtocol.json"
require('dotenv').config()


function CreateStore() {
    const protocolContext = useContext(ProtocolContext)
    const {web3, adminProtocol, store, ucp, walletAddress, Moralis, adminProtocolAddress} = protocolContext

    
    const options = {
        contractAddress: adminProtocolAddress,
        functionName: "createStore",
        abi: AdminProtocol.abi,
        params: {
          _name: "Demo Store",          
        },
    };

    const onSubmit = async (form) => {
        form.preventDefault();
        
        
        let name = form.target.Name.value
        
        const newStore = await Moralis.executeFunction(options)
    }

    return(
        <form onSubmit={onSubmit}>
           <label>Name Store</label>
            <input type="text" text="Name" id="Name" placeholder="name"/>
            <button type="submit" className="btn btn-primary m-2">Create Store</button>  
        </form>
    )
}

export default CreateStore;