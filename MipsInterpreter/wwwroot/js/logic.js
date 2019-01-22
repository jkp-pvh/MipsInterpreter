
function GetTextAndDataSections(code) {
    var retVal = {};

    code = code.replace("\r", "");
    var codeLines = splitCodeLines(code);

    var dataSectionLines = [];
    var textSectionLines = [];

    var isInDataSection = false;
    var isInTextSection = false;
    for (var i = 0; i < codeLines.length; i++) {
        var uncommented = StripComments(codeLines[i]);
        var trimmed = uncommented.trim();

        if (trimmed == "") {
            continue;
        }

        if (trimmed == ".data") {
            isInDataSection = true;
            continue;
        }
        else if (trimmed == ".text") {
            isInDataSection = false;
            isInTextSection = true;
            continue;
        }

        if (isInDataSection) {
            dataSectionLines.push(codeLines[i]);
        }
        else if (isInTextSection) {
            textSectionLines.push(codeLines[i]);
        }    
    }

    retVal.DataSectionLines = dataSectionLines;
    retVal.TextSectionLines = textSectionLines;

    return retVal;
}

function StripComments(codeLine) {
    var retVal = null;
    var hashIndex = codeLine.indexOf("#");

    if (hashIndex == -1) {
        retVal = codeLine;
    }
    else {
        retVal = codeLine.substring(0, hashIndex);
    }

    return retVal;
}

function parseDataSectionLines(dataLines) {
    var parsedAndLabeled = [];
    var parsedIndex = 0;
    var lastLineLabel = null;

    for (var i = 0; i < dataLines.length; i++) {
        var uncommented = StripComments(dataLines[i]);
        var whitespaceConverted = uncommented.replace(/\t/g, " "); //\t is a tab
        whitespaceConverted = whitespaceConverted.trim();

        var tokens = whitespaceConverted.split(" ");
        tokens = tokens.filter(function (value, index, arr) {
            return (value != "");
        });

        validateDataLine(dataLines[i], tokens, lastLineLabel);

        if (tokens.length == 1) {
            //label only:
            lastLineLabel = tokens[0];
            continue;
        }
        else if (tokens.length == 2) {
            var curLineLabel = null;

            if (lastLineLabel != null) {
                curLineLabel = lastLineLabel;
                lastLineLabel = null;
            }

            var parsedLine = {
                Label: curLineLabel,
                DataSizeDeclaration: tokens[0],
                Value: tokens[1]
            };

            parsedAndLabeled.push(parsedLine);
        }
        else if (tokens.length == 3) {
            var parsedLine = {
                Label: tokens[0],
                DataSizeDeclaration: tokens[1],
                Value: tokens[2]
            };

            parsedAndLabeled.push(parsedLine);
        }
    }

    return parsedAndLabeled;
}

function validateDataLine(dataLine, tokens, lastLineLabel) {
    if (tokens.length == 1) {
        //label only:

        if (lastLineLabel != null) {
            //2 labels in a row:
            throw "invalid data line: " + dataLine + " (2 labels in a row)";
        }

        if (!validateLabel(tokens[0])) {
            throw "invalid data line: " + dataLine;
        }
    }
    else if (tokens.length == 2) {
        if (!validateDataSizeDeclaration(tokens[0]) || !validateValue(tokens[1])) {
            throw "invalid data line: " + dataLine;
        }
    }
    else if (tokens.length == 3) {
        if (lastLineLabel != null) {
            //2 labels in a row:
            throw "invalid data line: " + dataLine + " (2 labels in a row)";
        }
        else if (!validateLabel(tokens[0]) || !validateDataSizeDeclaration(tokens[1]) || !validateValue(tokens[2])) {
            //VALID:
            throw "invalid data line: " + dataLine;
        }
    }
    else {
        throw "invalid data line: " + dataLine + " (expected 1, 2, or 3 tokens, but found " + tokens.length + " tokens)";
    }
}

function parseDataSectionLine_OLD(dataSectionLine) {
    var retVal = {};

    var uncommented = StripComments(dataSectionLine);
    var whitespaceConverted = uncommented.replace(/\t/g, " "); //first char is a tab
    whitespaceConverted = whitespaceConverted.trim();

    var tokens = whitespaceConverted.split(" ");

    var label = null;
    var foundWordDeclaration = false;
    var value = null;

    if (tokens.length == 1) {
        //label only:
        if (validateLabel(tokens[0])) {
            label = tokens[0];
        }
        else {
            retVal.IsError = true;
        }
    }
    else if (tokens.length == 2) {
        //declaration without label
    }
    else if (tokens.length == 3) {
        //label and delaration
    }
    else {
        retVal.IsError = true;
    }

    return retVal;
}

function validateLabel(label) {
    return label.endsWith(":");
}

function validateDataSizeDeclaration(size) {
    return size == ".word";
}

function validateValue(value) {
    return !isNaN(value);
}

//returns the initial value of the PC register
function LoadCode(code) {
    var sections = GetTextAndDataSections(code);

    var parsedDataSectionLines = parseDataSectionLines(sections.DataSectionLines);

    clearMemory();
    var PCInitValue = writeDataSectionToMemory(parsedDataSectionLines);
    writeCodeSectionToMemory(sections.TextSectionLines, PCInitValue);

    return PCInitValue;
}

function initLabelDictionary(parsedDataSectionLines) {

}

function clearMemory() {
    for (var i = 0; i < memory.length; i++) {
        memory[i] = "";
    }
}

//returns the next free memory address
function writeDataSectionToMemory(parsedDataSectionLines) {
    for (var i = 0; i < parsedDataSectionLines.length; i++) {
        memory[i] = parsedDataSectionLines[i].Value;
    }

    writeMemory(memory);

    return i;
}

function writeCodeSectionToMemory(codeLines, startIndex) {
    for (var i = 0; i < codeLines.length; i++) {
        memory[i + startIndex] = codeLines[i];
    }
}

/*
 PARSING
    * remove all comments
    * separate data section from code
        * validate data section
        * validate code section
        * load data & code into memory
    * ready to step
 
 */

function splitCodeLines(code) {
    return code.split("\n");
}