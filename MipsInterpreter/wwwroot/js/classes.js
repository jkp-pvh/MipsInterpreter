class ArithmeticInstruction{
    constructor(label, opCode, destRegister, sourceRegister1, sourceRegister2, displayValue){
        this.Label = label;
        this.OpCode = opCode;
        this.DestRegister = destRegister;
        this.SourceRegister1 = sourceRegister1;
        this.SourceRegister2 = sourceRegister2;
        this.DisplayValue = displayValue;
    }
}

class JumpInstruction{
    constructor(label, opCode, labelReference, displayValue){
        this.Label = label;
        this.OpCode = opCode;
        this.LabelReference = labelReference;
        this.DisplayValue = displayValue;
    }
}

class LoadImmediate { //todo: rename to LoadImmediateInstruction
    constructor(label, opCode, destRegister, immediateValue, displayValue) {
        this.Label = label;
        this.OpCode = opCode;
        this.DestRegister = destRegister;
        this.ImmediateValue = immediateValue;
        this.DisplayValue = displayValue;
        
    }
}

class Register {
    constructor(displayValue, hasChanged) {
        this.DisplayValue = displayValue;
        this.HasChanged = hasChanged;
    }
}

