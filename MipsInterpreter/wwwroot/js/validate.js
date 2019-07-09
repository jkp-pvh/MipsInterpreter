/* SUPPORTED INSTRUCTIONS
     * 1 TOKEN
     -  halt* - new
     * 
     * 2 TOKENS
     *  b (jumps to offset instead of label)
     #  j
     -  jr
     -  jal
     * 
     * 3 TOKENS
     *  label + 2-token instruction
     * 
     #  la
     #  li
     #  lw
     #  sw
     *  move    
     * 
     * 4 TOKENS
     *  label + 3-token instruction
     * 
     #  add
     #  sub
     #  mult* - modifed
     #  div* - modified
     #  mod* - new
     #  beq
     #  bgtz
     -  blez 
     -  bne 
     *  
     * 5 TOKENS
     *  label + 4-token instruction
     * 
     * ALL FORMS OF lw:
     * lw $t, ($s)        #copies 1 word from memory address $s and stores it in $t
     * lw $t offset($)  #copies 1 word from memory address ($s + offset) and stores it in $t
     * lw $t label  #copies 1 word from memory address label and stores it in $t
     * lw $t offset(label)  #copies 1 word from memory address (label + offset) and stores it in $t #check that this is actually supported in SPIM
     */

/*
MISSING FEATURES:
    * Reset CPU state and memory state when user clicks Load Code

BUGS TO FIX
    * 

BUGS INCLUDED IN RELEASE:
    * labels at end of program not recognized (need a line of code with a label)
    * no error message for empty code file, or missing text/data section

 NEW FEATURES
    * also highlight memory values that have changed (due to a store word instruction)
    * show labels on Memory
    
MAYBE:
    * implement MOVE instruction

PRESENTATION PREP
    * write example programs
    * test example programs
    * make documentation
 */

function validateTextLine(textLine, tokens, lastLineLabel) {
    if (tokens.length == 1) {
        validateLabel(textLine, tokens[0], lastLineLabel)
    }
    else if(tokens.length == 2){
        validateTextLine_LengthTwo(textLine, tokens, 0);
    }
    else if (tokens.length == 3) {
        if (IsLabel(tokens[0])) {
            validateTextLine_LengthTwo(textLine, tokens, 1);
        }
        else {
            validateTextLine_LengthThree(textLine, tokens, 0);
        }
        
    }
    else if (tokens.length == 4) {
        if (IsLabel(tokens[0])) {
            validateTextLine_LengthThree(textLine, tokens, 1);
        }
        else {
            //there are no instructions with 3 tokens, so it's not possible for this line to be a label plus 3-token instruction
            validateTextLine_LengthFour(textLine, tokens, 0);   
        }
    }
    else if (tokens.length == 5) {
        if (IsLabel(tokens[0])) {
            validateTextLine_LengthFour(textLine, tokens, 1);
        }
        else {
            throw generateErrorMessage(textLine) + " (5 tokens, and first token is not a label)";
        }
    }
    else {
        throw generateErrorMessage(textLine) + " (unexpected number of tokens: " + tokens.length + ")";
    }
}

function validateTextLine_LengthTwo(textLine, tokens, startIndex){
    validateOpCode_Length2(textLine, tokens[startIndex]);
    //no way to validate label reference yet. we have to first do 1 pass of the whole file.
}

function validateTextLine_LengthThree(textLine, tokens, startIndex) {
    var opCode = tokens[startIndex];
    validateOpCode_Length3(textLine, opCode);

    if (opCode == "li") {
        validateRegisterToken(textLine, tokens, startIndex + 1);
        validateImmediate(textLine, tokens[startIndex + 2]);
    }
    else if (opCode == "la") {
        validateRegisterToken(textLine, tokens, startIndex + 1);
    }
    else if (opCode == "lw" || opCode == "sw") {
        validateRegisterToken(textLine, tokens, startIndex + 1);
        validateRegisterAndOffset(textLine, tokens[startIndex + 2]);
    }
    else if (opCode == "bgtz") {
        validateRegisterToken(textLine, tokens, startIndex + 1);
    }
}

function validateOpCode_Length2(textLine, opCode) {
    switch (opCode) {
        case "j":
            break;
        default:
            throw generateErrorMessage(textLine) + " (invalid op code: " + opCode + ", or expected 2 tokens)";
    }
}

function validateOpCode_Length3(textLine, opCode) {
    switch (opCode) {
        case "li":
        case "lw":
        case "sw":
        case "la":
        case "bgtz":
            break;
        default:
            throw generateErrorMessage(textLine) + " (invalid op code: " + opCode + ")";
    }
}

function validateTextLine_LengthFour(textLine, tokens, startIndex) {
    
    validateOpCode_Length4(textLine, tokens[startIndex]);
    if (IsArithmeticOpCode(tokens[startIndex])) {
        validateRegisterToken(textLine, tokens, startIndex + 1);
        validateRegisterToken(textLine, tokens, startIndex + 2);
        validateRegisterToken(textLine, tokens, startIndex + 3);
    }
    else if (IsBranchOpCode_LengthFour(tokens[startIndex])) { //beq is the only non-arithmetic 4-token instructions
        validateRegisterToken(textLine, tokens, startIndex + 1);
        validateRegisterToken(textLine, tokens, startIndex + 2);
    }
}

function validateImmediate(textLine, immediateValue) {

    try {
        var intValue = parseInt(immediateValue);
    }
    catch{
        throw generateErrorMessage(textLine) + " (invalid immediate value: " + immediateValue + ")";
    }

    return true;
}

