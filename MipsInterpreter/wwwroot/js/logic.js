function LoadCode(memory, code) {
    const FREE_SPACE = 10; //number of words we want between end of data and start of program

    code = code.replace("\r", "");
    var codeLines = splitCodeLines(code);

    var startAddrWords = findFreeMemorySpot(memory);
    startAddrWords += FREE_SPACE;

    for (var i = 0; i < codeLines.length; i++) {
        memory[startAddrWords + i] = codeLines[i];
    }

    writeMemory(memory);
}

function splitCodeLines(code) {
    return code.split("\n");
}

//returns the WORD address of the first memory address to be set to ""
function findFreeMemorySpot(memory) {
    for (var i = 0; i < memory.length; i++) {
        if (memory[i] == "")
            return i;
    }

    return -1;
}