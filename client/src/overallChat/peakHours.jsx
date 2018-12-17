import React, { Component } from "react";

import Highcharts from "highcharts";
import Heatmap from "highcharts/modules/heatmap";
const ReactHighcharts = require("react-highcharts");
Heatmap(ReactHighcharts.Highcharts);
// const ReactHighMaps = require("react-highcharts/ReactHighmaps.src");
class PeakHours extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let heatMapConfig = {
      chart: { type: "heatmap" },
      title: { text: "Peak hour analysis" },
      subtitle: { text: null },
      legend: { enabled: false },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: [
          "Midnight",
          "1AM",
          "2AM",
          "3AM",
          "4AM",
          "5AM",
          "6AM",
          "7AM",
          "8AM",
          "9AM",
          "10AM",
          "11AM",
          "Noon",
          "1PM",
          "2PM",
          "3PM",
          "4PM",
          "5PM",
          "6PM",
          "7PM",
          "8PM",
          "9PM",
          "10PM",
          "11PM"
        ]
      },
      yAxis: {
        categories: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ]
      },
      colorAxis: { min: 0, minColor: "#FFFFFF", maxColor: "#673AB7" },
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.series.xAxis.categories[this.point.x] +
            "</b><br><b>" +
            this.point.value +
            "</b> texts exchanged <br><b>" +
            this.series.yAxis.categories[this.point.y] +
            "</b>"
          );
        }
      },
      series: [
        {
          name: "",
          borderWidth: 0,
          data: this.props.dataChartPeak,
          dataLabels: { enabled: true, color: "#000000" }
        }
      ]
    };

    return (
      <div className="App">
        <ReactHighcharts config={heatMapConfig} />
      </div>
    );
  }
}

export default PeakHours;
