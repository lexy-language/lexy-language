import {IToken} from "./Token";
import {IValidationContext} from "../validationContext";
import {VariableType} from "../../language/types/variableType";

export interface ILiteralToken extends IToken {

  tokenIsLiteral: boolean;

  typedValue: Object;
  value: string;

  deriveType(context: IValidationContext) : VariableType | null;
}