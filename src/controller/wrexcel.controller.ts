const XlsxPopulate = require('xlsx-populate');

// Load an existing workbook
XlsxPopulate.fromFileAsync("./WR.xlsx")
    .then((workbook: any) => {
        // Modify the workbook.
        workbook.sheet("Sheet2").cell("A22").value("Test Deskripsi");

        // Log the value.
        // console.log(value);
        return workbook.toFileAsync("./WRhendra.xlsx");
    });