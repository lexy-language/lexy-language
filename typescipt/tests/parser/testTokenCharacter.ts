import {TokenCharacter} from "../../src/parser/tokens/tokenCharacter";

export class TestTokenCharacter {
  public static dummy: TokenCharacter = new TokenCharacter("a".charCodeAt(0), 0);
}
