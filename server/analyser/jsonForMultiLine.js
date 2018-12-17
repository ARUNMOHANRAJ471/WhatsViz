const fs = require('fs');
const LineByLineReader = require('line-by-line');
const lr = new LineByLineReader(`./chatFiles/puneBuddiesNew.txt`);
let sampleJson = {};
let chatArr = [];
lr.on('error', function(err) {
    // 'err' contains error object
    console.log('oh no!! An Error Occurred', err);
});

lr.on('line', function(line) {
    let values = line.split(/^([0-9]{1,2})[/|-]([0-9]{1,2})[/|-]([0-9]{2,4}), ([0-9]{1,2}):([0-9]{1,2}) (AM|am|PM|pm) - ([^:]*): (.*)/);
    console.log(values);
    if (values.length == 10) {
        let chatObj = {
            dt: null,
            date: null,
            hour: null,
            min: null,
            ampm: null,
            sender: null,
            msg: ""
        };
        let month = values[1].length == 2 ? values[1] : "0" + values[1];
        let date = values[2].length == 2 ? values[2] : "0" + values[2];
        let year = values[3].length == 2 ? values[3] : "20" + values[3];
        let hour = values[4].length == 2 ? values[4] : "0" + values[4];
        let min = values[5].length == 2 ? values[5] : "0" + values[5];
        let ampm = values[6].toLowerCase();
        chatObj.dt = date + "/" + month + "/" + year + " " + hour + ":" + min + ":00" + " " + ampm;
        chatObj.date = date + "/" + month + "/" + year;
        chatObj.hour = hour;
        chatObj.min = min;
        chatObj.ampm = ampm;
        chatObj.sender = values[7];
        chatObj.msg = values[8].trim();
        chatArr.push(chatObj);
    }
});

lr.on('end', function() {
    fs.writeFileSync('./output.json', JSON.stringify(chatArr));
});




// line code

// if (values[0].split(',')[0].includes('/')) {
//     // console.log(values[0].split(',')[0]);
//     let currentDate = values[0].split(',')[0];
//     let user = values[1];
//     if (values[1] == undefined || values[1] == "undefined") {
//         console.log(values[1]);

//     }
//     if (user != undefined && user != "undefined") {
//         if (!sampleJson[user]) {
//             sampleJson[user] = {};
//             sampleJson[user][currentDate] = 1;
//         } else {
//             if (sampleJson[user][currentDate]) {
//                 sampleJson[user][currentDate] += 1;
//             } else {
//                 sampleJson[user][currentDate] = 1;
//             }
//         }
//     }
// }


// end code
// let names = Object.keys(sampleJson);
// let dateValues = Object.values(sampleJson);
// let mulitiLineArray = [];
// names.map((name, key) => {
//     let dummy = {};
//     dummy["name"] = name;
//     dummy["data"] = dateValues[key];
//     mulitiLineArray.push(dummy);
// })
// fs.writeFileSync('./result.json', JSON.stringify(mulitiLineArray));