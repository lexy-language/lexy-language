import {VariableType} from "./variableType";
import {ITypeWithMembers} from "./ITypeWithMembers";
import {ComplexTypeMember} from "./complexTypeMember";
import {IValidationContext} from "../../parser/validationContext";
import {ComplexTypeSource} from "./complexTypeSource";
import {VariableTypeName} from "./variableTypeName";

export function instanceOfComplexType(object: any): object is ComplexType {
  return object.variableTypeName == VariableTypeName.ComplexType;
}

export function asComplexType(object: any): ComplexType | null {
  return instanceOfComplexType(object) ? object as ComplexType : null;
}

export class ComplexType extends VariableType implements ITypeWithMembers {

  public variableTypeName = VariableTypeName.ComplexType;
  public typeWithMember: true;
  public name: string;
  public source: ComplexTypeSource;
  public members: Array<ComplexTypeMember>

  constructor(name: string, source: ComplexTypeSource, members: Array<ComplexTypeMember>) {
    super();
    this.name = name;
    this.source = source;
    this.members = members;
  }

  public memberType(name: string, context: IValidationContext): VariableType | null {
    for (let index = 0; index < this.members.length; index++) {
      const member = this.members[index];
      if (member.name == name) {
        return member.type;
      }
    }
    return null;
  }

  protected equals(other: ComplexType): boolean {
    return other != null && this.name == other.name && this.source == other.source;
  }
}
