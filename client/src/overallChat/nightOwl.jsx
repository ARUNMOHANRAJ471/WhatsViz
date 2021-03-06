import React, { Component } from "react";
const ReactHighcharts = require("react-highcharts");
const Highcharts = require("highcharts");
class NightOwl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataChart: props.dataChart
        };
    }

    render() {
        let configForNightOwl = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45
                }
            },
            credits: { enabled: false },
            title: {
                text: "Night Owl"
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
                name: 'No of Messages',
                data: this.props.dataChart
            }]
        }

        return (
            <div className="App">
                <ReactHighcharts config={configForNightOwl} />
            </div>
        );
    }
}

export default NightOwl;
