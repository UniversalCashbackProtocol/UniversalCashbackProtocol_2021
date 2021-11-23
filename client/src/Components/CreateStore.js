import React, { Component, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import ProtocolContext from "../context/ProtocolContext"
import AdminProtocol from "../artifacts/contracts/AdminProtocol.sol/AdminProtocol.json"
require('dotenv').config()


function CreateStore() {
    const {web3, adminProtocol, store, ucp, walletAddress} = ProtocolContext
    const { Moralis } = useMoralis();
    const adminProtocolAddress = "0xb89cd5247A1c05dC9A11300C3D3d0EC0d0e55d41"

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