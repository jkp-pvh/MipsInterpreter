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

        if(tokens.length == 2){
            retVal.ParsedLine = ParseInstruction_LengthTwo(tokens, curLineLabel);
        }
        if (tokens.length == 3) {

            if (IsLabel(tokens[0])) {
                curLineLabel = tokens[0];
                tokens = tokens.slice(1);
                retVal.ParsedLine = ParseInstruction_LengthTwo(tokens, curLineLabel);
            }
            else {
                retVal.ParsedLine = ParseInstruction_LengthThree(tokens, curLineLabel);
            }
        }
        else if (tokens.length == 4) {

            if (IsLabel(tokens[0])) {
                curLineLabel = tokens[0];
                tokens = tokens.slice(1);
                retVal.ParsedLine = ParseInstruction_LengthThree(tokens, curLineLabel);
            }
            else {
                retVal.ParsedLine = ParseInstruction_LengthFour(tokens, curLineLabel);
            }
        }
        else if (tokens.length == 5) {
            if (IsLabel(tokens[0])) {
                curLineLabel = tokens[0];
                tokens = tokens.slice(1);
                retVal.ParsedLine = ParseInstruction_LengthFour(tokens, curLineLabel);
            }
            else {
                throw generateErrorMessage(tokens.join(" ") + ". no instructions have 5 tokens");
            }
        }
    }
    
    return retVal;
}

function ParseInstruction_LengthFour(tokens, curLineLabel) {
    if (IsArithmeticOpCode(tokens[0])) {
        return ParseArithmeticInstruction(tokens, curLineLabel);
    }
    else {
        return ParseBranchInstruction_LengthFour(tokens, curLineLabel);
    }
}

function ParseBranchInstruction_LengthFour(tokens, curLineLabel) {
    var displayValue = getDisplayValueFromTokens(tokens);
    var registerOne = parseRegisterToken(tokens[1]);
    var registerTwo = parseRegisterToken(tokens[2]);
    var labelReference = tokens[3];
    
    return new BranchEqualityInstruction(curLineLabel, tokens[0], registerOne, registerTwo, labelReference, displayValue);
}

function ParseArithmeticInstruction(tokens, curLineLabel){
    var displayValue = tokens[0] + " " + tokens[1] + " " + tokens[2] + tokens[3];
    var destRegister = parseRegisterToken(tokens[1]);
    var sourceRegister1 = parseRegisterToken(tokens[2]);
    var sourceRegister2 = parseRegisterToken(tokens[3]);

    return new ArithmeticInstruction(curLineLabel, tokens[0], destRegister, sourceRegister1, sourceRegister2, displayValue);
}

function ParseInstruction_LengthTwo(tokens, curLineLabel){
    var displayValue = tokens[0] + " " + tokens[1];
    return new JumpInstruction(curLineLabel, tokens[0], tokens[1], displayValue);
}

function ParseInstruction_LengthThree(tokens, curLineLabel) {
    var displayValue = tokens[0] + " " + tokens[1] + " " + tokens[2];

    var destRegister = parseRegisterToken(tokens[1]);
    if (tokens[0] == "li") {
        return new LoadImmediate(curLineLabel, tokens[0], destRegister, tokens[2], displayValue);
    }
    else if (tokens[0] == "la") {
        return new LoadAddressInstruction(curLineLabel, tokens[0], destRegister, tokens[2], displayValue);
    }
    else if (tokens[0] == "lw" || tokens[0] == "sw") {
        return parseLoadOrStoreWord(tokens, curLineLabel);
    }
    else if (tokens[0] == "bgtz") {
        return ParseBranchInstruction_LengthThree(tokens, curLineLabel);
    }
    else if (tokens[0] == "move") {
        return parseMoveInstruction(tokens, curLineLabel);
    }
}

function parseMoveInstruction(tokens, curLineLabel) {
    var destRegister = parseRegisterToken(tokens[1]);
    var srcRegister = parseRegisterToken(tokens[2]);
    return new MoveInstruction(curLineLabel, tokens[0], destRegister, srcRegister, tokens.join(" "));
}

function ParseBranchInstruction_LengthThree(tokens, curLineLabel) {
    var displayValue = tokens[0] + " " + tokens[1] + " " + tokens[2];
    var registerOne = parseRegisterToken(tokens[1]);
    var labelReference = tokens[2];

    return new BranchGreaterThanZeroInstruction(curLineLabel, tokens[0], registerOne, labelReference, displayValue)

}

function parseLoadOrStoreWord(tokens, curLineLabel) {
    var displayValue = tokens[0] + " " + tokens[1] + " " + tokens[2];
    var registerOne = parseRegisterToken(tokens[1]);

    var registerAndOffset = tokens[2];
    var split = registerAndOffset.split("(");

    var offset = 0;
    if (split[0] != "") {
        offset = parseInt(split[0]);
    }

    split[1] = split[1].replace(")", "");

    
    var registerTwo = split[1];

    if (tokens[0] == "lw") {
        return new LoadWordInstruction(curLineLabel, tokens[0], registerOne, registerTwo, offset, displayValue);
    }
    else if (tokens[0] == "sw") {
        return new StoreWordInstruction(curLineLabel, tokens[0], registerOne, registerTwo, offset, displayValue);
    }

    
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

function parseLabel(label)
{
    return label.replace(":", "");
}

function parseLabels(dataLines, textLines){
    var labels = {};   
    
    for(var i=0; i<dataLines.length; i++){
        var curLabel = dataLines[i].Label;
        if(curLabel != null){
            curLabel = parseLabel(curLabel);
            if(labels.hasOwnProperty(curLabel)){
                throw "duplicate label: '" + curLabel + "'";
            }

            labels[curLabel] = i;
        }
    }

    for(var i=0; i<textLines.length; i++){
        var curLabel = textLines[i].Label;
        if(curLabel != null){
            curLabel = parseLabel(curLabel);
            if(labels.hasOwnProperty(curLabel)){
                throw "duplicate label: '" + curLabel + "'";
            }
            
            labels[curLabel] = i + dataLines.length;
        }
    }

    return labels;
}

function getDisplayValueFromTokens(tokens) {
    var retVal = "";
    for (var i = 0; i < tokens.length; i++) {
        retVal += tokens[i] + " ";
    }
    return retVal;
}