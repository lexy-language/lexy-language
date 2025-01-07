import {VariableReference} from "../language/variableReference";
import {IExecutionContext} from "../runTime/executionContext";
import {FunctionResult} from "../runTime/functionResult";

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