import {Token} from "./token";
import {ILiteralToken} from "./ILiteralToken";
import {TokenCharacter} from "./tokenCharacter";
import {TokenValues} from "./tokenValues";
import {IValidationContext} from "../validationContext";
import {VariableType} from "../../language/variableTypes/variableType";
import {PrimitiveType} from "../../language/variableTypes/primitiveType";
import {TokenType} from "./tokenType";

export function instanceOfBooleanLiteral(object: any): boolean {
  return object?.tokenType == TokenType.BooleanLiteral;
}

export function asBooleanLiteral(object: any): BooleanLiteral | null {
  return instanceOfBooleanLiteral(object) ? object as BooleanLiteral : null;
}

export class BooleanLiteral extends Token implements ILiteralToken {
  public booleanValue: boolean;

  public tokenIsLiteral: boolean = true;
  public tokenType = TokenType.BooleanLiteral;

  constructor(value: boolean, character: TokenCharacter) {
    super(character);
    this.booleanValue = value;
  }

  public get typedValue() {
    return this.booleanValue;
  }

  public get value() {
    return this.booleanValue ? TokenValues.BooleanTrue : TokenValues.BooleanFalse;
  }

  public deriveType(context: IValidationContext): VariableType {
    return PrimitiveType.boolean;
  }

  public static parse(value: string, character: TokenCharacter): BooleanLiteral {
    switch (value) {
      case TokenValues.BooleanTrue:
        return new BooleanLiteral(true, character);
      case TokenValues.BooleanFalse:
        return new BooleanLiteral(false, character);
      default:
        throw new Error(`Couldn't parse boolean: ${value}`)
    }
  }

  public static isValid(value: string): boolean {
    return value == TokenValues.BooleanTrue || value == TokenValues.BooleanFalse;
  }

  public toString(): string {
    return this.value;
  }
}