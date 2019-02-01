function printMemoryToScreen(memory, startIndex = 0) {

    if (startIndex == 0) {
        var allRows = $("#tblMemoryValues tr");
        allRows.remove();

        var headerRow = "<thead>" +
            "<th>Word</th>" +
            "<th>Byte</th>" +
            "<th>Data</th>" +
            "</thead>";

        var tblMemoryValues = $("#tblMemoryValues");
        tblMemoryValues.append(headerRow);
    }
    

    var rowAppenderObj = $("#tblMemoryValues tr:last")

    var html = "";
    for (var i = startIndex; i < MEMORY_SIZE; i++) {
        html += "<tr>";

        html += "<td>";
        html += i;
        html += "</td>";


        html += "<td>";
        html += i * WORD_SIZE_IN_BYTES;
        html += "</td>";

        html += "<td>";
        html += "<input type='text' value='" + memory[i].DisplayValue + "' />";
        html += "</td>";

        html += "</tr>";
    }

    rowAppenderObj.after(html);
}

function printRegistersToScreen(registers) {
    var divRegisterValues = $("#divRegisterValues")

    var html = "<table cellspacing='0' cellpadding='0' style='border:solid 0px black'>";
    html += "<thead>" +
        "<th>Register</th> <th>Value</th>"
    "</thead>"
    for (var key in registers) {
        html += "<tr>";

        html += "<td>";
        html += key
        html += "</td>";

        html += "<td>";
        html += registers[key];
        html += "</td>";

        html += "</tr>";
    }
    html += "</table>";

    divRegisterValues.html(html);
}