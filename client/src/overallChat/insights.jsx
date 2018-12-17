import React, { Component } from "react";
class Insights extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        let wordsArr = this.props.wordsArr.map(function (words) {
            return words[0] + " (" + words[1] + ")"
        }).join(", ");
        let imagesSent = this.props.imagesSent.map(function (images) {
            return images[0] + " (" + images[1] + ")"
        }).join(", ");

        let letters = this.props.lettersSent.map(function (letters) {
            return letters[0] + " (" + letters[1] + ")"
        }).join(", ");

        let topUsersEmoji = this.props.topUsersEmoji.map(function (emojis) {
            return emojis[0] + " (" + emojis[1] + ")"
        }).join(", ");

        let latencyArr = this.props.latencyArr.map(function (latencyArr) {
            return latencyArr[0] + " (" + (latencyArr[1] / 60).toFixed(1) + ") min";
        }).join(", ");

        let topEmojis = this.props.topEmojis.map(function (emoji) {
            return emoji[0] + " (" + emoji[1] + ")"
        }).join(", ");


        let mostUsedWords = this.props.topWords.map(function (word) {
            return word[0] + " (" + word[1] + ")"
        }).join(", ");
        return (
            <div className="insightsList">
                <p><b>Who sent the most images?</b><br />
                    {imagesSent}
                </p>
                <p><b>Who sent the most emojis?</b><br />
                    {topUsersEmoji}
                </p>
                <p><b>Who sent the most words? </b> <br />
                    {wordsArr}
                </p>
                <p><b>Who sent the most letters?</b> <br />
                    {letters}
                </p>
                <p><b>Who replies late?</b> <br />
                    {latencyArr}
                </p>
                <p><b>Top Emoji's used:</b> <br />
                    {topEmojis}
                </p>
                <p><b>Top used words:</b> <br />
                    {mostUsedWords}
                </p>

            </div>
        );
    }
}

export default Insights;
