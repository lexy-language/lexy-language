import {Token} from "./token";
import {TokenCharacter} from "./tokenCharacter";
import {TokenType} from "./tokenType";

export function instanceOfKeywordToken(object: any): boolean {
  return object?.tokenType == TokenType.KeywordToken;
}

export function asKeywordToken(object: any): KeywordToken | null {
  return instanceOfKeywordToken(object) ? object as KeywordToken : null;
}

export class KeywordToken extends Token {

  public tokenIsLiteral: boolean = true;
  public tokenType = TokenType.KeywordToken;

  public value: string

  constructor(keyword: string, character: TokenCharacter) {
    super(character);
    this.value = keyword;
  }
}