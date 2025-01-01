import {IToken} from "./IToken";
import {TokenCharacter} from "./tokenCharacter";

export abstract class Token implements IToken {

  abstract tokenIsLiteral: boolean;
  abstract tokenType: string;
  abstract value: string;

  public firstCharacter: TokenCharacter;

  protected constructor(firstCharacter: TokenCharacter) {
    this.firstCharacter = firstCharacter;
  }
}