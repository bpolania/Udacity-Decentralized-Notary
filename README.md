## Udacity-Decentralized-Notary

### Installation

* Install OpenZeppelin version 2.0.0-rc.1 https://openzeppelin.org/api/docs/get-started.html

* Install Ganache CLI https://github.com/trufflesuite/ganache-cli

* Install Truffle 

```
npm install -g truffle
```

### Deploy to Ganache

* Start Ganache

```
ganache-cli -l 8000000
```

* Start truffle console

```
truffle console
```

* From truffle compile and migrate

```
truffle> compile
truffle> migrate
```

* From truffle instantiate the contract

```
truffle> StarNotary.new().then(function(res) { sc = StarNotary.at(res.address) })
```

* From truffle get the contract address (to use in web3)

```
truffle> sc.address
```

* From truffle get the abi (to use in web3)

JSON.stringify(StarNotary.abi)


* In the index.html file update `httpProvider`, `abi` and `address`

```
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var StarNotary = web3.eth.contract(
                //COPY PASTE ABI YOU GOT FROM PREVIOUS STEP HERE//
            );
            
var starNotary = StarNotary.at(//COPY PASTE CONTRACT ADDRESS YOU GOT FROM PREVIOUS STEP HERE//);

```
