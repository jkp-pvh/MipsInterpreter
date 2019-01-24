
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

function parseTextSectionLines(textLines) {
    return parseLines(textLines, validateTextLine, parseTextLine);
}

function parseDataSectionLines(dataLines) {
    return parseLines(dataLines, validateDataLine, parseDataLine);
}

function parseLines(lines, validationFunc, parseFunc) {

    var parsedAndLabeled = [];
    var parsedIndex = 0;
    var lastLineLabel = null;

    for (var i = 0; i < lines.length; i++) {
        var uncommented = StripComments(lines[i]);
        var whitespaceConverted = uncommented.replace(/\t/g, " "); //\t is a tab
        whitespaceConverted = whitespaceConverted.trim();

        var tokens = whitespaceConverted.split(" ");
        tokens = removeBlankTokens(tokens);

        validationFunc(lines[i], tokens, lastLineLabel);
        var parsedResult = parseFunc(tokens, lastLineLabel);

        if (parsedResult.ParsedLine != null) {
            parsedAndLabeled.push(parsedResult.ParsedLine);
        }

        if (parsedResult.ShouldUpdateLastLineLabel) {
            lastLineLabel = parsedResult.LastLineLabel;
        }
    }

    return parsedAndLabeled;
}

function parseTextLine(tokens, lastLineLabel) {

}

function parseDataLine(tokens, lastLineLabel) {
    var retVal = {};

    if (tokens.length == 1) {
        //label only:
        retVal.LastLineLabel = tokens[0];
        retVal.ShouldUpdateLastLineLabel = true;
        retVal.ParsedLine = null;
    }
    else if (tokens.length == 2) {
        var curLineLabel = null;

        if (lastLineLabel != null) {
            curLineLabel = lastLineLabel;
            retVal.LastLineLabel = null;
            retVal.ShouldUpdateLastLineLabel = true;
        }

        retVal.ParsedLine = {
            Label: curLineLabel,
            DataSizeDeclaration: tokens[0],
            Value: tokens[1]
        };
    }
    else if (tokens.length == 3) {

        retVal.ParsedLine = {
            Label: tokens[0],
            DataSizeDeclaration: tokens[1],
            Value: tokens[2]
        };

        retVal.ShouldUpdateLastLineLabel = false;
    }

    return retVal;
}

function removeBlankTokens(tokens) {
    return tokens.filter(function (value, index, arr) {
        return (value != "");
    });
}

function validateTextLine(dataLine, tokens, lastLineLabel) {
    /* SUPPORTED INSTRUCTIONS
     * add $d, $s, $t   #adds $s and $t and stores the result in $d
     * 
     * NOT YET SUPPORTED INSTRUCTIONS:
     * lw $t, $s        #copies 1 word from memory address $s and stores it in $t
     * lw $t offset($)  #copies 1 word from memory address ($s + offset) and stores it in $t
     * lw $t label  #copies 1 word from memory address label and stores it in $t
     * lw $t offset(label)  #copies 1 word from memory address (label + offset) and stores it in $t #check that this is actually supported in SPIM
     */

    if (tokens.length == 1) {

    }
    else if (tokens.length == 4)
    {

    }
    else if (tokens.length == 5) {

    }
    else {
        throw "invalid data line: " + dataLine + ". unexpected number of tokens: " + tokens.length + "";
    }
}

function validateDataLine(dataLine, tokens, lastLineLabel) {
    if (tokens.length == 1) {
        //label only:
        validateLabel(tokens[0], lastLineLabel);
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
        else if (!validateLabel(tokens[0], lastLineLabel) || !validateDataSizeDeclaration(tokens[1]) || !validateValue(tokens[2])) {
            //VALID:
            throw "invalid data line: " + dataLine;
        }
    }
    else {
        throw "invalid data line: " + dataLine + " (expected 1, 2, or 3 tokens, but found " + tokens.length + " tokens)";
    }
}

function validateLabel(label, lastLineLabel) {
    if (lastLineLabel != null) {
        //2 labels in a row:
        throw "invalid data line: " + dataLine + " (2 labels in a row)";
    }

    if (!label.endsWith(":")) {
        throw "invalid data line: " + dataLine;
    }

    return true;
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