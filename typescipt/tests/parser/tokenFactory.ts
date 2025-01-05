import {StringLiteralToken} from "../../src/parser/tokens/stringLiteralToken";
import {TestTokenCharacter} from "./testTokenCharacter";

export class TokenFactory {
  public static string(value: string): StringLiteralToken {
    return new StringLiteralToken(value, TestTokenCharacter.dummy);
  }
}
