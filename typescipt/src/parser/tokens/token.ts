import {TokenCharacter} from "./tokenCharacter";
import {TokenType} from "./tokenType";

export function instanceOfToken(object: any): object is Token {
  return !!object?.tokenType;
}

export function asToken(object: any): Token | null {
  return instanceOfToken(object) ? object as Token : null;
}

export interface IToken {
  tokenType: string;
  tokenIsLiteral: boolean;
  firstCharacter: TokenCharacter;
}

export abstract class Token implements IToken {

  abstract tokenIsLiteral: boolean;
  abstract tokenType: TokenType;
  abstract value: string;

  public firstCharacter: TokenCharacter;

  protected constructor(firstCharacter: TokenCharacter) {
    this.firstCharacter = firstCharacter;
  }
}