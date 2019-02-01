﻿function parseDataSectionLines(dataLines) {
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

function parseTextSectionLines(textLines) {
    return parseLines(textLines, validateTextLine, parseTextLine);
}

function parseTextLine(tokens, lastLineLabel) {
    var retVal = {};

    if (tokens.length == 1) {
        //label only:
        retVal.LastLineLabel = tokens[0];
        retVal.ShouldUpdateLastLineLabel = true;
        retVal.ParsedLine = null;
    }
    else {
        var curLineLabel = null;
        if (lastLineLabel != null) {
            curLineLabel = lastLineLabel;
            retVal.LastLineLabel = null;
            retVal.ShouldUpdateLastLineLabel = true;
        }

        if (tokens.length == 3) {

            if (IsLabel(tokens[0])) {
                //todo: handle case of label + 2-token instruction
            }
            else {
                Parse3TokenInstruction(tokens, retVal, curLineLabel);
            }
        }
        else if (tokens.length == 4) {

            if (IsLabel(tokens[0])) {
                //todo: handle the case of label + 3-token instruction
            }
            else {
                if (IsArithmeticOpCode(tokens[0])) {
                    //todo: parse arithmetic op code
                }
                else {
                    //todo: handle BEQ instruction
                }
            }
        }
        else if (tokens.length == 5) {

        }
    }
    
    return retVal;
}

function Parse3TokenInstruction(tokens, retVal, curLineLabel) {
    var displayValue = tokens[0] + " " + tokens[1] + " " + tokens[2];
    var destRegister = parseRegisterToken(tokens[1]);
    retVal.ParsedLine = new LI(curLineLabel, tokens[0], destRegister, tokens[2], displayValue);
}

function parseRegisterToken(token) {
    return token.replace(",", "");
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
            Value: tokens[1],
            DisplayValue: tokens[1]
        };
    }
    else if (tokens.length == 3) {

        retVal.ParsedLine = {
            Label: tokens[0],
            DataSizeDeclaration: tokens[1],
            Value: tokens[2],
            DisplayValue: tokens[2]
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

function splitCodeLines(code) {
    return code.split("\n");
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