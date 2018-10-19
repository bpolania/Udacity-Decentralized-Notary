## Udacity-Decentralized-Notary

### Installation

* Install OpenZeppelin version 2.0.0-rc.1 https://openzeppelin.org/api/docs/get-started.html

* Install Ganache CLI https://github.com/trufflesuite/ganache-cli

* Install Metamask https://metamask.io/

* Install Truffle Browser Extension

```
npm install -g truffle
```

### Metamask

* Get a new wallet from the browser extension, select `Rinkenby` network on top and get the mnemonic

```
Settings -> Reveal Seed Words
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

### Deploy to Rinkeby

* Open an account in infura (infura.io) and get the Rinkeby endpoint 

```
https://rinkeby.infura.io/v3/your-api-key
```

* Using truffle (from the os command line not truffle's console) compile and migrate

```
truffle compile
truffle migrate --network rinkeby
```

* Copy contract address from the output of the migration

* Get the ABI from the truffle console (see previous steps), it's the same that you'll get by deploying to Ganache, so if it's working there no need to update this field in the web3

* In the index.html file update `httpProvider`, `abi` and `address`

```
web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/your-api-key"));

var StarNotary = web3.eth.contract(
                //COPY PASTE ABI YOU GOT FROM PREVIOUS STEP HERE//
            );
            
var starNotary = StarNotary.at(//COPY PASTE CONTRACT ADDRESS YOU GOT FROM PREVIOUS STEP HERE//);

```

* If you change the account in Metamask, remember to update the `mnemonic` in the truffle.js file

var mnemonic = 'new nmemonic here';

NOTE: NEVER COMMIT TO GITHUB WITH A LIVE ACCOUNT MNEMONIC SINCE YOU'LL BE PUBLISHING YOUR PRIVATE KEY!!! 
