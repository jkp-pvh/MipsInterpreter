﻿//returns the initial value of the PC register
function LoadCode(code) {
    var sections = GetTextAndDataSections(code);

    var parsedDataSectionLines = parseDataSectionLines(sections.DataSectionLines);
    var parsedTextSectionLines = parseTextSectionLines(sections.TextSectionLines);

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