import React, { Component, useContext, useEffect, useState } from "react";
import Store from "../artifacts/contracts/Store.sol/Store.json"
import ProtocolContext from "../context/ProtocolContext"

function BuyProduct() {
    const protocolContext = useContext(ProtocolContext)
    const { w3, adminProtocol, store, ucp, usdt, walletAddress, adminProtocolAddress, Moralis } = protocolContext
    const [products, setProducts] = useState([])
    const [qtyProducts, setQtyProducts] = useState(0)

    const getQtyProducts = async () => {
        let qty = await store.methods.getQtyProducts().call()
        setQtyProducts(qty)
    }

    const getProducts = async () => {
        let products = []

        for (let i = 1; i < qtyProducts; i++) {
            const auxProduct = await store.methods.getProductById(i).call()
            products.push(auxProduct)
        }

        setProducts(products)
    }

    const returnOptions = (address, functionName, idProduct) => {
        const options = {
            contractAddress: address,
            functionName: functionName,
            abi: Store.abi,
            params: {
                _idPromotion: 1,
                _idProduct: idProduct
            },
            awaitReceipt: false
        };

        return options;
    }

    const onSubmit = async (form) => {
        form.preventDefault();

        const opts = {
            owner_address: walletAddress,
            spender_address: store._address,
            address: "0xbd21a10f619be90d6066c941b04e340841f1f989",
            chain: "mumbai"
        };

        const allowance = await Moralis.Web3API.token.getTokenAllowance(opts);

        if (allowance.allowance == 0) {
            const tx1 = await usdt.methods.approve(store._address, Moralis.Units.ETH("1000000")).send({ from: walletAddress })
        } else {
            let idProduct = form.target.IdProduct.value
            const options = returnOptions(store._address, "buyProduct", idProduct)

            const tx = await Moralis.executeFunction(options)

            tx.on("transactionHash", (hash) => { })
                .on("receipt", (receipt) => { })
                .on("confirmation", (confirmationNumber, receipt) => { })
                .on("error", (error) => { });
        }
    }

    useEffect(() => {
        getQtyProducts()
    }, [])

    useEffect(() => {
        getProducts()
    }, [qtyProducts])

    if (products.length === 0) {
        return (
            <div className="text-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading Products...</span>
            </div>
            </div>
        )
    }
    return (
        <div className="border rounded-3">
            <h1>Buy Products</h1>
            <div className="row  justify-content-center  p-2">
                {products.map((item, i) => {
                    return (
                        <div className="col-lg-2 border border-primary rounded-3 p-3 m-1 bg-black text-white" key={i} >
                            <form onSubmit={onSubmit} id={"productForm" + i}>
                                <label>ID Product </label>
                                <input type="text" id="IdProduct" defaultValue={item.id} className="form-control" readOnly />
                                <label>Name </label>
                                <input type="text" id="ProductName" defaultValue={item.SKU} className="form-control" readOnly/>
                                <label>Price USDT </label>
                                <label className="form-control">{Moralis.Units.FromWei(item.price, 6)} </label>
                                <label>UCP Givens </label>
                                <label className="form-control">{Moralis.Units.FromWei(item.tokenGivens, 18)}</label>
                                <div className="d-grid gap-2 mt-2">
                                    <button type="submit" className="btn btn-primary">Buy Product</button>
                                </div>

                            </form>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default BuyProduct;