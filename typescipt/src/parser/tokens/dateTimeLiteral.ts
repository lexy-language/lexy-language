import {ParsableToken} from "./parsableToken";
import {ILiteralToken} from "./ILiteralToken";
import {
  newParseTokenFinishedResult,
  newParseTokenInProgressResult,
  newParseTokenInvalidResult,
  ParseTokenResult
} from "./parseTokenResult";
import {TokenCharacter} from "./tokenCharacter";
import {TokenValues} from "./tokenValues";
import {formatLine} from "../../formatting/formatLine";
import {Character, isDigit} from "./character";
import {IValidationContext} from "../validationContext";
import {VariableType} from "../../language/variableTypes/variableType";
import {PrimitiveType} from "../../language/variableTypes/primitiveType";
import {TokenType} from "./tokenType";

export function instanceOfDateTimeLiteral(object: any): boolean {
  return object?.tokenType == TokenType.DateTimeLiteral;
}

export function asDateTimeLiteral(object: any): DateTimeLiteral | null {
  return instanceOfDateTimeLiteral(object) ? object as DateTimeLiteral : null;
}

export class DateTimeLiteral extends ParsableToken implements ILiteralToken {

  //format d"0123/56/89 12:45:78"
  private static readonly DigitIndexes = [0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18];
  private static readonly DashIndexes = [4, 7];
  private static readonly TIndexes = [10];
  private static readonly ColonIndexes = [13, 16];
  private static readonly ValidLengths = [19];
  private readonly validators: ((character: Character) => ParseTokenResult | null)[];

  private index: number = 0;

  public dateTimeValue: Date | null = null;

  public tokenIsLiteral: boolean = true;
  public tokenType = TokenType.DateTimeLiteral;

  constructor(character: TokenCharacter) {
    super(character, '');
    this.validators = [
      value => this.validate(value, isDigit(value), DateTimeLiteral.DigitIndexes),
      value => this.validateExact(value, TokenValues.Dash, DateTimeLiteral.DashIndexes),
      value => this.validateExact(value, TokenValues.Colon, DateTimeLiteral.ColonIndexes),
      value => this.validateExact(value, 'T'.charCodeAt(0), DateTimeLiteral.TIndexes)
    ];
  }

  public get typedValue() {
    return this.dateTimeValue as object;
  }

  public deriveType(context: IValidationContext): VariableType {
    return PrimitiveType.date;
  }

  public parse(character: TokenCharacter): ParseTokenResult {
    let value = character.value;
    if (value == TokenValues.Quote) {
      if (DateTimeLiteral.ValidLengths.findIndex(item => item == this.value.length) < 0) {
        return newParseTokenInvalidResult(
          `Invalid date time format length '${this.value.length}'. 
          Expected: '${formatLine(DateTimeLiteral.ValidLengths, ',')}'`);
      }

      this.parseValue();
      return newParseTokenFinishedResult(true);
    }

    for (let index = 0; index < this.validators.length; index++) {
      let validator = this.validators[index];
      let result = validator(value);
      if (result != null) {
        this.appendValue(value);
        this.index++;
        return result;
      }
    }

    return newParseTokenInvalidResult(`Unexpected character: '${String.fromCharCode(value)}'. Format: d""2024-12-18T14:17:30""`);
  }

  private parseValue() {
    this.dateTimeValue = new Date(this.value);
  }

  private validateExact(value: number, match: number, indexes: number[]): ParseTokenResult | null {
    return this.validate(value, value == match, indexes);
  }

  private validate(value: number, match: boolean, indexes: number[]): ParseTokenResult | null {
    if (!match) return null;

    if (indexes.findIndex(where => where == this.index) < 0) {
      return newParseTokenInvalidResult(`Unexpected character: '${String.fromCharCode(value)}'. Format: d"2024-12-18T14:17:30"`);
    }

    return newParseTokenInProgressResult();
  }

  public finalize(): ParseTokenResult {
    return newParseTokenInvalidResult(
      'Unexpected end of line. Closing quote expected. Format: d"2024-12-18T14:17:30"');
  }

  public toString() {
    return this.dateTimeValue != null ? this.dateTimeValue.toISOString() : '';
  }
}