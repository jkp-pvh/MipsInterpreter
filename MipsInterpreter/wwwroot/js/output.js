function printMemoryToScreen(memory, labels, startIndex = 0) {

    if (startIndex == 0) {
        var allRows = $("#tblMemoryValues tr");
        allRows.remove();

        var headerRow = "<thead>" +
            "<th>Label</th>" +
            "<th>Address (Words)</th>" +
            "<th>Data</th>" +
            "</thead>";

        var tblMemoryValues = $("#tblMemoryValues");
        tblMemoryValues.append(headerRow);
    }

    var reverseLabels = null;
    if (labels != null) {
        reverseLabels = createReverseDictionary(labels);
    }

    var rowAppenderObj = $("#tblMemoryValues tr:last");

    var html = "";
    for (var i = startIndex; i < MEMORY_SIZE; i++) {
        html += "<tr>";

        var label = "";
        if (reverseLabels != null && reverseLabels.hasOwnProperty(i.toString())) {
            label = reverseLabels[i.toString()];
        }

        html += "<td>";
        html += label;
        html += "</td>";

        html += "<td>";
        html += i;
        html += "</td>";

        html += "<td>";
        
        html += "<input type='text' value='" + memory[i].DisplayValue + "' ";
        html += memory[i].HasChanged ? " class='registerChanged' />" : "/>";
        html += "</td>";

        html += "</tr>";
    }

    rowAppenderObj.after(html);
}

function createReverseDictionary(dic) {
    var values = Object.values(dic);
    var keys = Object.keys(dic);

    var retVal = {};
    for (var i = 0; i < values.length; i++) {
        retVal[values[i].toString()] = keys[i];
    }

    return retVal;
}

function printRegistersToScreen(registers) {
    var divRegisterValues = $("#divRegisterValues")

    var html = "<table cellspacing='0' cellpadding='0' style='border:solid 0px black; background-color:white; margin-right:5px;'>";
    html += "<thead>" +
        "<th>Register</th> <th>Value</th>"
    "</thead>"
    for (var key in registers) {
        html += "<tr>";

        html += "<td>";
        html += key
        html += "</td>";

        html += "<td";
        html += registers[key].HasChanged ? " class='registerChanged'> " : ">";
        html += registers[key].DisplayValue;
        html += "</td>";

        html += "</tr>";
    }
    html += "</table>";

    divRegisterValues.html(html);
}