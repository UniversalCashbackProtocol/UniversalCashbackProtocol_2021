## First Version Universal Cashback Protocol

![](https://raw.githubusercontent.com/UniversalCashbackProtocol/UniversalCashbackProtocol_2022/0061fc5f174d13f99a0d6bfaecae6b874129a30d/src/assets/logos/logo_ucp_officialsvg.svg)


### System Diagram
                    
```mermaid
graph LR
A[Hard edge] -->B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```

```sequence
Costumer->Company: Buy Product (USDT)
Costumer->Company: Input
Note left of Costumer: Smart Contracts
Note right of Company: Chainlink, MATIC, Alchemy & Moralis
Company->Costumer: Output
Company-->Costumer: token UCP 
Costumer->>Company: Claim Cashback
```
