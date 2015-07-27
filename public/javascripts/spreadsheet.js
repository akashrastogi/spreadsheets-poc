
var spreadsheetID = '';

$(document).ready(function() {
    $('#btn_create_spreadsheet').on('click', createSpreadsheet);
    $('#btn_update_cell').on('click', updateCellAndDisplayOutput);
});

function createSpreadsheet(event) {
    var spreadsheetName = $('#txt_spreadsheet_name').val();
    if (!spreadsheetName) {
        $('#txt_spreadsheet_name').focus();
        alert('Spreadsheet name can not be blank.');
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/createSpreadsheet',
        data: {
            'spreadsheet_name': spreadsheetName
        }
    }).done(function(response) {
        if (response.error) {
            alert(response.error);
        } else {
            spreadsheetID = response.spreadsheet_id;
            alert('Spreadsheet created successfully. \n ID- ' + response.spreadsheet_id);
        }
    });
}

function updateCellAndDisplayOutput(event) {
    var cellValue = $('textarea#txt_input_cell').val();
    if (!spreadsheetID) {
        $('#txt_spreadsheet_name').focus();
        alert('Please create spreadsheet and then try again to update cell.');
    } else if (!cellValue) {
        $('textarea#txt_input_cell').focus();
        alert('Cell value can not be blank.');
    } else {
        $.ajax({
            type: 'POST',
            url: '/updateCell',
            data: {
                'spreadsheet_id': spreadsheetID,
                'cell_value': $('textarea#txt_input_cell').val(),
                'row': 4,
                'column': 6
            }
        }).done(function(response) {
            if (response.error) {
                alert(response.error);
            } else {
                alert('Cell updated successfully. \nPlease wait read operation will start in few seconds.');
            }
            var delay = 1000 * 5;
            setTimeout(function() {
                var readRow = 2,
                    readColumn = 1;
                displayCellValue(readRow, readColumn);
            }, delay)
        });
    }
}

function displayCellValue(row, column) {
    alert('Reading cell value at row ' + row + ', column ' + column + ', and spreadsheetID- ' + spreadsheetID);
    $.ajax({
        type: 'GET',
        url: '/readCell',
        data: {
            'spreadsheet_id': spreadsheetID,
            'row': row,
            'column': column
        }
    }).done(function(response) {
        if (response.error) {
            alert(response.error);
        } else {
            $("textarea#txt_output_cell").val(response.value);
            alert('All done :)');
        }
    });
}