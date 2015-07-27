
'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = module.exports = express();
var router = express.Router();
var spreadsheetHandler = require('./spreadsheet-handler');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

// Routers
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Spreadsheet POC'
    });
});

// Create spreadsheet using job template
router.post('/createSpreadsheet', function(req, res) {
    console.log("Request received at '/createSpreadsheet");
    var copyTitle = req.body.spreadsheet_name;
    spreadsheetHandler.createDuplicateSpreadsheet(copyTitle, function(err, body) {
        var responseJson = {};
        if (err) {
            var errorMsg = 'Spreadsheet could not be copied. \n Error- ' + err;
            responseJson = {
                error: errorMsg
            };
        } else {
            var copiedFile = JSON.parse(body);
            responseJson = {
                spreadsheet_id: copiedFile.id
            };
        }
        res.send(responseJson);
    });
});

// Update cell
router.post('/updateCell', function(req, res) {
    console.log("Request received at '/updateCell");
    var body = req.body;
    var spreadsheetID = body.spreadsheet_id;
    var text = body.cell_value,
        row = body.row,
        column = body.column;
    console.log('Update cell- ' + 'text- ' + text + '  row- ' + row + '  column- ' + column);
    spreadsheetHandler.updateCell(spreadsheetID, text, row, column, function(err) {
        var responseJson = {};
        if (err) {
            var errorMsg = 'Spreadsheet cell could not be updated. \n Error- ' + err;
            responseJson = {
                error: errorMsg
            };
        }
        res.send(responseJson);
    });
});

// Read cell
router.get('/readCell', function(req, res) {
    console.log("Request received at '/readCell");
    var spreadsheetID = req.query.spreadsheet_id;
    var readRow = req.query.row;
    var readColumn = req.query.column;
    spreadsheetHandler.readCell(spreadsheetID, readRow, readColumn, function(err, value) {
        var responseJson = {};
        if (err) {
            var errorMsg = 'Could not read cell. \n Error- ' + err;
            responseJson = {
                error: errorMsg
            };
        } else {
            responseJson = {
                'value': value
            };
        }
        res.send(responseJson);
    });
});

// Mount router to the app root
app.use('/', router);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Run the app
if (!module.parent) {
    app.listen(process.env.PORT || 3000, function() {
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
}
module.exports = app;