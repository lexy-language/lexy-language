import {VariableReference} from "../language/variableReference";

export class FunctionResult {
  private readonly valueObject: { [key: string]: any };

  constructor(valueObject: any) {
    this.valueObject = valueObject;
  }

  public number(name: string): number {
    const value = this.valueObject[name];
    return value as number;
  }

  public getValue(expectedVariable: VariableReference): any {
    let currentReference = expectedVariable;
    let currentValue = this.valueObject[expectedVariable.parentIdentifier];
    while (currentReference.hasChildIdentifiers) {
      currentReference = currentReference.childrenReference();
      currentValue = this.valueObject[currentReference.parentIdentifier];
    }

    return currentValue;
  }
}