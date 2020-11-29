import Web3 from 'web3';
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'

import { 
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded,
    orderCancelling,
    orderCancelled,
    orderFilling,
    orderFilled
 } from './actions'

export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545')
    // const web3 = new Web3('http://127.0.0.1:7545')
    dispatch(web3Loaded(web3))
    return web3
}


export const loadAccount = async (web3, dispatch) => {
    const accounts = await web3.eth.getAccounts()
    const account = accounts[0]
    dispatch(web3AccountLoaded(account))
    return account
}

export const loadToken = async (web3, networkId, dispatch) => {
    try {
        const token =  await new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
        dispatch(tokenLoaded(token))
        return token
    } catch (error) {
        console.log('Contract not deployed to the current network. Please select another network with Metamask')
        return null
    }
    
}

export const loadExchange = async (web3, networkId, dispatch) => {
    try {
        const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
        dispatch(exchangeLoaded(exchange))
        return exchange
    } catch (error) {
        console.log('Exchange not deployed to the current network. Please select another network with Metamask')
        return null
    }
}

export const loadAllOrders = async (exchange, dispatch) => {
    const cancelStream = await exchange.getPastEvents('Cancel', {fromBlock: 0})
    const cancelledOrders = cancelStream.map((event)=> event.returnValues)
    dispatch(cancelledOrdersLoaded(cancelledOrders))

    const tradeStream = await exchange.getPastEvents('Trade', {fromBlock: 0})
    const filledOrders = tradeStream.map((event)=> event.returnValues)
    dispatch(filledOrdersLoaded(filledOrders))

    const orderStream = await exchange.getPastEvents('Order', {fromBlock: 0})
    const allOrders = orderStream.map((event)=> event.returnValues)
    dispatch(allOrdersLoaded(allOrders))
}

export const cancelOrder = (dispatch, exchange, order, account) => {
    exchange.methods.cancelOrder(order.id).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(orderCancelling())
    })
    .on('error', (error) => {
        console.log(error)
        window.alert('There was an error')
    })
}

export const subscribeToEvents = async (exchange, dispatch) => {
    await exchange.events.Cancel({}, (error, event) => {
        if(error){
            console.log(error)
        }
        else {dispatch(orderCancelled(event.returnValues))}
    })

    await exchange.events.Trade({}, (error, event) => {
        if(error){
            console.log(error)
        }
        else {dispatch(orderFilled(event.returnValues))}
    })
}

export const fillOrder = (dispatch, exchange, order, account) => {
    console.log('filling order for account:', account)

    exchange.methods.fillOrder(order.id).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(orderFilling())
    })
    .on('error', (error) => {
        console.log(error)
        window.alert('There was an error')
    })
}
