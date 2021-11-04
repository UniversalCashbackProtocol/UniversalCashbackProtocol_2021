pragma solidity 0.8.0;

contract Store{
    
    uint256 private id;
    uint256 private qtyPromotions;
    uint256 private qtyProducts;
    string private nameStore;
    address private contractOwner;
    
    enum PromotionSte {OPEN, CLOSED}
    
    struct Promotion{
        uint256 id;
        PromotionSte state;
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
    
    mapping(uint256 => Product) products;
    mapping(uint256 => Promotion) promotions;
    
    constructor(address _owner, uint256 _id, string memory _nameStore){
        require(_owner != address(0) && _id > 0, "El address debe ser valido y el Id mayor a 0");
        id = _id;
        qtyPromotions = 1;
        nameStore = _nameStore;
        contractOwner = _owner;
    }
    
    function CreateProduct(string memory _SKU, uint256 _priceProduct, uint256 _tokensPerProduct) public{
        products[qtyProducts] = Product(qtyProducts, _SKU, _priceProduct, _tokensPerProduct);
    }
    
    function CreatePromotion() public{
        
    }
    

    
    function AssignProductToPromotion() public{
        
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
