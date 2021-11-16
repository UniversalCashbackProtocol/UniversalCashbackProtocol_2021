// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./UCPToken.sol";

contract Store{
    uint256 private id;
    uint256 private qtyPromotions;
    uint256 private qtyProducts;
    uint256 private counterProductsAsigned;

    uint256 immutable private MINIMUN_TOKEN = 1 * 10 ** 18;
    uint256 immutable private TAX_TOKEN = 103;

    string private nameStore;
    address private contractOwner;
    address private CONTRACT_PROTOCOL;

    ERC20 private USDT;
    UCPToken private UCT;    
    AdminProtocol private protocol;

    struct Promotion{
        uint256 id;
        uint256 startDate;
        uint256 endDate;
        bool active;
    }
    
    struct Product{
        uint256 id;
        string SKU;
        uint256 price;
        uint256 tokenGivens;
    }
    
    struct ProductAsigned{
        uint256 idProduct;
        bool asigned;
    }
    
    mapping(address => address) tokenPriceFeedMapping;
    mapping(uint256 => Product) products;
    mapping(uint256 => Promotion) promotions;    
    mapping(uint256 => mapping(uint256 => ProductAsigned)) productsInPromotions;
    
    constructor(address _owner, uint256 _id, string memory _nameStore, address _usdt, UCPToken _uct, address _protocol ){
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
    
    function CreateProduct(string memory _SKU, uint256 _priceProduct, uint256 _tokensPerProduct) isOwner public{
        require(_priceProduct >= 0 && _tokensPerProduct >= 0, "Price product and tokens to be asigned must be equal or greater than zero");
        products[qtyProducts] = Product(qtyProducts, _SKU, _priceProduct, _tokensPerProduct);
        qtyProducts++;
    }

    //function buyToken(uint256 _amount, address _token) public view returns (uint256){  
    function buyToken(uint256 _amount, address _token) public {  
        require(_amount >= MINIMUN_TOKEN, "Amount must be greather tan 1");
        uint256 toPay = calculateUSDPricePerToken(_amount, _token);                            
        //Solicita el pago en USDT - El <address _token> permite que sea dinamico
        USDT.transferFrom(msg.sender, address(this), toPay);         
        //USDT.transferFrom(msg.sender, address(this), totalToPay / (10 ** 6));             
        protocol.updateAddressesAllowedToMint(_amount);
        //Mintea la cantidad de Tokens  
        UCT.mintToken(_amount); 
        //Transfiere los USDT al Contrato que Administra el Protocolo
        USDT.transfer(CONTRACT_PROTOCOL, toPay);   
        //return totalToPay / (10 ** 6);    
        //return (totalToPay * 103000) / 10 ** 5;    
    }

    function createPromotion(uint256 _startDate, uint256 _endDate) isOwner public{
        promotions[qtyPromotions] = Promotion(qtyPromotions, _startDate, _endDate, true);
        qtyPromotions++;
    }
    
    function calculateUSDPricePerToken(uint256 _amount, address _token) public view returns(uint256){
        uint256 totalToPay =  (((_amount / 10) / (10 ** (18 - 6))) * (getTokenPriceByChainlink(_token) / (10 ** 2))) / (10 ** 6); 
        return (totalToPay * 103000) / 10 ** 5;      
    }

    function AssignProductToPromotion(uint _idProduct, uint _idPromotion) isOwner public{
        require(_idProduct > 0 && _idPromotion > 0, "Deben ser mayor a cero");
        Promotion memory prom = GetPromotionById(_idPromotion);
        Product memory prod = GetProductById(_idProduct);
        counterProductsAsigned++;
        productsInPromotions[counterProductsAsigned][prom.id] = ProductAsigned(prod.id, true);        
    }
    
    function UnAssignProductToPromotion(uint _idProduct, uint _idPromotion) isOwner public{
        require(_idProduct > 0 && _idPromotion > 0, "Must be equal or greater than <ero");
        Promotion memory prom = GetPromotionById(_idPromotion);
        Product memory prod = GetProductById(_idProduct);
        productsInPromotions[counterProductsAsigned][prom.id] = ProductAsigned(prod.id, false);
    }
    
    function GetPromotionById(uint256 _id) public view returns (Promotion memory){
        require(_id > 0, "Id must be greater than zero");
        Promotion memory p = promotions[_id];
        require(p.id > 0, "Promotion does not exist");
        return p;
    }
    
    function GetProductById(uint256 _id) public view returns (Product memory){
        require(_id > 0, "Id must be greather than zero");
        Product memory p = products[_id];
        require(p.id > 0, "Product does not exist");
        return p;
    }
    
    function BuyProduct() public{
        
    }  
    
    function addTokenToPriceFeed(address token, address priceFeed) isOwner public {
        require(token != address(0) && priceFeed != address(0), "Must be valid addresses");
        tokenPriceFeedMapping[token] =  priceFeed;        
    }
    
    function getTokenPriceByChainlink(address _token) public view returns (uint256) {
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return uint256(price);
    }    

    function owner() public view returns(address){
        return contractOwner;
    }
    
    modifier isOwner(){
        require(msg.sender == contractOwner);
        _;
    }
}
