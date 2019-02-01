function step(registers, memory) {
    var instrAddress = registers["$pc"];
    var curInstruction = memory[instrAddress];

    if (curInstruction instanceof LI) {

        registers[curInstruction.DestRegister] = curInstruction.ImmediateValue;
        registers["$pc"] += 1;

        printRegistersToScreen(registers);
    }
}