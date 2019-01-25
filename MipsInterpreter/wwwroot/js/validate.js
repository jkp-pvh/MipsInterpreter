function validateRegisterToken(textLine, token) {
    if (!token.endsWith(",")) {
        throw "invalid text line: " + textLine;
    }
    else {

        if (true) {

        }

    }
}

function validateTextLine(textLine, tokens, lastLineLabel) {
    /* SUPPORTED INSTRUCTIONS
     * add $d, $s, $t   #adds $s and $t and stores the result in $d
     * 
     * NOT YET SUPPORTED INSTRUCTIONS:
     * 
     * 2 TOKENS
     *  lw
     *  la
     *  li
     *  sw
     *  b
     *  j
     *  jr
     *  jal
     * 
     * 3 TOKENS
     *  [NO INSTRUCTIONS]
     * 
     * 4 TOKENS
     *  add
     *  sub
     *  mult
     *  div
     *  beq
     *  
     * 5 TOKENS
     *  label + 4-param instruction
     * 
     * ALL FORMS OF lw:
     * lw $t, $s        #copies 1 word from memory address $s and stores it in $t
     * lw $t offset($)  #copies 1 word from memory address ($s + offset) and stores it in $t
     * lw $t label  #copies 1 word from memory address label and stores it in $t
     * lw $t offset(label)  #copies 1 word from memory address (label + offset) and stores it in $t #check that this is actually supported in SPIM
     */

    if (tokens.length == 1) {
        validateLabel(tokens[0], lastLineLabel)
    }
    else if (tokens.length == 4) {
        //there are no instructions with 3 tokens, so it's not possible for this line to be a label plus 3-token instruction
        validateTextLine_LengthFour(textLine, tokens, 0);   

    }
    else if (tokens.length == 5) {

    }
    else {
        throw "invalid text line: " + dataLine + ". unexpected number of tokens: " + tokens.length + "";
    }
}

function validateTextLine_LengthFour(textLine, tokens, startIndex) {
    
    validateOpCode_Length4(textLine, tokens[0]);
    if (IsArithmeticOpCode(tokens[0])) {
        validateRegisterToken(textLine, tokens, 1);
        validateRegisterToken(textLine, tokens, 2);
        validateRegisterToken(textLine, tokens, 3);
    }
    else {
        //beq is the only non-arithmetic 4-token instruction
    }
}

function validateRegisterToken(textLine, tokens, index) {

    if (!tokens[index].startsWith("$")) {
        throw new "invalid text line: " + textLine + ". (invalid register: " + tokens[index] + ")";
    }

    if (index != tokens.length - 1) {
        if (!tokens[index].endsWith(",")) {
            throw new "invalid text line: " + textLine + ". (invalid register: " + tokens[index] + ")";
        }
    }

    //var strippedToken = tokens[index].replace("$", "");
    var strippedToken = tokens[index].replace(",", "");

    if (!registers.hasOwnProperty(strippedToken)) {
        throw "invalid text line: " + textLine + ". (invalid register: " + registerNoComma + ")";
    }

    return true;
}

function IsArithmeticOpCode(opCode) {
    var retVal = false;

    switch (opCode) {
        case "add":
        case "sub":
        case "mult":
        case "div":
            retVal = true;
            break;
    }

    return retVal;
}

function validateOpCode_Length4(textLine, opCode) {
    switch (opCode) {
        case "add":
        case "sub":
        case "mult":
        case "div":
        case "beq":
            break;
        default:
            throw "invalid text line: " + textLine + ". (invalid op code: " + opCode + ")";
    };
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