function validateRegisterAndOffset(textLine, registerAndOffset) {
    if (!registerAndOffset.includes("("))
        throw generateErrorMessage(textLine) + " second register must be wrapped in parentheses.";

    var split = registerAndOffset.split("(");
    if (split.length != 2)
        throw generateErrorMessage(textLine) + " needs to contain at least 1 '(' character.";
    else if (split[1] == "") 
        throw generateErrorMessage(textLine) + " '(' cannot be the last character.";

    var offset = split[0];
    var register = split[1];

    if (isNaN(offset) && offset != "")
        throw generateErrorMessage(textLine) + " invalid offset value - '" + offset + "'";

    if (!register.endsWith(")"))
        throw generateErrorMessage(textLine) + " second register must be wrapped in parentheses.";

    register = register.replace(")", "");

    validateRegisterTokenHelper(textLine, register, false);
}

function validateRegisterToken(textLine, tokens, index) {
    var shouldHaveComma = index != tokens.length - 1;
    return validateRegisterTokenHelper(textLine, tokens[index], shouldHaveComma);
}

function validateRegisterTokenHelper(textLine, token, shouldHaveComma) {
    if (!token.startsWith("$")) {
        throw generateErrorMessage(textLine) + " (register: '" + token + "' should start with $)";
    }

    if (shouldHaveComma) {
        if (!token.endsWith(",")) {
            throw generateErrorMessage(textLine) + " (register '" + token + "' should end with a comma)";
        }
    }
    else {
        if (token.endsWith(",")) {
            throw generateErrorMessage(textLine) + " (register '" + token + "' should NOT end with a comma)";
        }
    }

    var strippedToken = token.replace(",", "");
    if (!registers.hasOwnProperty(strippedToken)) { //if the registers collection does not contain the key strippedToken:
        throw generateErrorMessage(textLine) + " (no such register: '" + strippedToken + "')";
    }

    return true;
}

function IsBranchOpCode_LengthFour(opCode) {
    retVal = false;

    switch (opCode) {
        case "beq":
            retVal = true;
            break;
    }

    return retVal;
}

function IsArithmeticOpCode(opCode) {
    var retVal = false;

    switch (opCode) {
        case "add":
        case "sub":
        case "mult":
        case "div":
        case "mod":
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
        case "mod":
        case "beq":
            break;
        default:
            throw generateErrorMessage(textLine) + " (invalid op code: " + opCode + ", or this opcode does not use 4 tokens)";
    };
}

function validateDataLine(dataLine, tokens, lastLineLabel) {
    if (tokens.length == 1) {
        //label only:
        validateLabel(dataLine, tokens[0], lastLineLabel);
    }
    else if (tokens.length == 2) {
        if (!validateDataSizeDeclaration(tokens[0]) || !validateValue(tokens[1])) {
            throw generateErrorMessage(dataLine);
        }
    }
    else if (tokens.length == 3) {
        if (lastLineLabel != null) {
            //2 labels in a row:
            throw generateErrorMessage(dataLine) + " (2 labels in a row)";
        }
        else if (!validateLabel(dataLine, tokens[0], lastLineLabel) || !validateDataSizeDeclaration(tokens[1]) || !validateValue(tokens[2])) {
            //VALID:
            throw generateErrorMessage(dataLine);
        }
    }
    else {
        
        throw generateErrorMessage(dataLine) + " (expected 1, 2, or 3 tokens, but found " + tokens.length + " tokens)";
    }
}

function validateLabel(codeLine, label, lastLineLabel) {
    if (lastLineLabel != null) {
        //2 labels in a row:
        throw generateErrorMessage(codeLine) + " (2 labels in a row)";
    }

    if (!IsLabel(label)) {
        throw generateErrorMessage(codeLine) + " (missing colon after label)";
    }

    return true;
}

function IsLabel(label) {
    return label.endsWith(":"); //todo: there must be at least 1 char before the ':', and it can't be a reserved char like '$' or ','. labels must be unique.
}

function validateDataSizeDeclaration(size) {
    return size == ".word";
}

function validateValue(value) {
    return !isNaN(value);
}

function validateLabelReferences(labels, codeLines){
    for(var i = 0; i < codeLines.length; i++){
        if (codeLines[i] instanceof JumpInstruction) {
            if (!labels.hasOwnProperty(codeLines[i].LabelReference)) {
                throw generateErrorMessage(codeLines[i].DisplayValue) + " (no such label: '" + codeLines[i].LabelReference + "')";
            }
        }
        else if (codeLines[i] instanceof BranchEqualityInstruction) {
            if (!labels.hasOwnProperty(codeLines[i].LabelReference)) {
                throw generateErrorMessage(codeLines[i].DisplayValue) + " (no such label: '" + codeLines[i].LabelReference + "')";
            }
        }
        else if (codeLines[i] instanceof BranchGreaterThanZeroInstruction) {
            if (!labels.hasOwnProperty(codeLines[i].LabelReference)) {
                throw generateErrorMessage(codeLines[i].DisplayValue) + " (no such label: '" + codeLines[i].LabelReference + "')";
            }
        }
        //else if (codeLines[i] instanceof LoadAddressInstruction) {
        //    if (!labels.hasOwnProperty(codeLines[i].LabelReference)) {
        //        throw generateErrorMessage(codeLines[i]) + " (no such label: '" + codeLines[i].LabelReference + "')"; //todo: duplicate code linein each error case.
        //    }
        //}
    }
}

function generateErrorMessage(codeLine){
    return "invalid line: '" + codeLine + "'"
}

function generateInvalidOpCodeMessage(codeLine){
    
}