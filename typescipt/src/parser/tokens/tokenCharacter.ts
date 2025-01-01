import {Character} from "./tokens";

export class TokenCharacter {
  public position: number = 0;
  public value: Character;

  constructor(value: number, position: number) {
    this.value = value;
    this.position = position;
  }

  public toString() {
    return String.fromCharCode(this.value);
  }
}