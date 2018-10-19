const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })
    
    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 
            
            // await this.contract.createStar('awesome star!', 1, {from: accounts[0]})
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")

            assert.equal(await this.contract.getStarName(0), "awesome star!")
        })
    })

    describe('buying and selling stars', () => { 
        let user1 = accounts[0]
        let user2 = accounts[1]
        let randomMaliciousUser = accounts[2]
        
        let starId = 1
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () { 
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")    
        })

        it('user1 can put up their star for sale', async function () { 
            assert.equal(await this.contract.ownerOf(starId), user1)
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            
            assert.equal(await this.contract.starsForSale(starId), starPrice)
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function() { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 ether balance changed correctly', async function () { 
                let overpaidAmount = web3.toWei(.05, 'ether')
                const balanceBeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
                const balanceAfterTransaction = web3.eth.getBalance(user2)

                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })
    })

    describe('check if start exists', () => { 

        beforeEach(async function () { 
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")    
        })

        it('can check if a star already exists', async function () { 
            assert.equal(await this.contract.checkIfStarExists("ra_032.155", "dec_121.874", "mag_245.978"), true)
        })

        it('can check if a star does not exists yet', async function () { 
            assert.equal(await this.contract.checkIfStarExists("ra_032.170", "dec_121.874", "mag_245.978"), false)
        })
    })

    describe('check if contract is reverted with an existing tokenId', () => { 

        let user1 = accounts[0];
        let err = false;

        beforeEach(async function () { 
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")    
        })

        it('the transaction is reverted', async function () { 
            try {
                await this.contract.mint(user1,0);
              } catch (error) {
                err = true
              }
              assert.equal(err,false);
        })

        it('the transaction is not reverted', async function () { 

            let err = false;
            try {
                await this.contract.mint(user1,1);
              } catch (error) {
                err = true;
              }
              assert.equal(err,true);
        })

        
    })

    describe('check if a transfer is approved', () => { 

        let err = false;
        let user2 = accounts[1];
        
        beforeEach(async function () { 
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")    
        })

        it('spender is approved', async function () { 
            try {
                await this.contract.approve(user2, 1);
              } catch (error) {
                err = true;
              }

              assert.equal(err,false);
        })

        it('spender is not approved', async function () { 
            try {
                await this.contract.approve(user1, 1);
              } catch (error) {
                err = true;
              }

              assert.equal(err,true);
        })

    })

    describe('check if a transfer is safe', () => { 

        let err = false;
        let user1 = accounts[0];
        let user2 = accounts[1];

        beforeEach(async function () { 
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")    
        })

        it('transfer is safe', async function () { 
            try {
                await this.contract.safeTransferFrom(user1, user2, 1);
              } catch (error) {
                err = true;
              }

              assert.equal(err,false);
        })

        it('transfer is not safe', async function () { 
            try {
                await this.contract.safeTransferFrom(user1, 0x4465c6dbd113a1a00d475dbb84dfab02a7a17623, 0);
              } catch (error) {
                err = true;
              }

              assert.equal(err,true);
        })
        

    })

    describe('set if a approval is set to specific value', () => { 

        let err = false;
        let user1 = accounts[0];
        let user2 = accounts[1];

        beforeEach(async function () { 
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")    
        })

        it('approval is set to true', async function () { 
            try {
                await this.contract.setApprovalForAll(user2, true);
              } catch (error) {
                err = true;
              }

              assert.equal(err,false);
        })

        it('approval is not set to true', async function () { 
            try {
                await this.contract.setApprovalForAll(user2, false);
              } catch (error) {
                err = true;
              }

              assert.equal(err, false);
        })

    })

    describe('is an address approved for a tokenId', () => { 

        let err = false;
        let user1 = accounts[0];
        let user2 = accounts[1];

        beforeEach(async function () { 
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")    
        })

        it('tokenId do exist', async function () { 
            try {
                await this.contract.getApproved(1);
              } catch (error) {
                  err = true;
              }

              assert.equal(err,false);
        })

        it('tokenId does not exist', async function () { 
            try {
                await this.contract.getApproved(3);
              } catch (error) {
                  err = true;
              }

              assert.equal(err, true);
        })

    })

    describe('is an operator approved', () => { 

        let err = false;
        let user1 = accounts[0];
        let user2 = accounts[1];

        beforeEach(async function () { 
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")    
        })

        it('is approved', async function () { 
            try {
                await this.contract.isApprovedForAll(user1, user2);
              } catch (error) {
                  err = true;
              }

              assert.equal(err,false);
        })

        it('is not approved', async function () { 
            try {
                await this.contract.isApprovedForAll(0x45367890, null);
              } catch (error) {
                  err = true;
              }

              assert.equal(err, true);
        })

    })

    describe('can retrieve star info using tokenid', () => { 

        let err = false;
        let user1 = accounts[0];
        let user2 = accounts[1];

        beforeEach(async function () { 
            await this.contract.createStar("awesome star!", "ra_032.155", "dec_121.874", "mag_245.978","I love my wonderful star")    
        })

        it('could retrieve', async function () { 
            try {
                await this.contract.tokenIdToStarInfo(0);
              } catch (error) {
                  err = true;
              }

              assert.equal(err,false);
        })

        it('could not retrieve', async function () { 
            try {
                await this.contract.tokenIdToStarInfo(1);
              } catch (error) {
                  err = true;
              }
              assert.equal(err,true);
        })

    })

})