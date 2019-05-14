function step(registers, memory, labels) {
    clearRegistersChangedFlag(registers);

    var instrAddress = parseInt(registers["$pc"].DisplayValue);
    var curInstruction = memory[instrAddress];
    var shouldIncrementPC = true;

    if (curInstruction instanceof LoadImmediate) {
        executeLoadImmediate(curInstruction, registers);
    }
    else if (curInstruction instanceof LoadWordInstruction) {
        executeLoadWord(curInstruction, registers, memory);
    }
    else if (curInstruction instanceof StoreWordInstruction) {
        executeStoreWord(curInstruction, registers, memory);
    }
    else if (curInstruction instanceof ArithmeticInstruction) {
        executeArithmeticInstruction(curInstruction, registers);
    }
    else if (curInstruction instanceof JumpInstruction) {
        executeJump(curInstruction, registers, labels);
        shouldIncrementPC = false;
    }
    else if (curInstruction instanceof BranchEqualityInstruction) {
        executeBranchEqualityInstruction(curInstruction, registers, labels);
        shouldIncrementPC = false;
    }
    else if (curInstruction instanceof BranchGreaterThanZeroInstruction) {
        executeBGTZ(curInstruction, registers, labels);
        shouldIncrementPC = false;
    }

    if(shouldIncrementPC){
        registers["$pc"].DisplayValue = (instrAddress + 1).toString();
        registers["$pc"].HasChanged = true;
    }
    

    printRegistersToScreen(registers);
    printMemoryToScreen(memory, 0);
}

function executeBranchEqualityInstruction(instruction, registers, labels) {
    switch (instruction.OpCode) {
        case "beq":
            executeBEQ(instruction, registers, labels);
            break;
    }
}

function executeBEQ(instruction, registers, labels) {
    var registerOneValue = registers[instruction.RegisterOne].DisplayValue;
    var registerTwoValue = registers[instruction.RegisterTwo].DisplayValue;

    var newPCValue = 0;
    if (registerOneValue == registerTwoValue) {
        newPCValue = labels[instruction.LabelReference];
    }
    else {
        var currentPCValue = parseInt(registers["$pc"].DisplayValue);
        newPCValue = currentPCValue + 1;
    }

    registers["$pc"].DisplayValue = newPCValue.toString();
    registers["$pc"].HasChanged = true;
}

function executeBGTZ(instruction, registers, labels) {
    var registerOneValue = parseInt(registers[instruction.RegisterOne].DisplayValue);

    var newPCValue = 0;
    if (registerOneValue > 0) {
        newPCValue = labels[instruction.LabelReference];
    }
    else {
        var currentPCValue = parseInt(registers["$pc"].DisplayValue);
        newPCValue = currentPCValue + 1;
    }

    registers["$pc"].DisplayValue = newPCValue.toString();
    registers["$pc"].HasChanged = true;
}

function executeArithmeticInstruction(instruction, registers) {
    var arithmeticFunc;

    switch(instruction.OpCode){
        case "add":
            arithmeticFunc = function (a, b) { return a + b; };
            break;
        case "sub":
            arithmeticFunc = function (a, b) { return a - b; };
            break;
        case "mult":
            arithmeticFunc = function (a, b) { return a * b; };
            break;
        case "div":
            arithmeticFunc = function (a, b) { return a / b; };
            break;
        case "mod":
            arithmeticFunc = function (a, b) { return a % b; };
            break;
    }

    executeArithmeticInstructionHelper(instruction, registers, arithmeticFunc);
}

function executeJump(instruction, registers, labels){
    var newPCValue = labels[instruction.LabelReference];
    registers["$pc"].DisplayValue = newPCValue.toString();
    registers["$pc"].HasChanged = true;
}

function executeArithmeticInstructionHelper(instruction, registers, arithmeticFunc){
    var sourceValue1 = parseInt(registers[instruction.SourceRegister1].DisplayValue);
    var sourceValue2 = parseInt(registers[instruction.SourceRegister2].DisplayValue);

    var result = arithmeticFunc(sourceValue1, sourceValue2);
    registers[instruction.DestRegister].DisplayValue = result.toString();
    registers[instruction.DestRegister].HasChanged = true;
}

function executeLoadImmediate(instruction, registers){
    registers[instruction.DestRegister].DisplayValue = instruction.ImmediateValue;
    registers[instruction.DestRegister].HasChanged = true;
}

function executeLoadWord(instruction, registers, memory) {
    var sourceRegisterValue = parseInt(registers[instruction.SourceRegister].DisplayValue);
    var addressToLoad = sourceRegisterValue + instruction.Offset;

    registers[instruction.DestRegister].DisplayValue = memory[addressToLoad].DisplayValue;
    registers[instruction.DestRegister].HasChanged = true;
}

function executeStoreWord(instruction, registers, memory) {
    var sourceRegisterValue = parseInt(registers[instruction.SourceRegister].DisplayValue);
    var addressRegisterValue = parseInt(registers[instruction.AddressRegister].DisplayValue);

    var addressToStore = addressRegisterValue + instruction.Offset;

    memory[addressToStore].DisplayValue = sourceRegisterValue
}

function clearRegistersChangedFlag(registers) {
    for (var key in registers) {
        registers[key].HasChanged = false;
    }
}