import {Token} from "./token";
import {ILiteralToken} from "./ILiteralToken";
import {TokenCharacter} from "./tokenCharacter";
import {TokenValues} from "./tokenValues";
import {IValidationContext} from "../IValidationContext";
import {VariableType} from "../../language/variableTypes";

export class MemberAccessLiteral extends Token implements ILiteralToken {

  public get parent() {
    return this.parts.length >= 1 ? this.parts[0] : null;
  }

  public get member() {
    return this.parts.length >= 2 ? this.parts[1] : null;
  }

  public readonly parts: string[];

  public tokenIsLiteral: boolean = true;
  public tokenType: string = 'MemberAccessLiteral';

  constructor(value: string, character: TokenCharacter) {
    super(character);
    this.value = value;
    this.parts = value.split(TokenValues.MemberAccessString);
  }

  public value: string;

  public get typedValue() {
    return this.value;
  }

  public deriveType(context: IValidationContext): VariableType {
    /* let variableReference = new VariableReference(Parts);
    let variableType = context.variableContext.getVariableType(variableReference, context);
    if (variableType != null) return variableType;

    if (this.parts.length != 2) return null;

    let rootType = context.RootNodes.GetType(Parent);
    return rootType is not ITypeWithMembers typeWithMembers ? null : typeWithMembers.MemberType(Member, context);*/
    throw Error("Not implemented.")
  }

  public toString() {
    return this.value;
  }
}