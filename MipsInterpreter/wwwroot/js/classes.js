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

class LoadWordInstruction {
    constructor(label, opCode, destRegister, sourceRegister, offset, displayValue) {
        this.Label = label;
        this.OpCode = opCode;
        this.DestRegister = destRegister;
        this.SourceRegister = sourceRegister;
        this.Offset = offset;
        this.DisplayValue = displayValue;
    }
}

class StoreWordInstruction {
    constructor(label, opCode, sourceRegister, addressRegister, offset, displayValue) {
        this.Label = label;
        this.OpCode = opCode;
        this.SourceRegister = sourceRegister;
        this.AddressRegister = addressRegister;
        this.Offset = offset;
        this.DisplayValue = displayValue;
    }
}

class BranchEqualityInstruction {
    constructor(label, opCode, registerOne, registerTwo, labelReference, displayValue) {
        this.Label = label;
        this.OpCode = opCode;
        this.RegisterOne = registerOne;
        this.RegisterTwo = registerTwo;
        this.LabelReference = labelReference;
        this.DisplayValue = displayValue;
    }
}

class BranchGreaterThanZeroInstruction {
    constructor(label, opCode, registerOne, labelReference, displayValue) {
        this.Label = label;
        this.OpCode = opCode;
        this.RegisterOne = registerOne;
        this.LabelReference = labelReference;
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

class MoveInstruction {
    constructor(label, opCode, destRegister, sourceRegister, displayValue) {
        this.Label = label;
        this.OpCode = opCode;
        this.DestRegister = destRegister;
        this.SourceRegister = sourceRegister;
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

class LoadAddressInstruction {
    constructor(label, opCode, destRegister, labelReference, displayValue) {
        this.Label = label;
        this.OpCode = opCode;
        this.DestRegister = destRegister;
        this.LabelReference = labelReference;
        this.DisplayValue = displayValue;
    }
}

class Register {
    constructor(displayValue, hasChanged) {
        this.DisplayValue = displayValue;
        this.HasChanged = hasChanged;
    }
}

