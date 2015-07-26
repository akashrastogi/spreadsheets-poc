
'use strict';

var fs = require('fs'),
    googleConfig = JSON.parse(fs.readFileSync('config/google-config.json', 'utf-8'));

// Create duplicate spreadsheet
module.exports.createDuplicateSpreadsheet = function(copyTitle, callback) {
    authTokenCache(function(err, token) {
        console.log(err || token);
        if (token) {
            var googleDrive = require('google-drive');
            var meta = {
                title: copyTitle
            };
            var params = {
                title: copyTitle
            };
            googleDrive(token).files(googleConfig["job_template_spreadsheet_id"]).copy(meta, params,
                function(err, response, body) {
                    callback(err, body);
                });
        };
    });
};

//Update cell at row writeRow, column writeColumn to updatedValue
module.exports.updateCell = function(fileID, updatedValue, writeRow, writeColumn, callback) {
    authTokenCache(function(err, token) {
        console.log(err || token);
        if (token) {
            var Spreadsheet = require('edit-google-spreadsheet');
            // load spreadsheet
            Spreadsheet.load({
                debug: true,
                spreadsheetId: fileID,
                worksheetName: 'Sheet1',
                accessToken: {
                    type: 'Bearer',
                    token: token
                }
            }, function sheetReady(err, spreadsheet) {
                if (!err) {
                    // Update cell
                    var column = {};
                    column[writeColumn] = updatedValue;
                    var row = {};
                    row[writeRow] = column;
                    spreadsheet.add(row);
                    spreadsheet.send(function(err) {
                        callback(err);
                    });
                } else {
                    callback(err);
                }
            });
        };
    });
};

// Return value of given cell
module.exports.readCell = function(fileID, readRow, readColumn, callback) {
    authTokenCache(function(err, token) {
        console.log(err || token);
        if (token) {
            var Spreadsheet = require('edit-google-spreadsheet');
            // load spreadsheet
            Spreadsheet.load({
                debug: true,
                spreadsheetId: fileID,
                worksheetName: 'Sheet1',
                accessToken: {
                    type: 'Bearer',
                    token: token
                }
            }, function sheetReady(err, spreadsheet) {
                if (!err) {
                    // Read rows
                    spreadsheet.receive(function(err, rows, info) {
                        callback(err, rows[readRow][readColumn]);
                    });
                } else {
                    callback(err, '');
                }
            });
        };
    });
};

// get auth_token
function authTokenCache(callback) {

    var TokenCache = require('google-oauth-jwt').TokenCache,
        tokens = new TokenCache();

    tokens.get({
        email: googleConfig["client_email"],
        keyFile: 'config/creds.pem',
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://spreadsheets.google.com/feeds/'
        ]
    }, function(err, token) {
        callback(err, token)
    });
}