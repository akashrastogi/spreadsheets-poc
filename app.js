
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
app.use(express.static(path.join(__dirname, 'public')));

// Routers
router.get('/', function(req, res) {
    // Test spreadsheet read/write
    spreadsheetHandler.updateCell('New value 3', 4, 9);
    res.end('Home page');
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