import {newParseTokenFinishedResult, newParseTokenInProgressResult, ParseTokenResult} from "./parseTokenResult";
import {ParsableToken} from "./parsableToken";
import {TokenCharacter} from "./tokenCharacter";

export function instanceOfWhitespaceToken(object: any): object is WhitespaceToken {
  return object?.tokenType == 'WhitespaceToken';
}

export function asTableSeparatorToken(object: any): WhitespaceToken | null {
  return instanceOfWhitespaceToken(object) ? object as WhitespaceToken : null;
}

export class WhitespaceToken extends ParsableToken {

  public tokenIsLiteral: boolean = false;
  public tokenType: string = 'WhitespaceToken';
  
  constructor(character: TokenCharacter) {
    super(character);
  }

  public parse(character: TokenCharacter | null) : ParseTokenResult {
    let value = character != null ? character.value.toString() : '';
    return value != ' ' ? newParseTokenFinishedResult(false) : newParseTokenInProgressResult();
  }

  public finalize() : ParseTokenResult {
    return newParseTokenFinishedResult(true);
  }
}

