import {ParseTokenResult} from "./parseTokenResult";
import {Character} from "./tokens";
import {TokenCharacter} from "./tokenCharacter";
import {Token} from "./token";

export abstract class ParsableToken extends Token {

  private valueBuilder: Array<string>;

  public get value(): string {
    return this.valueBuilder.join('');
  }

  protected constructor(character: TokenCharacter, value: string | null = null) {
    super(character);
    this.valueBuilder = [value != null ? value : String.fromCharCode(character.value)];
  }

  protected appendValue(value: Character): void {
    this.valueBuilder.push(String.fromCharCode(value));
  }

  public abstract parse(character: TokenCharacter): ParseTokenResult;

  public abstract finalize(): ParseTokenResult;
}