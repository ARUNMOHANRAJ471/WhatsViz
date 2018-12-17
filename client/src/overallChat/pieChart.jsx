import React, { Component } from "react";
const ReactHighcharts = require("react-highcharts");
const Highcharts = require("highcharts");
class Piechart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataChartTimeline: [],
      dataChart: props.dataChart
    };
  }

  render() {
    let dataForConfig = [];

    if (this.state.dataChartTimeline.length === 0) {
      dataForConfig = this.props.dataChart;
    } else {
      dataForConfig = this.state.dataChartTimeline;
    }
    let configForOverallPie = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      title: { text: "Overall analysis" },
      tooltip: { pointFormat: "{series.name}: <b>{point.y}</b>" },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
            style: {
              color:
                (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                "black"
            },
            connectorColor: "silver"
          }
        }
      },
      series: [{ name: "Messages", data: dataForConfig }]
    };

    return (
      <div className="App">
        <ReactHighcharts config={configForOverallPie} />
      </div>
    );
  }
}

export default Piechart;
