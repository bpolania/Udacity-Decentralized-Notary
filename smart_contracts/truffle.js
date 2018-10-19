/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'desert once throw lyrics kid chef ivory head reflect miss warm topic';

module.exports = {
  networks: {
      development: {
        host: "localhost",
        port: 8545,
        gas: 800000000,
        gasPrice:0,
        network_id: "*" // Match any network id
      },
      rinkeby: {
        provider: function() { 
          return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/6846d6a3b15c4944be49187945998eb6') 
        },
        network_id: 1,
        gas: 4500000,
        gasPrice: 10000000000,
      }
  }   
};
