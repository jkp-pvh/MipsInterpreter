
function initRegisters() {
    var registers = {};
    registers["zero"] = new Register("", false);
    registers["$at"] = new Register("", false);
    registers["$v0"] = new Register("", false);
    registers["$v1"] = new Register("", false);
    registers["$a0"] = new Register("", false);
    registers["$a1"] = new Register("", false);
    registers["$a2"] = new Register("", false);
    registers["$a3"] = new Register("", false);
    registers["$t0"] = new Register("", false);
    registers["$t1"] = new Register("", false);
    registers["$t2"] = new Register("", false);
    registers["$t3"] = new Register("", false);
    registers["$t4"] = new Register("", false);
    registers["$t5"] = new Register("", false);
    registers["$t6"] = new Register("", false);
    registers["$t7"] = new Register("", false);
    registers["$s0"] = new Register("", false);
    registers["$s1"] = new Register("", false);
    registers["$s2"] = new Register("", false);
    registers["$s3"] = new Register("", false);
    registers["$s4"] = new Register("", false);
    registers["$s5"] = new Register("", false);
    registers["$s6"] = new Register("", false);
    registers["$s7"] = new Register("", false);
    registers["$t8"] = new Register("", false);
    registers["$t9"] = new Register("", false);
    registers["$k0"] = new Register("", false);
    registers["$k1"] = new Register("", false);
    registers["$gp"] = new Register("", false);
    registers["$sp"] = new Register("", false);
    registers["$fp"] = new Register("", false);
    registers["$ra"] = new Register("", false);
    registers["$pc"] = new Register("", false);

    return registers;
}

function initMemory() {
    var memory = [];

    for (var i = 0; i < MEMORY_SIZE; i++) {

        var parsedLine = {
            DisplayValue: ""
        };

        memory.push(parsedLine);
    }

    return memory;
}