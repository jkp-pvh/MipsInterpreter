class LI {
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

