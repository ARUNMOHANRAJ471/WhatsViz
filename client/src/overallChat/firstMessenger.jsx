import React, { Component } from "react";
const ReactHighcharts = require("react-highcharts");
const Highcharts = require("highcharts");
class Piechart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataChart: props.dataChartPeak
        };
    }

    render() {
        let configForBarChart = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45
                }
            },
            credits: { enabled: false },
            title: {
                text: "First messenger analysis"
            },
            subtitle: {
                text: null
            },
            plotOptions: {
                pie: {
                    innerSize: 100,
                    depth: 45
                }
            },
            series: [{
                name: 'First Messaged',
                data: this.props.dataChartPeak
            }]
        }

        return (
            <div className="App">
                <ReactHighcharts config={configForBarChart} />
            </div>
        );
    }
}

export default Piechart;
