import {IParserLogger} from "./IParserLogger";
import {Line} from "./line";
import {TokenList} from "./tokens/tokenList";
import {BooleanLiteral} from "./tokens/BooleanLiteral";
import {DateTimeLiteral} from "./tokens/DateTimeLiteral";
import {KeywordToken} from "./tokens/KeywordToken";
import {MemberAccessLiteral} from "./tokens/MemberAccessLiteral";
import {QuotedLiteralToken} from "./tokens/QuotedLiteralToken";
import {StringLiteralToken} from "./tokens/StringLiteralToken";
import {OperatorType} from "./tokens/operatorType";
import {ILiteralToken} from "./tokens/ILiteralToken";
import {Token} from "./tokens/token";
import {OperatorToken} from "./tokens/operatorToken";
import {NumberLiteralToken} from "./tokens/numberLiteralToken";
import {CommentToken} from "./tokens/commentToken";

export class TokenValidator {

  private readonly logger: IParserLogger;
  private readonly line: Line;
  private readonly parserName: string;
  private readonly tokens: TokenList;

  private errorsExpected: boolean = false;

  public isValid: boolean

  constructor(parserName: string, line: Line, logger: IParserLogger) {
    if (line.tokens == null) throw new Error("line and line.tokens should not be null.")

    this.parserName = parserName;
    this.logger = logger;

    this.line = line;
    this.tokens = line.tokens;

    this.isValid = true;
  }

  public count(count: number): TokenValidator {
    if (this.tokens.length != count) {
      fail(`Invalid number of tokens '${this.tokens.length}', should be '${this.count}'.`);
      this.isValid = false;
    }

    return this;
  }

  public countMinimum(count: number): TokenValidator {
    if (this.tokens.length < count) {
      this.fail(`Invalid number of tokens '${this.tokens.length}', should be at least '${this.count}'.`);
      this.isValid = false;
    }

    return this;
  }

  public keyword(index: number, keyword: string | null = null): TokenValidator {
    this.type(index, KeywordToken);
    if (keyword != null) this.value(index, keyword);
    return this;
  }

  public stringLiteral(index: number, value: string | null = null): TokenValidator {
    this.type(index, StringLiteralToken);
    if (value != null) this.value(index, value);
    return this;
  }

  public operator(index: number, operatorType: OperatorType): TokenValidator {
    if (!this.checkValidTokenIndex(index)) return this;

    this.type(index, OperatorToken);
    const token = this.tokens.get(index) as OperatorToken;
    if (token?.type != operatorType) {
      this.fail(`Invalid operator token {index} value. Expected: '${operatorType}' Actual: '${token?.type}'`);
      this.isValid = false;
    }

    return this;
  }

  public memberAccess(index: number, value: string | null): TokenValidator {
    this.type(index, MemberAccessLiteral);
    if (value != null) this.value(index, value);
    return this;
  }

  public comment(index: number): TokenValidator {
    this.type(index, CommentToken);
    return this;
  }

  public quotedString(index: number, literal: string | null = null): TokenValidator {
    const token = this.validateType<QuotedLiteralToken>(index, QuotedLiteralToken);
    if (token != null && token.value != literal) {
      this.fail(`Invalid token ${index} value. Expected: '${literal}' Actual: '${token?.value}'`);
      this.isValid = false;
    }
    return this;
  }

  public numberLiteral(index: number, value: number | null = null): TokenValidator {
    let token = this.validateType<NumberLiteralToken>(index, NumberLiteralToken);
    if (token != null && value != null && token.numberValue != value) {
      this.fail(`Invalid token ${index} value. Expected: '${value}' Actual: '${token.value}'`);
      this.isValid = false;
    }

    return this;
  }

  public boolean(index: number, value: boolean): TokenValidator {
    const token = this.validateType<BooleanLiteral>(index, BooleanLiteral);
    if (token != null && token.booleanValue != value) {
      this.fail(`Invalid token ${index} value. Expected: '${value}' Actual: '${token.value}'`);
      this.isValid = false;
    }

    return this;
  }

  public dateTime(index: number, year: number, month: number, day: number, hours: number, minutes: number, seconds: number): TokenValidator {
    let token = this.validateType<DateTimeLiteral>(index, DateTimeLiteral);
    let expected = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    if (token != null && token.dateTimeValue != null && token.dateTimeValue.getTime() != expected.getTime()) {
      this.fail(`Invalid token value at ${index}. Expected: '${expected.toISOString()}' Actual: '${token.dateTimeValue.toISOString()}'`);
      this.isValid = false;
    }

    return this;
  }

  //todo this will not work with minification
  public type<T extends Token>(index: number, constr: Function) {
    this.validateType<T>(index, constr);
    return this;
  }

  public isLiteralToken(index: number): TokenValidator {
    if (!this.checkValidTokenIndex(index)) return this;

    let token = this.tokens.get(index);
    let literalToken = token.tokenIsLiteral ? token as unknown as ILiteralToken : null;
    if (literalToken == null) {
      this.fail(`Invalid token type as ${index}. Expected: 'ILiteralToken' Actual: '${this.tokens.get(index)?.tokenType}'`);
      this.isValid = false;

      return this;
    }
    return this;
  }

  private validateType<T>(index: number, constr: Function): T | null {
    if (!this.checkValidTokenIndex(index)) return null;

    let token = this.tokens.get(index);
    if (token.tokenType != constr.name) {
      this.fail(`Invalid token ${index} type. Expected: '${constr.name}' Actual: '${this.type.name}(${token.value})'`);
      this.isValid = false;

      return null;
    }

    return token as T;
  }

  public value(index: number, expectedValue: string): TokenValidator {
    if (!this.checkValidTokenIndex(index)) return this;

    const token = this.tokens.get(index);
    if (token.value != expectedValue) {
      this.fail(`Invalid token value as ${index}. Expected: '${expectedValue}' Actual: '${token.value}'`);
      this.isValid = false;
    }

    return this;
  }

  private checkValidTokenIndex(index: number): boolean {
    if (index < this.tokens.length) return true;

    this.fail(`Token expected at '${index}' but not found. Length: '${this.tokens.length}'`);
    this.isValid = false;

    return false;
  }

  private fail(error: string) {
    this.logger.fail(this.line.lineStartReference(), `(${this.parserName}) ${error}`);
  }

  public assert() {
    if (!this.errorsExpected && this.logger.hasErrors()) {
      throw new Error(this.logger.formatMessages());
    }

    if (!this.isValid) throw new Error(this.logger.formatMessages());
  }
}