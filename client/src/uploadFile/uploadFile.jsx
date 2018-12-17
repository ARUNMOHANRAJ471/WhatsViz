import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import $ from 'jquery';
import NavBar from "../navBar/navBar.jsx";

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showLoader: false,
      showUniqueChatnameMsg: false,
      chatname: "",
      format: "dateFirst"
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.checkChatname = this.checkChatname.bind(this);
  }

  handleUploadImage(event) {
    event.preventDefault();

    const data = new FormData();
    data.append("file", this.uploadInput.files[0]);
    data.append("filename", this.fileName.value);
    data.append("formatForChat", this.state.format);
    let fileNameTemp = this.fileName.value;
    this.setState({ showLoader: true });
    axios
      .post("/api/analyser/uploadFile", data)
      .then(response => {
        if (response.data === "success") {
          this.props.history.push(`/dashboard/${fileNameTemp}`);
        }
        if (response.data === "error") {
          this.setState({ showLoader: false });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  checkChatname() {
    // console.log("inside chatname", this.fileName.value);
    let context = this;
    let data = { chatname: this.fileName.value };
    axios
      .post("/api/analyser/getChatResults", data)
      .then(res => {
        if (res.data.length !== 0) {
          context.setState({ showUniqueChatnameMsg: true });
        } else {
          context.setState({ showUniqueChatnameMsg: false });

        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  componentDidMount() {
    $('#fileup').change(function () {
      //here we take the file extension and set an array of valid extensions
      var res = $('#fileup').val();
      var arr = res.split("\\");
      var filename = arr.slice(-1)[0];
      let filextension = filename.split(".");
      let filext = "." + filextension.slice(-1)[0];
      let valid = [".txt"];
      //if file is not valid we show the error icon, the red alert, and hide the submit button
      if (valid.indexOf(filext.toLowerCase()) == -1) {
        $(".imgupload").hide("slow");
        $(".imgupload.ok").hide("slow");
        $(".imgupload.stop").show("slow");

        $('#namefile').css({ "color": "red", "font-weight": 700 });
        $('#namefile').html("File " + filename + " is not txt file!");

        $("#submitbtn").hide();
        $("#fakebtn").show();
      } else {
        //if file is valid we show the green alert and show the valid submit
        $(".imgupload").hide("slow");
        $(".imgupload.stop").hide("slow");
        $(".imgupload.ok").show("slow");

        $('#namefile').css({ "color": "green", "font-weight": 700 });
        $('#namefile').html(filename);

        $("#submitbtn").show();
        $("#fakebtn").hide();
      }
    });
  }
  downloadChatFile() {
    axios
      .get(`/api/sampleChat`, {
        responseType: "arraybuffer"
      })
      .then(function (response) {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `sample.txt`
        );
        document.body.appendChild(link);
        link.click();
      })
      .catch(function (error) {
        console.log(error);

      });
  }
  render() {

    let uploadFileContent = '';
    if (!this.state.showLoader) {
      uploadFileContent = (<div style={{ paddingTop: '80px' }}>
        <form className="form-group" onSubmit={this.handleUploadImage}>

          <div className="container center">
            <div className="row">
              <div className="col-md-6 col-md-offset-3 center">
                <div>
                  <input
                    ref={ref => {
                      this.fileName = ref;
                    }}
                    type="text"
                    className="form-control filename"
                    placeholder="Enter the chat name"
                    required
                    onChange={(e, a) => {
                      console.log(e, a);
                      // this.setState({ chatname: a.value }) 
                    }}
                    onBlur={this.checkChatname}
                  />
                  {this.state.showUniqueChatnameMsg ? <p style={{ color: "red", fontSize: "16px", padding: "6px" }}>The chat name should be unique.</p> : null}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-md-offset-3 center">
                <div className="btn-container">
                  <h1 className="imgupload"><i className="fa fa-file-image-o"></i></h1>
                  <h1 className="imgupload ok"><i className="fa fa-check"></i></h1>
                  <h1 className="imgupload stop"><i className="fa fa-times"></i></h1>
                  <p id="namefile">Only .txt file allowed!</p>
                  <p>How to get the chat file. <a href="https://faq.whatsapp.com/en/android/23756533/" target="_blank">Click here.</a></p>
                  <p>Want a sample chat file! <a style={{ cursor: "pointer" }} onClick={this.downloadChatFile.bind(this)} target="_blank">Click here.</a> (Source: Kaggle) </p>
                  <button type="button" id="btnup" className="btn btn-primary btn-lg">Browse for your chat file!</button>
                  <input type="file" name="fileup" id="fileup"
                    ref={ref => {
                      this.uploadInput = ref;
                    }} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-md-offset-3 center">
                <div className="btn-container" style={{ paddingTop: "2%" }}>
                  <span>Chat date format: </span>
                  <label className="radio-inline">
                    <input type="radio" name="optradio" checked={this.state.format == "dateFirst"} onChange={() => {
                      this.setState({ format: "dateFirst" }, function () {
                        // console.log(this.state.format);
                      })
                    }} />DD/MM</label>
                  <label className="radio-inline">
                    <input type="radio" checked={this.state.format == "monthFirst"} name="optradio" onChange={() => {
                      this.setState({ format: "monthFirst" }, function () {
                        // console.log(this.state.format);
                      })
                    }} />
                    MM/DD
                    </label>
                </div></div></div>
            <div className="row">
              <div className="col-md-12">
                <input type="submit" value="Analyze" className="btn btn-primary" id="submitbtn" />
                <button type="button" className="btn btn-default" disabled="disabled" id="fakebtn">Analyze <i class="fa fa-minus-circle"></i></button>
              </div>
            </div>
          </div>
        </form>
        {/* <footer className="footer">
          <div className="container">
            <span >Made with love from Arun Mohan Raj</span>
          </div>
        </footer> */}
      </div>);
    } else {
      uploadFileContent = (<div><div className='loader'>
        <div className='loader_cogs'>
          <div className='loader_cogs__top'>
            <div className='top_part'></div>
            <div className='top_part'></div>
            <div className='top_part'></div>
            <div className='top_hole'></div>
          </div>
          <div className='loader_cogs__left'>
            <div className='left_part'></div>
            <div className='left_part'></div>
            <div className='left_part'></div>
            <div className='left_hole'></div>
          </div>
          <div className='loader_cogs__bottom'>
            <div className='bottom_part'></div>
            <div className='bottom_part'></div>
            <div className='bottom_part'></div>
            <div className='bottom_hole'></div>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "white", marginTop: "-55px", fontSize: "18px" }}>Analyzing...</p>
        {/* <footer className="footer">
          <div className="container">
            <span >Made with love from Arun Mohan Raj</span>
          </div>
        </footer> */}
      </div>
      </div>);
    }
    return (
      <div>
        <NavBar />
        <br />
        {uploadFileContent}
      </div>
    );
  }
}

export default withRouter(Main);
