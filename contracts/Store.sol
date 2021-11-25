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
        string name;
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
        
    mapping(uint256 => Product) products;
    mapping(uint256 => Promotion) promotions;    
    mapping(uint256 => mapping(uint256 => ProductAsigned)) productsInPromotions;

       
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
    
    function buyToken(uint256 _amount, address _token) internal {  
        require(_amount >= MINIMUN_TOKEN, "Amount must be greather tan 1");
        uint256 toPay = protocol.calculatePricePerToken(_amount, _token);                                    
        USDT.transferFrom(msg.sender, address(this), toPay);                          
        protocol.updateAddressesAllowedToMint(_amount, id);        
        UCT.mintToken(_amount);         
        USDT.transfer(CONTRACT_PROTOCOL, toPay);     
    }

    function createPromotion(string memory _name, uint _initialTokens, address _token) isOwner public{
        promotions[qtyPromotions] = Promotion(qtyPromotions, _name, true, _initialTokens, _initialTokens);
        buyToken(_initialTokens, _token);
        qtyPromotions++;
        emit PromotionCreated(_name, _initialTokens);
    }
    
    function assignProductToPromotion(uint _idPromotion, uint _idProduct) isOwner public{
        require(_idProduct > 0 && _idPromotion > 0, "Ids must be greater than zero");
        Promotion memory prom = getPromotionById(_idPromotion);
        Product memory prod = getProductById(_idProduct);        
        productsInPromotions[_idPromotion][_idProduct] = ProductAsigned(prod.id, prom.id, true);        
        counterProductsAsigned++;
        emit ProductAsignedEvent(_idPromotion, _idProduct);
    }
    
    function unAssignProductToPromotion(uint _idPromotion, uint _idProduct) isOwner public{        
        require(isProductAsigned(_idProduct, _idPromotion) == true, "Product has not been asigned");
        productsInPromotions[_idPromotion][_idProduct] = ProductAsigned(_idProduct, _idPromotion, false);
        emit ProductUnasignedEvent(_idPromotion, _idProduct);(_idPromotion, _idProduct);
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
        promotions[pm.id].currentTokens -= pd.tokenGivens;
        USDT.transferFrom(msg.sender, address(this), pd.price);  
        UCT.transfer(msg.sender, pd.tokenGivens);   
        emit ProductBought(_idPromotion, _idProduct);     
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
        qtyProducts++;
        products[qtyProducts] = Product(qtyProducts, _SKU, _priceProduct, _tokensPerProduct);        
    }

    function withdrawTokensFromPromotion(uint _amount, uint _idPromotion) isOwner public{
        require(validateEnoughTokensToWithdraw(_amount, _idPromotion) == true, "Amount exceed current tokens");
         promotions[_idPromotion].currentTokens -= _amount;
         UCT.transfer(msg.sender, _amount);
         emit WithdrawTokensFromPromo(_idPromotion, _amount);
    }

    function validateEnoughTokensToWithdraw(uint _amount, uint _idPromotion) internal view returns(bool){
        Promotion memory p = getPromotionById(_idPromotion);
        if(promotions[p.id].currentTokens >= _amount){
            return true;
        }else{
            return false;
        }        
    }
    
    function owner() public view returns(address){
        return contractOwner;
    }

    function getQtyProducts() public view returns(uint){
        return qtyProducts;
    }

    function getQtyPromotions() public view returns(uint){
        return qtyPromotions;
    }
    
    modifier isOwner(){
        require(msg.sender == contractOwner);
        _;
    }

    event PromotionCreated(string _name, uint _tokensToGive);
    event ProductAsignedEvent(uint _idPromotion, uint _idProduct);    
    event ProductUnasignedEvent(uint _idPromotion, uint _idProduct);
    event ProductBought(uint _idPromotion, uint _idProduct);
    event WithdrawTokensFromPromo(uint _idPromotion, uint _amount);
}
