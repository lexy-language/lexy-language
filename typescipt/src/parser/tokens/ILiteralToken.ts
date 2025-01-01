import {IToken} from "./IToken";
import {IValidationContext} from "./IValidationContext";
import {VariableType} from "../../language/variableTypes";

export interface ILiteralToken extends IToken {

  tokenIsLiteral: boolean;

  typedValue: Object;
  value: string;

  deriveType(context: IValidationContext) : VariableType;
}