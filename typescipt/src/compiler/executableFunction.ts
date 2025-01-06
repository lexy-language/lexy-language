import {VariableReference} from "../language/variableReference";
import {IExecutionContext} from "../runTime/executionContext";

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

export class ExecutableFunction {
  private functionReference: Function;

  constructor(functionReference: Function) {
    this.functionReference = functionReference;
  }

  public run(executionContext: IExecutionContext, values: { [key: string]: any } | null = null): FunctionResult {
    let parameters = this.getParameters(values);
    let results = this.functionReference(parameters);
    return new FunctionResult(results);
  }

  private getParameters(values: { [p: string]: any } | null) {
    let parameters = {};

    if (values == null) return parameters;

    for (const key in values) {
      const value = values[key];
      let field = this.getParameterSetter(parameters, key);
      //let convertedValue = this.changeType(value, field.fieldType); // todo very variable type
      field(value);
    }
    return parameters;
  }

  private getParameterSetter(parameters: any, key: string): ((value: any) => void) {
    let currentReference = VariableReference.parse(key);
    let currentValue = parameters;
    while (currentReference.hasChildIdentifiers) {
      currentValue = parameters[currentReference.parentIdentifier];
      currentReference = currentReference.childrenReference();
    }

    return (value: any) => currentValue[currentReference.parentIdentifier] = value;
  }
}