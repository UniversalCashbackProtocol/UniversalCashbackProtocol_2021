pragma solidity 0.8.0;

import './Store.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AdminStore{
    uint private qtyStores;
    address private UCP;
    IERC20 private USDT;
        
    struct LocalStore{
        uint id;
        address owner;
        string name;
        uint promotionsQty;
        address contractAddress;
    }
    
    struct Promotion{
        uint id;
        uint idStore;
        string name;
    }
    
    mapping(uint => LocalStore) stores;
    mapping(address => mapping(uint => LocalStore)) storesByOwner;

    constructor(address _USDT){
        qtyStores = 1;
        USDT = IERC20(_USDT);
    }

    function CreateStore(string memory _name) public {
        Store cStore = new Store(msg.sender, qtyStores, _name, address(USDT));
        require(address(cStore) != address(0), "Contract must be deployed");
        LocalStore memory localStore = LocalStore(qtyStores, msg.sender, _name, 0, address(cStore));
        stores[qtyStores] = localStore;
        storesByOwner[msg.sender][qtyStores] = localStore;
        qtyStores++;
    }

    function GetInfoStore(uint _id) public view returns(LocalStore memory store){
        return stores[_id];
    }
    
    function GetStoreByOwner(address _owner, uint256 _idStore) internal view returns(LocalStore memory store){
        return storesByOwner[_owner][_idStore];
    }      
    
}