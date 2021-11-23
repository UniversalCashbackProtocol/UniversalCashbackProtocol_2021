import React, { useState, useEffect } from "react"
import ProtocolContext from "../context/ProtocolContext"

function CreateProduct(){
    const protocolContext = useContext(ProtocolContext)
    const { w3, adminProtocol, store, ucp, walletAddress} = protocolContext

    const returnOptions = (storeAddress) => {
        const options = {
            contractAddress: "0xA94c1f9a709167878c05e5DF9C40315297377769",
            functionName: "createProduct",
            abi: Store.abi,
            params: {
                _SKU: "BURGER",          
                _priceProduct: 10,
                _tokensPerProduct: 10
            },
        };

        return options;
    }

    const onSubmit = (form) => {
        form.preventDefault();
        
        console.log(form)

        const newProduct = await Moralis.executeFunction(options)
        console.log(newProduct)
    }
}

return(
    <div>
    <h1>Create Product</h1>
    <form onSubmit={onSubmit} >
        <label>Store: </label>
        <input type="text" text="Store" id="Store" placeholder={item.contractAddress} defaultValue={item.contractAddress}/>
        <label>SKU: </label>
        <input type="text" text="SKU" id="SKU" />
        <label>Price: </label>
        <input type="text" text="Price" id="Price" />
        <label>Cashback: </label>
        <input type="text" text="Cashback" id="Cashback" />
        <button type="submit" className="btn btn-primary m-2">Create Product</button>
    </form>
</div>
)