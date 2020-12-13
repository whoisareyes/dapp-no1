import React, { Component } from 'react'
import { connect } from 'react-redux'
import Chart from 'react-apexcharts'
import Spinner from './Spinner'
import { chartOptions, dummyData } from './PriceChart.config'
import {
    princeChartLoadedSelector,
    priceChartSelector
} from '../store/selectors'

const showPriceChart = (priceChart) => {
    return(
        <div className="price-chart">
            <div className="price">
                <h4>WARI/ETH &nbsp; { priceSymbol(priceChart.lastPrice) } &nbsp; {priceChart.lastPrice}</h4>
            </div>
            <Chart options={chartOptions} series={priceChart.series} type='candlestick' width='100%' height='100%' />
        </div>
    )
}

const priceSymbol = (lastPriceChange) => {
    let output
    if(lastPriceChange){
        output = <span className="text-success">&#9650;</span>
    }else{
        output = <span className="text-danger">&#9660;</span>
    }
    return(output)
}

class PriceChart extends Component {
    render(){
        return(
            <div className="card bg-dark text-white">
                <div className="card-header">
                    Price Chart
                </div>
                <div className="card-body">
                    { this.props.priceChartLoaded ? showPriceChart(this.props.priceChart) : <Spinner type="bar" ></Spinner>}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    console.log(priceChartSelector(state))
    return {
        priceChartLoaded: princeChartLoadedSelector(state),
        priceChart: priceChartSelector(state)
    }
}

export default connect(mapStateToProps)(PriceChart)