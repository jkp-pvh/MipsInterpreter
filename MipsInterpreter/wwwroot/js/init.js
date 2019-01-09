
function initRegisters() {
    var registers = {};
    registers["zero"] = "";
    registers["$at"] = "";
    registers["$v0"] = "";
    registers["$v1"] = "";
    registers["$a0"] = "";
    registers["$a1"] = "";
    registers["$a2"] = "";
    registers["$a3"] = "";
    registers["$t0"] = "";
    registers["$t1"] = "";
    registers["$t2"] = "";
    registers["$t3"] = "";
    registers["$t4"] = "";
    registers["$t5"] = "";
    registers["$t6"] = "";
    registers["$t7"] = "";
    registers["$s0"] = "";
    registers["$s1"] = "";
    registers["$s2"] = "";
    registers["$s3"] = "";
    registers["$s4"] = "";
    registers["$s5"] = "";
    registers["$s6"] = "";
    registers["$s7"] = "";
    registers["$t8"] = "";
    registers["$t9"] = "";
    registers["$k0"] = "";
    registers["$k1"] = "";
    registers["$gp"] = "";
    registers["$sp"] = "";
    registers["$fp"] = "";
    registers["$ra"] = "";
    registers["$pc"] = "";

    return registers;
}

function initMemory() {
    var memory = {};
    for (var i = 0; i < MEMORY_SIZE; i++) {
        memory[i] = "";
    }

    return memory;
}