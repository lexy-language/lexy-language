import {ParsableToken} from "./parsableToken";
import {TokenValues} from "./tokenValues";
import {TokenCharacter} from "./tokenCharacter";
import {
  newParseTokenFinishedResult,
  newParseTokenInProgressResult,
  newParseTokenInvalidResult,
  ParseTokenResult
} from "./parseTokenResult";
import {DateTimeLiteral} from "./dateTimeLiteral";
import {KeywordToken} from "./keywordToken";
import {MemberAccessLiteral} from "./memberAccessLiteral";
import {StringLiteralToken} from "./stringLiteralToken";
import {BooleanLiteral} from "./booleanLiteral";
import {Token} from "./token";
import {Keywords} from "../Keywords";
import {isDigitOrLetter} from "./character";
import {TokenType} from "./tokenType";

const point = '.'.charCodeAt(0);
const colon = ':'.charCodeAt(0);

export class BuildLiteralToken extends ParsableToken {

  private static terminatorValues = [
    TokenValues.Space,
    TokenValues.OpenParentheses,
    TokenValues.OpenBrackets,
    TokenValues.CloseParentheses,
    TokenValues.CloseBrackets,
    TokenValues.ArgumentSeparator
  ];

  public tokenIsLiteral: boolean = false;
  public tokenType = TokenType.BuildLiteralToken;

  private hasMemberAccessor: boolean = false;
  private lastMemberAccessor: boolean = false;

  constructor(character: TokenCharacter) {
    super(character);
  }

  public parse(character: TokenCharacter): ParseTokenResult {
    let value = character.value;

    if (BuildLiteralToken.terminatorValues.findIndex(terminator => terminator == value) >= 0) {
      return newParseTokenFinishedResult(false, this.sealLiteral());
    }

    if (value == point) {
      if (this.lastMemberAccessor) {
        return newParseTokenInvalidResult(
          `Unexpected character: '${String.fromCharCode(value)}'. Member accessor should be followed by member name.`);
      }

      this.hasMemberAccessor = true;
      this.lastMemberAccessor = true;
      this.appendValue(value);

      return newParseTokenInProgressResult();
    }

    if (isDigitOrLetter(value) || value == colon) {
      this.lastMemberAccessor = false;

      this.appendValue(value);
      return newParseTokenInProgressResult();
    }

    if (value == TokenValues.Quote && this.value == TokenValues.DateTimeStarter)
      return newParseTokenInProgressResult(new DateTimeLiteral(this.firstCharacter));

    return newParseTokenInvalidResult(`Unexpected character: '${String.fromCharCode(value)}'`);
  }

  public finalize(): ParseTokenResult {
    if (this.lastMemberAccessor)
      return newParseTokenInvalidResult(
        "Unexpected end of line. Member accessor should be followed by member name.");

    return newParseTokenFinishedResult(true, this.sealLiteral());
  }

  private sealLiteral(): Token {
    let value = this.value;
    if (Keywords.contains(value)) return new KeywordToken(value, this.firstCharacter);
    if (BooleanLiteral.isValid(value)) return BooleanLiteral.parse(value, this.firstCharacter);

    if (this.hasMemberAccessor) return new MemberAccessLiteral(value, this.firstCharacter);

    return new StringLiteralToken(value, this.firstCharacter);
  }
}