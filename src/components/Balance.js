import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadBalances } from '../store/interactions'
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
    balancesLoadingSelector
} from '../store/selectors'
import Spinner from './Spinner'

const showForm = (props) => {
    const { 
        etherBalance,
        tokenBalance,
        exchangeEtherBalance,
        exchangeTokenBalance
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
                <table className="table table-dark table-sm small">
                    <tbody>
                        <tr>
                            <td>DAPP</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>
                
                <form className="row" onSumbit={(e) => { 
                    e.preventDefault()
                    console.log("form submitting")
                    }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input 
                            type="text" 
                            placeholder="ETH Amount" 
                            onChange={(e) => { console.log("amount change...") }}
                            className="form-control form-control-sm bg-dark text-white"
                            required />
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
                <table className="table table-dark table-sm small">
                    <tbody>
                        <tr>
                            <td>DAPP</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>
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
                    { this.props.showForm ? showForm(this.props) : <Spinner />}
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
        showForm: !balancesLoading
    }
}

export default connect(mapStateToProps)(Balance)