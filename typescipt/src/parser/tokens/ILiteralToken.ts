import {IToken} from "./Token";
import {VariableType} from "../../language/variableTypes/variableType";

import type {IValidationContext} from "../validationContext";

export interface ILiteralToken extends IToken {

  tokenIsLiteral: boolean;

  typedValue: Object;
  value: string;

  deriveType(context: IValidationContext) : VariableType | null;
}