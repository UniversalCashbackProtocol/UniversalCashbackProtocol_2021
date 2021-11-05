pragma solidity 0.8.0;


contract Store{
    uint256 private id;
    uint256 private qtyPromotions;
    uint256 private qtyProducts;
    uint256 private counterProductsAsigned;
    string private nameStore;
    address private contractOwner;
    
    
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
    
    mapping(uint256 => Product) products;
    mapping(uint256 => Promotion) promotions;
    //Mapping para cada producto asignado a una promocion
    mapping(uint256 => mapping(uint256 => ProductAsigned)) productsInPromotions;
    
    constructor(address _owner, uint256 _id, string memory _nameStore){
        require(_owner != address(0) && _id > 0, "El address debe ser valido y el Id mayor a 0");
        id = _id;
        qtyPromotions = 1;
        nameStore = _nameStore;
        contractOwner = _owner;
        counterProductsAsigned = 0;
    }
    
    function CreateProduct(string memory _SKU, uint256 _priceProduct, uint256 _tokensPerProduct) isOwner public{
        require(_priceProduct >= 0 && _tokensPerProduct >= 0, "El Precio del producto y los Tokens a asignar deben ser mayor o igual a cero");
        products[qtyProducts] = Product(qtyProducts, _SKU, _priceProduct, _tokensPerProduct);
        qtyProducts++;
    }
    
    function CreatePromotion(uint256 _startDate, uint256 _endDate) isOwner public{
        promotions[qtyPromotions] = Promotion(qtyPromotions, _startDate, _endDate, true);
        qtyPromotions++;
    }
    
    function AssignProductToPromotion(uint _idProduct, uint _idPromotion) isOwner public{
        require(_idProduct > 0 && _idPromotion > 0, "Deben ser mayor a cero");
        Promotion memory prom = GetPromotionById(_idPromotion);
        Product memory prod = GetProductById(_idProduct);
        counterProductsAsigned++;
        productsInPromotions[counterProductsAsigned][prom.id] = ProductAsigned(prod.id, true);
        
    }
    
    function UnAssignProductToPromotion(uint _idProduct, uint _idPromotion) isOwner public{
        require(_idProduct > 0 && _idPromotion > 0, "Deben ser mayor a cero");
        Promotion memory prom = GetPromotionById(_idPromotion);
        Product memory prod = GetProductById(_idProduct);
        productsInPromotions[counterProductsAsigned][prom.id] = ProductAsigned(prod.id, false);
    }
    
    function GetPromotionById(uint256 _id) public view returns (Promotion memory){
        require(_id > 0, "El Id debe ser mayor a 0");
        Promotion memory p = promotions[_id];
        require (p.id > 0, "La promocion ingreasada no existe");
        return p;
    }
    
    function GetProductById(uint256 _id) public view returns (Product memory){
        require(_id > 0, "El Id debe ser mayor a 0");
        Product memory p = products[_id];
        require(p.id > 0, "El producto no existe");
        return p;
    }
    
    function BuyProduct() public{
        
    }  
    
    function owner() public view returns(address){
        return contractOwner;
    }
    
    modifier isOwner(){
        require(msg.sender == contractOwner);
        _;
    }
}

