var chatResults = require("./chatResultsSchema.js");
let fs = require('fs');
let moment = require('moment');

function testRoute(req, successCB, errorCB) {
    successCB('success');
}


function uploadTxtFile(req, successCB, errorCB) {
    try {
        let imageFile = req.files.file;
        imageFile.mv(`${__dirname.replace('\'','/')}/chatFiles/${req.body.filename}.txt`, function(err) {
            if (err) {
                console.log(err);
                errorCB(err);
            } else {
                successCB({
                    file: `chatFiles/${req.body.filename}.txt`
                });
            }
        });
    } catch (e) {
        console.log("Error: ", e);

    }
}

function getChatDetails(req, successCB, errorCB) {
    try {
        let chatDataFile = fs.readFileSync(`${__dirname.replace('\'','/')}/chatFilesOP/${req.body.chatname}.json`);
        successCB(chatDataFile);
    } catch (e) {
        console.log(e);
        errorCB(e);
    }
}

function getMsgPerDay(req, successCB, errorCB) {
    try {
        let chatDataFile = fs.readFileSync(`${__dirname.replace('\'','/')}/chatFilesOP/${req.body.chatname}Line.json`);
        successCB(chatDataFile);
    } catch (e) {
        console.log(e);
        errorCB(e);
    }
}

function readAndDeleteFile(req, successCB, errorCB) {
    // let data = fs.readFileSync(`./server/analyser/chatFiles/${req.body.filename}.txt`, function(err, result) {
    //     if (err) throw err;
    //     // data will contain your file contents
    //     // console.log(data)
    // });
    // successCB(data);
    // // delete file
    // fs.unlink(`./server/analyser/chatFiles/${req.body.filename}.txt`, function(err) {
    //     if (err) throw err;
    //     console.log('successfully deleted ' + `./server/analyser/chatFiles/${req.body.filename}.txt`);
    // });
}

function parseData(req, successCB, errorCB) {
    const LineByLineReader = require('line-by-line'),
        lr = new LineByLineReader(`./server/analyser/chatFiles/${req.body.filename}.txt`);
    let messagesArr = [];
    lr.on('error', function(err) {
        // 'err' contains error object
        console.log('oh no!! An Error Occurred', err);
    });
    lr.on('line', function(message) {
        let msgObj = {
            dt: null,
            sender: null,
            msg: ""
        };

        // generic data regex and extract
        let regexiOS = /^([0-9]{1,2})[/|-]([0-9]{1,2})[/|-]([0-9]{2,4}), ([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}) (AM|am|PM|pm): ([^:]*): (.*)/
        let regexAndroid = /^([0-9]{1,2})[/|-]([0-9]{1,2})[/|-]([0-9]{2,4}), ([0-9]{1,2}):([0-9]{1,2}) (AM|am|PM|pm) - ([^:]*): (.*)/
        let matchiOS = message.match(regexiOS);
        let matchAndroid = message.match(regexAndroid);
        // console.log(matchiOS, matchAndroid);

        if (matchiOS) {
            let date = matchiOS[1].length == 2 ? matchiOS[1] : "0" + matchiOS[1];
            let month = matchiOS[2].length == 2 ? matchiOS[2] : "0" + matchiOS[2];
            let year = matchiOS[3].length == 2 ? matchiOS[3] : "20" + matchiOS[3];
            let hour = matchiOS[4].length == 2 ? matchiOS[4] : "0" + matchiOS[4];
            let min = matchiOS[5].length == 2 ? matchiOS[5] : "0" + matchiOS[5];
            let sec = matchiOS[6].length == 2 ? matchiOS[6] : "0" + matchiOS[6];
            let ampm = matchiOS[7].toLowerCase();
            msgObj.dt = date + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec + " " + ampm;
            msgObj.sender = matchiOS[8];
            msgObj.msg = matchiOS[9].trim();
            messagesArr.push(msgObj);
        } else if (matchAndroid) {
            let month = matchAndroid[1].length == 2 ? matchAndroid[1] : "0" + matchAndroid[1];
            let date = matchAndroid[2].length == 2 ? matchAndroid[2] : "0" + matchAndroid[2];
            let year = matchAndroid[3].length == 2 ? matchAndroid[3] : "20" + matchAndroid[3];
            let hour = matchAndroid[4].length == 2 ? matchAndroid[4] : "0" + matchAndroid[4];
            let min = matchAndroid[5].length == 2 ? matchAndroid[5] : "0" + matchAndroid[5];
            let ampm = matchAndroid[6].toLowerCase();
            msgObj.dt = date + "/" + month + "/" + year + " " + hour + ":" + min + ":00" + " " + ampm;
            msgObj.sender = matchAndroid[7];
            msgObj.msg = matchAndroid[8].trim();
            messagesArr.push(msgObj);
        } else {
            if (messagesArr.length > 0)
                messagesArr[messagesArr.length - 1].msg = messagesArr[messagesArr.length - 1].msg + " " + message.trim();
        }
        // console.log(JSON.stringify(msgObj));

    });
    lr.on('end', function() {
        fs.writeFileSync(`${__dirname.replace('\'','/')}/chatFilesOP/${req.body.filename}.json`, JSON.stringify(messagesArr));
        // delete file
        fs.unlink(`./server/analyser/chatFiles/${req.body.filename}.txt`, function(err) {
            if (err) throw err;
            console.log('successfully deleted ' + `./server/analyser/chatFiles/${req.body.filename}.txt`);
        });
        successCB(messagesArr);
    });
}

