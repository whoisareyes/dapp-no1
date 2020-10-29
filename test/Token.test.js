const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts) => {
    const name = 'Wario Token'
    const symbol = 'WARIO'
    const decimals = '18'
    const totalSupply =  '1000000000000000000000000000'
    let token
    
    beforeEach(async () => {
        token = await Token.new()
    })
    
    describe('deployment', () => {
        it('tracks the name', async () => {
            const result = await token.name()
            result.should.equal(name)
        })
        it('tracks the symbol', async() => {
            const results = await token.symbol()
            results.should.equal(symbol)
        })
        
        it('tracks the decimals', async() => {
            const results = await token.decimals()
            results.toString().should.equal(decimals)
        })
        
        it('tracks the total supply', async() => {
            const results = await token.totalSupply()
            results.toString().should.equal(totalSupply)
        })
    })
})