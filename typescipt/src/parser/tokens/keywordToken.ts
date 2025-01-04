import {Token} from "./token";
import {TokenCharacter} from "./tokenCharacter";

export function instanceOfKeywordToken(object: any): boolean {
  return object?.tokenType == "KeywordToken";
}

export function asKeywordToken(object: any): KeywordToken | null {
  return instanceOfKeywordToken(object) ? object as KeywordToken : null;
}

export class KeywordToken extends Token {

  public tokenIsLiteral: boolean = true;
  public tokenType: string = 'KeywordToken';

  public value: string

  constructor(keyword: string, character: TokenCharacter) {
    super(character);
    this.value = keyword;
  }
}