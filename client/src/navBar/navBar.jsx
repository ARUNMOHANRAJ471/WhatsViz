import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <div>
                <nav className="navbar navbar-expand-sm navbar-dark" style={{ background: "black", position: "fixed", width: "100%", zIndex: "1000" }}>
                    <a className="navbar-brand ourLogo" style={{ cursor: "pointer", fontSize: "26px", fontFamily: 'Spicy Rice, cursive' }} onClick={() => { this.props.history.push(`/`); }}>WhatsViz</a>
                </nav>
            </div>
        );
    }
}

export default withRouter(NavBar);
