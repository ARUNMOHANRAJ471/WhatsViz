import React, { Component } from "react";
import axios from "axios";
import PieChart from "./pieChart.jsx";
import MultilineChart from "./multiLineChart.jsx";
import PeakHours from "./peakHours.jsx";
import FirstMessenger from "./firstMessenger.jsx";
import NightOwl from "./nightOwl.jsx";
import LazyFellow from "./lazyWorker.jsx";
import Insights from "./insights.jsx";
import NavBar from "../navBar/navBar.jsx";
import {
  WhatsappShareButton,
  WhatsappIcon
} from 'react-share';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataChart: [],
      dataChartForMultiLine: [],
      peakHourData: [],
      dataChartForFirstMsg: [],
      dataChartForNightOwl: [],
      dataChartForLazy: [],
      topWords: [],
      imagesSent: [],
      latencyArr: [],
      lettersSent: [],
      topEmojis: [],
      topUsersEmoji: [],
      wordsArr: [],
      insightState: false,
      showDeletedMsg: false
    };
    this.deleteAnalysis = this.deleteAnalysis.bind(this);
  }
  deleteAnalysis() {
    let context = this;
    let data = { chatname: this.props.match.params.chatname };
    axios
      .post("/api/analyser/deleteAnalysis", data)
      .then(res => {
        if (res.data === "success") {
          context.setState({ showDeletedMsg: true });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  componentDidMount() {
    let context = this;
    let data = { chatname: this.props.match.params.chatname };
    axios
      .post("/api/analyser/getChatResults", data)
      .then(res => {
        if (res.data.length === 0) {
          context.setState({ showDeletedMsg: true });
        } else {
          let chatResult = res.data[0];
          context.setState({
            dataChart: chatResult.dataForPieChart,
            dataChartForMultiLine: chatResult.msgPerDay,
            peakHourData: chatResult.peakhourData,
            dataChartForFirstMsg: chatResult.firstMsg,
            dataChartForNightOwl: chatResult.nightChatList,
            dataChartForLazy: chatResult.workHoursChatList,
            topWords: chatResult.topWords,
            imagesSent: chatResult.imagesSent,
            latencyArr: chatResult.latencyArr,
            lettersSent: chatResult.lettersSent,
            topEmojis: chatResult.topEmojis,
            topUsersEmoji: chatResult.topUsersEmoji,
            wordsArr: chatResult.wordsArr
          }, function () {
            this.setState({ insightState: true });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    let insights = '';
    if (this.state.insightState) {
      insights = (<div className="container">
        <div className="card">
          <div className="card-section">
            <center><h4 className="highcharts-title">Insights</h4></center>
            <div id="insights">
              <Insights
                imagesSent={this.state.imagesSent}
                wordsArr={this.state.wordsArr}
                lettersSent={this.state.lettersSent}
                topWords={this.state.topWords}
                topEmojis={this.state.topEmojis}
                topUsersEmoji={this.state.topUsersEmoji}
                latencyArr={this.state.latencyArr} />
            </div>
          </div>
        </div>
      </div>);
    }
    let overallchatData = '';
    if (!this.state.showDeletedMsg) {
      overallchatData = (<div><div className="container">
        <div className="card">
          <div className="card-section">
            <div id="info">
              <div style={{ textAlign: "center" }}><span style={{ fontSize: "22px", padding: "5px", fontWeight: "bold" }}>{this.props.match.params.chatname}</span>
                <div style={{ float: "right" }}><WhatsappShareButton style={{ float: "left", paddingRight: "20px" }} url={window.location.href} title="whatsViz analysis" separator=": " ><WhatsappIcon size={32} round={true} /></WhatsappShareButton>
                  <button type="button" className="btn btn-primary" onClick={this.deleteAnalysis}>Delete </button>
                </div>
              </div>
              <div style={{ clear: "both" }}></div>
            </div>
          </div>
        </div>
      </div>
        <br />
        <div className="container">
          <div className="card">
            <div className="card-section">
              <div id="graph-messages-over-days">
                <PieChart
                  dataChart={this.state.dataChart}
                  chatname={this.props.match.params.chatname}
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="container">
          <div className="card">
            <div className="card-section">
              <div id="graph-messages-over-days">
                <MultilineChart
                  dataChart={this.state.dataChartForMultiLine}
                  chatname={this.props.match.params.chatname}
                />
              </div>
            </div>
          </div>
        </div>
        <br />

        <div className="container">
          <div className="card">
            <div className="card-section">
              <div id="graph-messages-over-days">
                <PeakHours dataChartPeak={this.state.peakHourData} chatname={this.props.match.params.chatname} />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="card">
            <div className="card-section">
              <div id="first-messenger">
                <FirstMessenger dataChartPeak={this.state.dataChartForFirstMsg} chatname={this.props.match.params.chatname} />
              </div>
            </div>
          </div>
        </div>

        {/* Night Owl */}
        <div className="container">
          <div className="card">
            <div className="card-section">
              <div id="night-owl">
                <NightOwl dataChart={this.state.dataChartForNightOwl} chatname={this.props.match.params.chatname} />
              </div>
            </div>
          </div>
        </div>
        {/* lazy fellow */}
        <div className="container">
          <div className="card">
            <div className="card-section">
              <div id="lazy-fellow">
                <LazyFellow dataChart={this.state.dataChartForLazy} chatname={this.props.match.params.chatname} />
              </div>
            </div>
          </div>
        </div>
        {/* Insights */}
        {insights}</div>);
    } else {
      overallchatData = (<div className="container">
        <div className="card">
          <div className="card-section">
            <div id="info">
              <p style={{ padding: "3%", fontSize: "20px" }}>The chat you are trying to reach is deleted / not available.</p>
            </div>
          </div>
        </div>
      </div>);
    }
    return (
      <div style={{ background: 'black' }}>
        <NavBar />
        <br />
        <br />
        <br />
        {overallchatData}
      </div >
    );
  }
}

export default App;
