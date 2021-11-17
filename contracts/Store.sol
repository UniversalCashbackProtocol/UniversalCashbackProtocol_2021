// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./IUCPToken.sol";
import "./AdminProtocol.sol";

contract Store{
    uint256 private id;
    uint256 private qtyPromotions;
    uint256 private qtyProducts;
    uint256 private counterProductsAsigned;
    uint256 immutable private MINIMUN_TOKEN = 1 * 10 ** 18;    
    string private nameStore;
    address private contractOwner;
    address private CONTRACT_PROTOCOL;

    ERC20 private USDT;
    IUCPToken private UCT;    
    AdminProtocol private protocol;

    struct Promotion{
        uint256 id;
        uint256 startDate;
        uint256 endDate;
        bool active;
        uint256 initialTokens;
        uint256 currentTokens;
    }
    
    struct Product{
        uint256 id;
        string SKU;
        uint256 price;
        uint256 tokenGivens;
    }
    
    struct ProductAsigned{
        uint idProduct;
        uint idPromotion;
        bool asigned;
    }
    
    //mapping(address => address) tokenPriceFeedMapping;
    mapping(uint256 => Product) products;
    mapping(uint256 => Promotion) promotions;    
    mapping(uint256 => mapping(uint256 => ProductAsigned)) productsInPromotions;
    //mapping(uint256 => ProductAsigned) productsInPromotions;
    
    constructor(address _owner, uint256 _id, string memory _nameStore, address _usdt, IUCPToken _uct, address _protocol ){
        require(_owner != address(0) && _id > 0, "address must be valid and Id must be equal or greater than zero");
        id = _id;
        qtyPromotions = 1;
        nameStore = _nameStore;
        contractOwner = _owner;
        counterProductsAsigned = 0;
        USDT = ERC20(_usdt);
        UCT = _uct;
        CONTRACT_PROTOCOL = _protocol;
        protocol = AdminProtocol(_protocol);
    } 
    
    function buyToken(uint256 _amount, address _token) public {  
        require(_amount >= MINIMUN_TOKEN, "Amount must be greather tan 1");
        uint256 toPay = protocol.calculateUSDPricePerToken(_amount, _token);                            
        //Solicita el pago en USDT - El <address _token> permite que sea dinamico
        USDT.transferFrom(msg.sender, address(this), toPay);         
        //USDT.transferFrom(msg.sender, address(this), totalToPay / (10 ** 6));             
        protocol.updateAddressesAllowedToMint(_amount, id);
        //Mintea la cantidad de Tokens  
        UCT.mintToken(_amount); 
        //Transfiere los USDT al Contrato que Administra el Protocolo
        USDT.transfer(CONTRACT_PROTOCOL, toPay);     
    }

    function createPromotion(uint _startDate, uint _endDate, uint _initialTokens) isOwner public{
        promotions[qtyPromotions] = Promotion(qtyPromotions, _startDate, _endDate, true, _initialTokens, _initialTokens);
        qtyPromotions++;
    }
    
    function assignProductToPromotion(uint _idPromotion, uint _idProduct) isOwner public{
        require(_idProduct > 0 && _idPromotion > 0, "Ids must be greater than zero");
        Promotion memory prom = getPromotionById(_idPromotion);
        Product memory prod = getProductById(_idProduct);        
        productsInPromotions[_idPromotion][_idProduct] = ProductAsigned(prod.id, prom.id, true);        
        counterProductsAsigned++;
    }
    
    function unAssignProductToPromotion(uint _idPromotion, uint _idProduct) isOwner public{        
        require(isProductAsigned(_idProduct, _idPromotion) == true, "Product has not been asigned");
        productsInPromotions[_idPromotion][_idProduct] = ProductAsigned(_idProduct, _idPromotion, false);
    }

    function isProductAsigned(uint _idPromotion, uint _idProduct) internal view returns(bool){
        require( _idProduct > 0 && _idPromotion > 0, "Ids must be greater than zero");  
        ProductAsigned memory prods = productsInPromotions[_idPromotion][_idProduct];  
        
        if(prods.idProduct == _idProduct){
            return true;
        }else{
            return false;
        }
    }

    function buyProduct(uint _idPromotion, uint _idProduct) public {
        require(isProductAsigned(_idPromotion, _idProduct) == true, "Product has not been asigned");
        Product memory pd = getProductById(_idProduct);
        Promotion memory pm = getPromotionById(_idPromotion);
        require(pm.currentTokens >= pd.tokenGivens, "The promotion does not have enough UCT to give!");
        pm.currentTokens -= pd.tokenGivens;
        USDT.transferFrom(msg.sender, address(this), pd.price);  
        UCT.transfer(msg.sender, pd.tokenGivens);        
    }  
    
    function getPromotionById(uint256 _id) public view returns (Promotion memory){
        require(_id > 0, "Id must be greater than zero");
        Promotion memory p = promotions[_id];
        require(p.id > 0, "Promotion does not exist");
        return p;
    }
    
    function getProductById(uint256 _id) public view returns (Product memory){
        require(_id > 0, "Id must be greather than zero");
        Product memory p = products[_id];
        require(p.id > 0, "Product does not exist");
        return p;
    }
    
    function createProduct(string memory _SKU, uint256 _priceProduct, uint256 _tokensPerProduct) isOwner public{
        require(_priceProduct >= 0 && _tokensPerProduct >= 0, "Price product and tokens to be asigned must be equal or greater than zero");
        products[qtyProducts] = Product(qtyProducts, _SKU, _priceProduct, _tokensPerProduct);
        qtyProducts++;
    }
    
    function owner() public view returns(address){
        return contractOwner;
    }
    
    modifier isOwner(){
        require(msg.sender == contractOwner);
        _;
    }
}
