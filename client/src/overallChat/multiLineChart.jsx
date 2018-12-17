import React, { Component } from "react";
import ReactChartkick, { LineChart, PieChart } from "react-chartkick";
import Chart from "chart.js";
const ReactHighcharts = require("react-highcharts");
const Highcharts = require("highcharts");

ReactChartkick.addAdapter(Chart);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataChartTimeline: [],
      dataChart: props.dataChart
    };
  }

  render() {
    let dataForConfig = [];

    if (this.state.dataChartTimeline.length == 0) {
      dataForConfig = this.props.dataChart;
    } else {
      dataForConfig = this.state.dataChartTimeline;
    }
    let data = this.props.dataChart;

    let configForDailyMsg = {
      chart: {
        type: "area",
        zoomType: "x"
      },
      title: {
        text: "Msg per day analysis"
      },
      subtitle: {
        text: null
      },
      legend: {
        enabled: true
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true
      },
      xAxis: {
        type: "datetime",
        title: {
          enabled: false
        }
      },
      yAxis: {
        title: {
          text: "Text count"
        }
      },
      tooltip: {
        split: true
      },
      plotOptions: {
        area: {
          stacking: "normal",
          lineColor: "rgba(0, 0, 0, 0.3)",
          lineWidth: 0,
          marker: {
            enabled: false
          }
        }
      },
      series: data
    };
    return (
      <div className="App" style={{ borderRadius: "5%" }}>
        <ReactHighcharts config={configForDailyMsg} />
        {/* <LineChart data={data} /> */}
      </div>
    );
  }
}

export default App;
