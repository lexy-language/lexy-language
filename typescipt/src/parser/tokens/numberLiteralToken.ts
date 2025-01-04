import type {IValidationContext} from "../validationContext";
import type {ILiteralToken} from "./ILiteralToken";

import {ParsableToken} from "./parsableToken";
import {TokenValues} from "./tokenValues";
import {TokenCharacter} from "./tokenCharacter";
import {
  newParseTokenFinishedResult,
  newParseTokenInProgressResult,
  newParseTokenInvalidResult,
  ParseTokenResult
} from "./parseTokenResult";
import {isDigit} from "./character";
import {VariableType} from "../../language/variableTypes/variableType";
import {PrimitiveType} from "../../language/variableTypes/primitiveType";

export function instanceOfNumberLiteralToken(object: any): object is NumberLiteralToken {
  return object?.tokenType == 'NumberLiteralToken';
}

export function asNumberLiteralToken(object: any): NumberLiteralToken | null {
  return instanceOfNumberLiteralToken(object) ? object as NumberLiteralToken : null;
}

export class NumberLiteralToken extends ParsableToken implements ILiteralToken {

  private allowedNextTokensValues = [
    TokenValues.TableSeparator,
    TokenValues.Space,
    TokenValues.Assignment,

    TokenValues.Addition,
    TokenValues.Subtraction,
    TokenValues.Multiplication,
    TokenValues.Division,
    TokenValues.Modulus,
    TokenValues.CloseParentheses,
    TokenValues.CloseBrackets,
    TokenValues.GreaterThan,
    TokenValues.LessThan,
    TokenValues.ArgumentSeparator
  ];

  private hasDecimalSeparator: boolean = false;
  private numberValueValue: number | null;

  public tokenIsLiteral: boolean = true;
  public tokenType: string = 'NumberLiteralToken';

  public get numberValue(): number {
    if (this.numberValueValue == null) throw new Error("NumberLiteralToken not finalized.");
    return this.numberValueValue;
  }

  constructor(value: number | null, character: TokenCharacter) {
    super(character);
    this.numberValueValue = value;
  }

  public get value() {
    return this.numberValue != null
      ? this.numberValue.toString()
      : super.value;
  }

  public get typedValue() {
    return this.numberValue;
  }

  public deriveType(context: IValidationContext): VariableType | null {
    return PrimitiveType.number;
  }

  public parse(character: TokenCharacter): ParseTokenResult {
    let value = character.value;
    if (isDigit(value)) {
      this.appendValue(value);
      return newParseTokenInProgressResult();
    }

    if (value == TokenValues.DecimalSeparator) {
      if (this.hasDecimalSeparator) {
        return {state: 'invalid', validationError: "Only one decimal separator expected"};
      }

      this.hasDecimalSeparator = true;
      this.appendValue(value);
      return newParseTokenInProgressResult();
    }

    return this.allowedNextTokensValues.findIndex(allowed => allowed == value) >= 0
      ? this.finalize()
      : newParseTokenInvalidResult(`Invalid number token character: '${String.fromCharCode(value)}'`);
  }

  public finalize(): ParseTokenResult {
    this.numberValueValue = parseFloat(super.value);
    return newParseTokenFinishedResult(false);
  }

  public isDecimal(): boolean {
    return this.numberValue != null && this.numberValue % 1 != 0;
  }

  public toString(): string {
    return this.value;
  }
}