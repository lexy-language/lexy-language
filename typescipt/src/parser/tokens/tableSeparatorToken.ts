import {ParsableToken} from "./parsableToken";
import {TokenCharacter} from "./tokenCharacter";
import {newParseTokenFinishedResult, ParseTokenResult} from "./parseTokenResult";
import {TokenType} from "./tokenType";

export function instanceOfTableSeparatorToken(object: any): object is TableSeparatorToken {
  return object?.tokenType == TokenType.TableSeparatorToken;
}

export function asTableSeparatorToken(object: any): TableSeparatorToken | null {
  return instanceOfTableSeparatorToken(object) ? object as TableSeparatorToken : null;
}

export class TableSeparatorToken extends ParsableToken {

  public tokenIsLiteral: boolean = false;
  public tokenType = TokenType.TableSeparatorToken;

  constructor(character: TokenCharacter) {
    super(character);
  }

  public parse(character: TokenCharacter): ParseTokenResult {
    return newParseTokenFinishedResult(true);
  }

  public finalize(): ParseTokenResult {
    return newParseTokenFinishedResult(true);
  }
}