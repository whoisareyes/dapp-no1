import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    loadBalances,
    depositEther,
    withdrawEther,
    withdrawToken,
    depositToken
 } from '../store/interactions'
import { Tabs, Tab} from 'react-bootstrap'
import { 
    web3Selector, 
    exchangeSelector, 
    tokenSelector, 
    accountSelector, 
    etherBalanceSelector,
    tokenBalanceselector,
    exchangeEtherBalanceSelector,
    exchangeTokenBalanceSelector,
    balancesLoadingSelector,
    etherDepositAmountSelector,
    etherWithdrawAmountSelector,
    tokenDepositAmountSelector,
    tokenWithdrawAmountSelector
} from '../store/selectors'
import Spinner from './Spinner'
import {
    etherDepositAmountChanged,
    etherWithdrawAmountChanged,
    tokenDepositAmountChanged,
    tokenWithdrawAmountChanged
 } from '../store/actions'

const showForm = (props) => {
    const { 
        etherBalance,
        tokenBalance,
        exchangeEtherBalance,
        exchangeTokenBalance,
        dispatch,
        etherDepositAmount,
        exchange,
        token,
        account,
        web3,
        etherWithdrawAmount,
        tokenDepositAmount,
        tokenWithdrawAmount
    } = props
    return ( 
        <Tabs className="bg-dark text-white" defaultActiveKey="deposit">
            <Tab className="bg-dark" eventKey="deposit" title="Deposit">
                <table className="table table-dark table-sm small">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th>
                            <th>Exchange</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ETH</td>
                            <td>{etherBalance}</td>
                            <td>{exchangeEtherBalance}</td>
                        </tr>
                    </tbody>
                </table>
                <form className="row" onSubmit={(event) => { 
                    event.preventDefault()
                    depositEther(dispatch, exchange, web3, etherDepositAmount, account)
                    }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input 
                            type="text" 
                            placeholder="ETH Amount" 
                            onChange={(e) => {
                                dispatch( etherDepositAmountChanged(e.target.value))
                            }}
                            className="form-control form-control-sm bg-dark text-white"
                            required />
                        </div>
                        <div className="col-12 col-sm-auto pl-sm-0">
                            <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                        </div>
                </form>

                <table className="table table-dark table-sm small">
                    <tbody>
                        <tr>
                            <td>DAPP</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>
                <form className="row" onSubmit={ (e) => {
                    e.preventDefault()
                    depositToken(dispatch, exchange, web3, token, tokenDepositAmount, account)
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input
                        type="text"
                        placeholder="DAPP Amount"
                        onChange={(e) => {dispatch(tokenDepositAmountChanged(e.target.value))} }
                        className="form-control form-control-sm bg-dark text-white"
                        required
                        />
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                    </div>
                </form>



            </Tab>

            <Tab className="bg-dark" eventKey="withdraw" title="Withdraw">
                <table className="table table-dark table-sm small">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th>
                            <th>Exchange</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ETH</td>
                            <td>{etherBalance}</td>
                            <td>{exchangeEtherBalance}</td>
                        </tr>
                    </tbody>
                </table>
                <form className="row" onSubmit={(e) => { 
                    e.preventDefault()
                    withdrawEther(dispatch, exchange, web3, etherWithdrawAmount, account)
                    }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input 
                        type="text" 
                        className="form-control form-control-sm bg-dark text-white" 
                        placeholder="ETH Amount" 
                        onChange={(e) => { dispatch( etherWithdrawAmountChanged(e.target.value)) }} 
                        required/>
                        </div>
                    <div className="col-23 col-sm-auto pl-sm-0">
                        <button className="btn btn-primary btn-block btn-sm" type="submit"> Withdraw </button>
                    </div>
                </form>


                <table className="table table-dark table-sm small">
                    <tbody>
                        <tr>
                            <td>DAPP</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>
                <form className="row" onSubmit={ (e) => {
                    e.preventDefault()
                    withdrawToken(dispatch, exchange, web3, token, tokenWithdrawAmount, account)
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input
                        type="text"
                        placeholder="DAPP Amount"
                        onChange={(e) => {dispatch(tokenWithdrawAmountChanged(e.target.value))} }
                        className="form-control form-control-sm bg-dark text-white"
                        required
                        />
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
                    </div>
                </form>
            </Tab>
        </Tabs>
    )
}

class Balance extends Component {
    componentWillMount() {
        this.loadBlockchainData()
    }
    async loadBlockchainData(){
        const { dispatch, web3, exchange, token, account } = this.props
        await loadBalances(dispatch, web3, exchange, token, account)
    }
    render(){
        return(
            <div className="caed bg-dark text-white">
                <div className="card-header">
                    Balance
                </div>
                <div className="card-body">
                    { this.props.showForm ? showForm(this.props) : <Spinner /> }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    const balancesLoading =  balancesLoadingSelector(state)
    return {
        web3 : web3Selector(state), 
        exchange : exchangeSelector(state), 
        token : tokenSelector(state), 
        account : accountSelector(state),
        etherBalance: etherBalanceSelector(state),
        tokenBalance: tokenBalanceselector(state),
        exchangeEtherBalance: exchangeEtherBalanceSelector(state),
        exchangeTokenBalance: exchangeTokenBalanceSelector(state),
        balancesLoading,
        showForm: !balancesLoading,
        etherDepositAmount: etherDepositAmountSelector(state),
        etherWithdrawAmount: etherWithdrawAmountSelector(state),
        tokenDepositAmount: tokenDepositAmountSelector(state),
        tokenWithdrawAmount: tokenWithdrawAmountSelector(state)
    }
}

export default connect(mapStateToProps)(Balance)