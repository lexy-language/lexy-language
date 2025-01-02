import {Token} from "./token";
import {ILiteralToken} from "./ILiteralToken";
import {TokenCharacter} from "./tokenCharacter";
import {TokenValues} from "./tokenValues";
import {VariableReference} from "../../runTime/variableReference";
import {instanceOfTypeWithMembers, ITypeWithMembers} from "../../language/types/iTypeWithMembers";
import {VariableType} from "../../language/types/variableType";
import {IValidationContext} from "../validationContext";

export class MemberAccessLiteral extends Token implements ILiteralToken {

  public get parent(): string {
    return this.parts.length >= 1 ? this.parts[0] : '';
  }

  public get member(): string {
    return this.parts.length >= 2 ? this.parts[1] : '';
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

  public deriveType(context: IValidationContext): VariableType | null {
    let variableReference = new VariableReference(this.parts);
    let variableType = context.variableContext.getVariableType(variableReference, context);
    if (variableType != null) return variableType;

    if (this.parts.length != 2) return null;

    let rootType = context.rootNodes.getType(this.parent);
    if (!instanceOfTypeWithMembers(rootType)) return null;
    const typeWithMembers = rootType as ITypeWithMembers;
    return typeWithMembers.memberType(this.member, context);
  }

  public toString() {
    return this.value;
  }
}