function totalMessagesPerIndividual(req, successCB, errorCB) {
    console.log(new Date(), ` - ${req.body.filename} created`)
    try {
        let dateFormat = "";
        if (req.body.formatForChat === "dateFirst") {
            dateFormat = "DD/MM/YYYY hh:mm:ss a";
        }
        if (req.body.formatForChat === "monthFirst") {
            dateFormat = "MM/DD/YYYY hh:mm:ss a";
        }

        let chatData = JSON.parse(fs.readFileSync(`${__dirname.replace('\'','/')}/chatFilesOP/${req.body.filename}.json`, 'utf-8'));
        // delete file
        fs.unlink(`${__dirname.replace('\'','/')}/chatFilesOP/${req.body.filename}.json`, function(err) {
            if (err) throw err;
            console.log('successfully deleted ' + `${__dirname.replace('\'','/')}/chatFilesOP/${req.body.filename}.json`);
        });
        let namesArray = [];
        let msgCount = [];
        let emojiCount = {}; // no of emojis user sent
        let emojiObj = {}; // no of times a particular emoji sent
        let imageCount = {}; // no of images user sent
        let wordsObj = {};
        let wordCount = {};
        let letterCount = {};
        let workHoursChat = {};
        let nightChat = {};
        let latency = {};
        let imageRegex = /<‎image omitted>/g;
        let mediaRegex = /<Media omitted>/g;
        let prevSender = chatData[0].sender || "dummy";
        let prevTime = moment(chatData[0].dt || "01/01/2000", dateFormat);
        let dailyMsgObj = {};
        let firstMsg = {};
        let dummyDate = null;

        // peak hours
        let timeArray = Array.apply(null, Array(24)).map(function(_, i) {
            return i;
        });
        let weekArray = Array.apply(null, Array(7)).map(function(_, i) {
            return i;
        });

        let timeAndWeek = [];

        timeArray.forEach(function() {
            let arr = [];
            weekArray.forEach(function() {
                arr.push(0);
            })
            timeAndWeek.push(arr);
        })

        chatData.map((msgObj, key) => {
                if (msgObj.sender && msgObj.dt && msgObj.msg) {
                    // logic to show overall chat contribution
                    if (namesArray.includes(msgObj.sender)) {
                        msgCount[namesArray.indexOf(msgObj.sender)] += 1;
                    } else {
                        // console.log("sender", msgObj.sender);

                        namesArray.push(msgObj.sender);
                        msgCount.push(0);
                    }

                    // logic to get msgs per day for an individual user
                    let nowDate = moment(msgObj.dt, dateFormat).startOf('day').valueOf();
                    dailyMsgObj[msgObj.sender] = dailyMsgObj[msgObj.sender] || {};
                    dailyMsgObj[msgObj.sender][nowDate] = dailyMsgObj[msgObj.sender][nowDate] || 0;
                    dailyMsgObj[msgObj.sender][nowDate] = dailyMsgObj[msgObj.sender][nowDate] + 1;

                    // find for most used emojis
                    let emojiMatches = msgObj.msg.match(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g);
                    if (emojiMatches) {
                        emojiCount[msgObj.sender] = emojiCount[msgObj.sender] ? emojiCount[msgObj.sender] + emojiMatches.length : emojiMatches.length;
                        emojiMatches.forEach(function(emoji) {
                            emojiObj[emoji] = emojiObj[emoji] ? emojiObj[emoji] + 1 : 1;
                        });
                    }

                    // find no of images user sent
                    let imageMatches = msgObj.msg.match(imageRegex) || msgObj.msg.match(mediaRegex);
                    if (imageMatches) {
                        imageCount[msgObj.sender] = imageCount[msgObj.sender] ? imageCount[msgObj.sender] + 1 : 1;
                    }
                    // individual words
                    let words = msgObj.msg.toLowerCase().split(/\s+/);
                    // total letters typed by individual
                    let letterLength = 0;
                    words.forEach(function(word) {
                        wordsObj[word] = wordsObj[word] ? wordsObj[word] + 1 : 1;
                        letterLength += word.split('').length;
                    })

                    // words count based on user
                    let wordLength = words.length;
                    wordCount[msgObj.sender] = wordCount[msgObj.sender] ? wordCount[msgObj.sender] + wordLength : wordLength;

                    // letters count based on user
                    letterCount[msgObj.sender] = letterCount[msgObj.sender] ? letterCount[msgObj.sender] + letterLength : letterLength;

                    // vetti officer - chat during work hours
                    let currentMsgDate = moment(msgObj.dt, dateFormat);
                    let currentDay = currentMsgDate.day();
                    let currentHour = currentMsgDate.hours();
                    if (currentDay > 0 && currentDay < 6 && currentHour >= 9 && currentHour <= 17) {
                        workHoursChat[msgObj.sender] = workHoursChat[msgObj.sender] ? workHoursChat[msgObj.sender] + 1 : 1;
                    }

                    // night owl - chat during night hours
                    if (currentHour == 23 || currentHour < 6) {
                        nightChat[msgObj.sender] = nightChat[msgObj.sender] ? nightChat[msgObj.sender] + 1 : 1;
                    }
                    // console.log(JSON.stringify(nightChat));

                    // delay in replying messages
                    if (msgObj.sender != prevSender) {
                        let currentTime = moment(msgObj.dt, dateFormat);
                        // console.log(currentTime);

                        let timeDiff = currentTime.diff(prevTime, 'seconds');
                        // console.log(timeDiff);

                        if (timeDiff < 3 * 60 * 60) {
                            if (latency[msgObj.sender] != undefined) {
                                latency[msgObj.sender].push(timeDiff);
                            } else {
                                latency[msgObj.sender] = [timeDiff];
                            }
                        }

                        prevSender = msgObj.sender;
                        prevTime = currentTime;
                    }

                    // peak hours calculation
                    // console.log("currentHour:", currentHour);
                    // console.log("currentDay: ", currentDay);

                    timeAndWeek[currentHour][currentDay] += 1;

                    // first messenger
                    let currentMsgOnlyDate = msgObj.dt.split(" ")[0];
                    if (currentMsgOnlyDate !== dummyDate) {
                        // console.log(key, " : ", currentMsgOnlyDate, " --- ", dummyDate);

                        firstMsg[msgObj.sender] = firstMsg[msgObj.sender] ? firstMsg[msgObj.sender] + 1 : 1;
                        dummyDate = msgObj.dt.split(" ")[0];
                    }
                }
            })
            // console.log(timeAndWeek);
            // console.log("firstMsg: ", JSON.stringify(firstMsg));

        // prepare json for daily msgs
        let dateArr;
        let msgPerDay = Object.keys(dailyMsgObj).map(function(key, index) {
            dateArr = Object.keys(dailyMsgObj[key]).map(function(date) {
                return [parseInt(date), dailyMsgObj[key][date]]
            });
            this.dateArr = dateArr.sort(function(a, b) {
                return a[0] - b[0]
            })
            return {
                name: key,
                data: dateArr
            }
        });

        // prepare json for peak hours for graph
        let peakhourData = [];
        for (let i = 0; i < timeAndWeek.length; i++) {
            for (let j = 0; j < timeAndWeek[0].length; j++) {
                peakhourData.push([i, j, timeAndWeek[i][j]]);
            }
        }
        // console.log("peakhourData:", peakhourData);
        // no of words spoken by individuals
        let wordsArr = Object.keys(wordCount).map(function(key) {
            return [key, wordCount[key]]
        }).sort(function(a, b) {
            return b[1] - a[1]
        });
        let regexForOnlyAlphaNum;
        let topWords = Object.keys(wordsObj).map(function(key) {
            regexForOnlyAlphaNum = /^[a-zA-Z0-9]+$/;
            if (key.length > 3 && !key.trim().includes('<media') && !key.trim().includes('omitted>') && regexForOnlyAlphaNum.test(key)) {
                return [key, wordsObj[key]]
            }
        }).sort(function(a, b) {
            return b[1] - a[1]
        }).splice(0, 10);

        let topEmojis = Object.keys(emojiObj).map(function(key) {
            return [key, emojiObj[key]]
        }).sort(function(a, b) {
            return b[1] - a[1]
        }).splice(0, 10)

        let topUsersEmoji = Object.keys(emojiCount).map(function(key) {
            return [key, emojiCount[key]]
        }).sort(function(a, b) {
            return b[1] - a[1]
        });

        let imagesSent = Object.keys(imageCount).map(function(key) {
            return [key, imageCount[key]]
        }).sort(function(a, b) {
            return b[1] - a[1]
        });
        let lettersSent = Object.keys(letterCount).map(function(key) {
            return [key, letterCount[key]]
        }).sort(function(a, b) {
            return b[1] - a[1]
        });
        let workHoursChatList = Object.keys(workHoursChat).map(function(key) {
            return [key, workHoursChat[key]]
        }).sort(function(a, b) {
            return b[1] - a[1]
        });
        let nightChatList = Object.keys(nightChat).map(function(key) {
            return [key, nightChat[key]]
        }).sort(function(a, b) {
            return b[1] - a[1]
        });
        // prepare json for latency
        Object.keys(latency).forEach(function(sender) {
            let timeDiff = latency[sender];
            let avgTimeDiff = timeDiff.reduce(function(a, b) {
                return a + b;
            }, 0) / timeDiff.length;
            latency[sender] = Math.ceil(avgTimeDiff);
        });
        let latencyArr = Object.keys(latency).map(function(key) {
            return [key, latency[key]]
        }).sort(function(a, b) {
            return b[1] - a[1]
        });
        // prepare json for overall chart
        let dataForPieChart = namesArray.map((name, key) => {
                return {
                    name: name,
                    y: msgCount[key]
                }
            })
            // console.log(dataForPieChart);
            // console.log("emojiCount", emojiCount);
            // console.log("imageCount", imageCount);

        let firstMsgArr = Object.keys(firstMsg).map(function(key) {
            return [key, firstMsg[key]]
        });
        let chatAnalysisResult = new chatResults({
            chatName: req.body.filename,
            latencyArr: latencyArr,
            dataForPieChart: dataForPieChart,
            wordsArr: wordsArr,
            topWords: topWords,
            peakhourData: peakhourData,
            msgPerDay: msgPerDay,
            topEmojis: topEmojis,
            topUsersEmoji: topUsersEmoji,
            imagesSent: imagesSent,
            workHoursChatList: workHoursChatList,
            nightChatList: nightChatList,
            lettersSent: lettersSent,
            firstMsg: firstMsgArr

        });
        chatAnalysisResult.save(function(err, savedObj) {
            if (err) {
                console.log("*****************************8VALIDATION ERROR", err);
                errorCB('error');
            } else {
                let returnObj = {
                        chatName: req.body.filename,
                        latencyArr: latencyArr,
                        dataForPieChart: dataForPieChart,
                        wordsArr: wordsArr,
                        topWords: topWords,
                        peakhourData: peakhourData,
                        msgPerDay: msgPerDay,
                        topEmojis: topEmojis,
                        topUsersEmoji: topUsersEmoji,
                        imagesSent: imagesSent,
                        workHoursChatList: workHoursChatList,
                        nightChatList: nightChatList,
                        lettersSent: lettersSent,
                        firstMsg: firstMsgArr
                    }
                    // console.log(JSON.stringify(returnObj));

                successCB("success");
            }
        });

    } catch (e) {
        console.log(e);
        errorCB(e)

    }
}

function getChatResults(req, successCB, errorCB) {
    chatResults.find({
        chatName: req.body.chatname
    }, function(err, chat) {
        if (err) {
            errorCB(err);
        } else {
            successCB(chat);
        }
    })
}

function deleteAnalysis(req, successCB, errorCB) {
    chatResults.deleteOne({
        chatName: req.body.chatname
    }, function(err, chat) {
        if (err) {
            console.log(err);
            errorCB(err);
        } else {
            // console.log(chat);
            successCB('success');
        }
    })
}
module.exports = {
    testRoute: testRoute,
    uploadTxtFile: uploadTxtFile,
    getChatDetails: getChatDetails,
    getMsgPerDay: getMsgPerDay,
    readAndDeleteFile: readAndDeleteFile,
    parseData: parseData,
    totalMessagesPerIndividual: totalMessagesPerIndividual,
    getChatResults: getChatResults,
    deleteAnalysis: deleteAnalysis
};