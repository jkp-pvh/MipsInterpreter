function step(registers, memory, labels) {
    clearRegistersChangedFlag(registers);

    var instrAddress = parseInt(registers["$pc"].DisplayValue);
    var curInstruction = memory[instrAddress];
    var shouldIncrementPC = true;

    if (curInstruction instanceof LoadImmediate) {
        executeLoadImmediate(curInstruction, registers);    
    }
    else if(curInstruction instanceof ArithmeticInstruction){
        executeArithmeticInstruction(curInstruction, registers);
    }
    else if(curInstruction instanceof JumpInstruction){
        executeJump(curInstruction, registers, labels);
        shouldIncrementPC = false;
    }

    if(shouldIncrementPC){
        registers["$pc"].DisplayValue = (instrAddress + 1).toString();
        registers["$pc"].HasChanged = true;
    }
    

    printRegistersToScreen(registers);
}

function executeArithmeticInstruction(instruction, registers){
    switch(instruction.OpCode){
        case "add":
            executeAdd(instruction, registers);
            break;
    }
}

function executeJump(instruction, registers, labels){
    var newPCValue = labels[instruction.LabelReference];
    registers["$pc"].DisplayValue = newPCValue.toString();
    registers["$pc"].HasChanged = true;
}

function executeAdd(instruction, registers){
    var sourceValue1 = parseInt(registers[instruction.SourceRegister1].DisplayValue);
    var sourceValue2 = parseInt(registers[instruction.SourceRegister2].DisplayValue);

    registers[instruction.DestRegister].DisplayValue = (sourceValue1 + sourceValue2).toString();
    registers[instruction.DestRegister].HasChanged = true;
}

function executeLoadImmediate(instruction, registers){
    registers[instruction.DestRegister].DisplayValue = instruction.ImmediateValue;
    registers[instruction.DestRegister].HasChanged = true;
}

function clearRegistersChangedFlag(registers) {
    for (var key in registers) {
        registers[key].HasChanged = false;
    }
}