﻿
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

//returns the initial value of the PC register
function LoadCode(code) {
    var sections = GetTextAndDataSections(code);
    return WriteTextAndDataToMemory(sections);
}

//returns the initial value of the PC register
function WriteTextAndDataToMemory(sections) {
    //clear memory:
    for (var i = 0; i < memory.length; i++) {
        memory[i] = "";
    }

    //write data section
    for (var i = 0; i < sections.DataSectionLines.length; i++) {
        memory[i] = sections.DataSectionLines[i];
    }

    //write free space
    const FREE_SPACE = 10; //number of words we want between end of data and start of program
    var startIndex = sections.DataSectionLines.length;
    for (var i = 0; i < FREE_SPACE.length; i++) {
        memory[startIndex + i] = "";
    }

    //write text section
    debugger;
    var startIndex = sections.TextSectionLines.length + FREE_SPACE + 1; //note that here we know the starting value of the PC
    var programCounterInitValue = startIndex * WORD_SIZE_IN_BYTES;
    for (var i = 0; i < sections.TextSectionLines.length; i++) {
        memory[startIndex + i] = sections.TextSectionLines[i];
    }

    //output to HTML controls:
    writeMemory(memory);

    return programCounterInitValue;
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

function parseSingleCodeLine(codeLine) {

}