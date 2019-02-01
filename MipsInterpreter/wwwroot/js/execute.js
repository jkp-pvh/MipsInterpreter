function step(registers, memory) {
    clearRegistersChangedFlag(registers);

    var instrAddress = parseInt(registers["$pc"].DisplayValue);
    var curInstruction = memory[instrAddress];

    if (curInstruction instanceof LI) {

        registers[curInstruction.DestRegister].DisplayValue = curInstruction.ImmediateValue;
        registers[curInstruction.DestRegister].HasChanged = true;

        registers["$pc"].DisplayValue = (instrAddress + 1).toString();
        registers["$pc"].HasChanged = true;

        printRegistersToScreen(registers);
    }
}

function clearRegistersChangedFlag(registers) {
    for (var key in registers) {
        registers[key].HasChanged = false;
    }
}