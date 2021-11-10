pragma solidity 0.8.0;

import './Store.sol';

contract FabricStore{
    uint private qtyStores;
    
    constructor(){
        qtyStores = 1;
    }
    
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
    
    function CreateStore(string memory _name) public {
        Store cStore = new Store(msg.sender, qtyStores, _name);
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
