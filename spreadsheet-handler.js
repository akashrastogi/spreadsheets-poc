
'use strict';

var fs = require('fs'),
    googleConfig = JSON.parse(fs.readFileSync('config/google-config.json', 'utf-8'));

//Update cell at row r, column c to text
module.exports.updateCell = function(text, r, c) {
    authTokenCache(function(err, token) {
        console.log(err || token);
        if (token) {
            var Spreadsheet = require('edit-google-spreadsheet');
            // load spreadsheet
            Spreadsheet.load({
                debug: true,
                spreadsheetId: googleConfig["spreadsheet_id"],
                worksheetName: 'Sheet1',
                accessToken: {
                    type: 'Bearer',
                    token: token
                }
            }, function sheetReady(err, spreadsheet) {
                if (!err) {
                    // Update cell at row r, column c to text
                    var column = {};
                    column[c] = text;
                    var row = {};
                    row[r] = column;
            		spreadsheet.add(row);
                    spreadsheet.send(function(err) {
                        if (!err) {
                            console.log('Updated cell at row ' + r 
                            	+ ', column ' + c + ' to ' + text);
                        } else console.log('Could not update cell. \n Error- ' + err);
                    });

                    // Read rows
                    spreadsheet.receive(function(err, rows, info) {
                        if (!err) {
                            console.log("Cell at row 2 and column 1- ", rows[2][1]);
                            console.log("Spreadsheet info:", info);
                        } else console.log('Could not read rows. \n Error- ' + err);
                    });
                } else {
                    console.log('Could not load spreadsheet');
                    console.log('\n Error- ' + err);
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