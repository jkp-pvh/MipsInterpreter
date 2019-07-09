﻿//returns the initial value of the PC register
function LoadCode(code) {
    var sections = GetTextAndDataSections(code);

    var parsedDataSectionLines = parseDataSectionLines(sections.DataSectionLines);
    var parsedTextSectionLines = parseTextSectionLines(sections.TextSectionLines);

    labels = parseLabels(parsedDataSectionLines, parsedTextSectionLines);

    validateLabelReferences(labels, parsedTextSectionLines);

    clearMemory();
    registers = initRegisters();
    var PCInitValue = writeDataSectionToMemory(parsedDataSectionLines);
    writeTextSectionToMemory(parsedTextSectionLines, PCInitValue);

    printMemoryToScreen(memory, labels);

    return PCInitValue;
}

function clearMemory() {
    for (var i = 0; i < memory.length; i++) {
        memory[i] = { DisplayValue: "" };
    }
}

//returns the next free memory address
function writeDataSectionToMemory(parsedDataSectionLines) {
    for (var i = 0; i < parsedDataSectionLines.length; i++) {
        memory[i] = parsedDataSectionLines[i];
    }

    return i;
}

function writeTextSectionToMemory(parsedTextSectionLines, startIndex) {
    for (var i = 0; i < parsedTextSectionLines.length; i++) {
        memory[i + startIndex] = parsedTextSectionLines[i];
    }
}