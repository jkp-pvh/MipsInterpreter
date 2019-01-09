function writeMemory(memory) {
    var divMemoryValues = $("#divMemoryValues")

    var html = "<table cellspacing='0' cellpadding='0' style='border:solid 0px black'>";
    html += "<thead>" +
        "<th>Word</th> <th>Byte</th> <th>Data</th>"
        "</thead>"
    for (var i = 0; i < MEMORY_SIZE; i++) {
        html += "<tr>";

        html += "<td>";
        html += i;
        html += "</td>";


        html += "<td>";
        html += i * WORD_SIZE_IN_BYTES;
        html += "</td>";

        html += "<td>";
        html += "<input type='text' value='" + memory[i] + "' />";
        html += "</td>";

        html += "</tr>";
    }
    html += "</table>";

    divMemoryValues.html(html);
}

function writeRegisters(registers) {
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