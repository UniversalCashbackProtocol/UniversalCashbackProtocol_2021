import React, { Component, useContext, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import AdminProtocol from "../artifacts/contracts/AdminProtocol.sol/AdminProtocol.json"
import Store from "../artifacts/contracts/Store.sol/Store.json"
import ProtocolContext from "../context/ProtocolContext"


function ListStore() {
    const protocolContext = useContext(ProtocolContext)
    const { w3, adminProtocol, store, ucp, walletAddress} = protocolContext
    const { Moralis } = useMoralis();
    const [storeQuantity, setStoreQuantity] = useState(0)
    const [mapStores, setMapStore] = useState([])
    
    
    const loadStores = async() => {    
        let qty = await adminProtocol.methods.getStoreQuantity().call()
        qty--
        setStoreQuantity(qty)
    }

    const getStoresById =  async() => {
        let stores = []

        for (let i = 1; i <= storeQuantity; i++) {
            const auxStore = await adminProtocol.methods.getInfoStore(i).call()            
            stores.push(auxStore)            
        }

        setMapStore(stores)
    }

    useEffect(() => {
        loadStores()        
    },[])

    useEffect(() => {        
        getStoresById()
    },[storeQuantity])

    const returnOptions = (storeAddress) => {
        const options = {
            contractAddress: storeAddress,
            functionName: "createPromotion",
            abi: Store.abi,
            params: {
                _startDate: "10",          
                _endDate: "10",
                _initialTokens: 10000000
            },
        };

        return options;

    }


    const onSubmit = async(form)  => {
        form.preventDefault(); 
        
        let store = form.target.Store.value
        let amount = form.target.UCPAmount.value
        let startDate = form.target.StartDate.value
        let endDate = form.target.EndDate.value

        const options = returnOptions(store)
        console.log(options);
        console.log(store);
        console.log(amount);
        console.log(startDate);
        console.log(endDate);
        
        const newPromotion = await Moralis.executeFunction(options)
    }

    return(
        <div>
            <h1>Stores Affilliated: {storeQuantity}</h1>
            <div>
                {mapStores.map((item, i) => {
                    return (
                        <div key={i}>
                            <div>
                                <label>Store ID: {item.id}</label><br />
                                <label>Owner: {item.owner}</label><br />
                                <label>Name Store: {item.name}</label><br />
                                <label>Promotions: {item.promotionsQty}</label><br />
                                <label>Store Address: {item.contractAddress}</label><br />
                            </div>
                            <div>
                                <h1>Create Promotion</h1>
                                <form onSubmit={onSubmit} >
                                    <label>Store: </label>
                                    <input type="text" text="Store" id="Store" placeholder={item.contractAddress} defaultValue={item.contractAddress}/>
                                    <label>UCP Amount: </label>
                                    <input type="text" text="UCPAmount" id="UCPAmount" />
                                    <label>Start Date: </label>
                                    <input type="text" text="StartDate" id="StartDate" />
                                    <label>End date: </label>
                                    <input type="text" text="EndDate" id="EndDate" />
                                    <button type="submit" className="btn btn-primary m-2">Create Promotion</button>
                                </form>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ListStore;