const router = require('express').Router();
let analyserController = require('./analyserController.js');

router.get('/test', function(req, res) {
    try {
        // console.log("in route ");
        analyserController.testRoute(req, function successCB(users) {
            // console.log(users);
            res.status(200).send(users);
        }, function errorCB(err) {
            console.log(err);
            res.status(200).json({
                error: "failed"
            });
        })
    } catch (e) {
        res.status(500).json({
            error: "Server error...try again later"
        });
    }
});

router.post('/uploadFile', function(req, res) {
    try {
        // console.log("in route ");
        analyserController.uploadTxtFile(req, function successCB(result) {
            analyserController.parseData(req, function successCB(chatObj) {
                analyserController.totalMessagesPerIndividual(req, function successCB(chatObj) {
                    res.send(chatObj);
                }, function errorCB(err) {
                    console.log(err);
                    // res.status(200).json({
                    //     error: "failed"
                    // });
                    res.send(err);
                })
            }, function errorCB(err) {
                console.log(err);
                res.status(200).json({
                    error: "failed"
                });
            })

        }, function errorCB(err) {
            console.log(err);
            res.status(200).json({
                error: "failed"
            });
        })
    } catch (e) {
        res.status(500).json({
            error: "Server error...try again later"
        });
    }
});

router.post('/getChatResults', function(req, res) {
    try {
        // console.log("in route ");
        analyserController.getChatResults(req, function successCB(result) {
            res.send(result);
        }, function errorCB(err) {
            console.log(err);
            res.send('error');
        })
    } catch (e) {
        res.status(500).json({
            error: "Server error...try again later"
        });
    }
});

router.post('/deleteAnalysis', function(req, res) {
    try {
        // console.log("in route ");
        analyserController.deleteAnalysis(req, function successCB(result) {
            res.send(result);
        }, function errorCB(err) {
            console.log(err);
            res.status(200).json({
                error: "failed"
            });
        })
    } catch (e) {
        res.status(500).json({
            error: "Server error...try again later"
        });
    }
});



module.exports = router;