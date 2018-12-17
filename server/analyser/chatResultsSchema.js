const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const chatDataSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: true,
        unique: true
    },
    latencyArr: [],
    dataForPieChart: [],
    wordsArr: [],
    topWords: [],
    peakhourData: [],
    msgPerDay: [],
    topEmojis: [],
    topUsersEmoji: [],
    imagesSent: [],
    workHoursChatList: [],
    nightChatList: [],
    lettersSent: [],
    firstMsg: []
})

let chatResults = mongoose.model('chatResults', chatDataSchema)
module.exports = chatResults;