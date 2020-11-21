import { get, reject, groupBy } from 'lodash'
import { createSelector } from 'reselect'
import { ETHER_ADDRESS, tokens, ether, GREEN, RED } from '../helpers'
import moment from 'moment'

const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl, el) => (tl && el)
)

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, l => l)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(
    filledOrders,
    (orders) => {
        orders = orders.sort((a,b) => a.timestamp - b.timestamp)
        orders = decorateFilledOrders(orders)
        orders = orders.sort((a,b) => b.timestamp - a.timestamp)
        return orders
    }
)

const decorateFilledOrders = (orders) => {
    let previousOrder = orders[0]
    return (
        orders.map((order) => {
            order = decorateOrder(order)
            order = decorateFilledOrder(order, previousOrder)
            previousOrder = order
            return order
        })
    )
}

const decorateOrder = (order) => {
    let etherAmount
    let tokenAmount
    if(order.tokenGive === ETHER_ADDRESS){
        etherAmount = order.amountGive
        tokenAmount = order.amountGet
    }else {
        etherAmount = order.amountGet
        tokenAmount = order.amountGive
    }
    const precision = 100000
    let tokenPrice= (etherAmount / tokenAmount)
    tokenPrice= Math.round(tokenPrice* precision) / precision

    return ({
        ...order,
        etherAmount:ether(etherAmount),
        tokenAmount:tokens(tokenAmount),
        tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ss a M/D')
    })
}

const allOrdersLoaded = state => get(state, 'exchange.allOrders.loaded', false)
const allOrders = state => get(state, 'exchange.allOrders.data', [])

const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false)
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, loaded => loaded)

const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])
export const cancelledOrdersSelector = createSelector(cancelledOrders, o => o)

const decorateFilledOrder = (order, previousOrder) => {
    return({
        ...order,
        tokenPricelass: tokenPricelass(order.tokenPice, order.id, previousOrder)
    })
}

const tokenPricelass = (tokenPrice, orderId, previousOrder) => {
    if(previousOrder.id === orderId){
        return GREEN
    }
    if(previousOrder.tokenPrice<= tokenPrice){
        return GREEN
    }else{
        return RED
    }
}

const openOrders = state => {
    const all = allOrders(state)
    const filled = filledOrders(state)
    const cancelled = cancelledOrders(state)

    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some((o) => o.id === order.id)
        const orderCancelled = cancelled.some((o) => o.id === order.id)
        return(orderFilled || orderCancelled)
    })

    return (openOrders)
}

const orderBookLoaded = state => cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && allOrdersLoaded(state)
export const orderBookLoadedSelector = createSelector(orderBookLoaded, b => b)

export const orderBookSelector = createSelector (
    openOrders,
    (orders) => {
        orders = decoratedOrderBookOrders(orders)
        orders = groupBy(orders, 'orderType')
        const buyOrders = get(orders, 'buy', [])
        const sellOrders = get(orders, 'sell', [])
        orders = {
            ...orders,
            buyOrders: buyOrders.sort((a,b) => b.tokenPrice - a.tokenPrice),
            sellOrders: sellOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
        }
        return orders
    }
)

const decoratedOrderBookOrders = (orders) => {
    return (
        orders.map((order) => {
            order = decorateOrder(order)
            order = decorateOrderBookOrder(order)
            return(order)
        })
    )
}

const decorateOrderBookOrder =(order) => {
    const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
    return({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillClass: orderType === 'buy' ? 'sell' : 'buy'
    })
}