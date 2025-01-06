import type {IRootNode} from "../rootNode";
import type {IValidationContext} from "../../parser/validationContext";

import {TypeWithMembers} from "./typeWithMembers";
import {TypeDefinition} from "../types/typeDefinition";
import {TableType} from "./tableType";
import {VariableType} from "./variableType";
import {firstOrDefault} from "../../infrastructure/enumerableExtensions";
import {RootNodeList} from "../rootNodeList";
import {VariableTypeName} from "./variableTypeName";

export function instanceOfCustomType(object: any): object is CustomType {
  return object?.variableTypeName == VariableTypeName.CustomType;
}

export function asCustomType(object: any): CustomType | null {
  return instanceOfCustomType(object) ? object as CustomType : null;
}

export class CustomType extends TypeWithMembers {

  public readonly variableTypeName = VariableTypeName.CustomType;
  public type: string;
  public typeDefinition: TypeDefinition;

  constructor(type: string, typeDefinition: TypeDefinition) {
    super();
    this.type = type;
    this.typeDefinition = typeDefinition;
  }

  protected equals(other: TableType): boolean {
    return this.type == other?.type;
  }

  public toString(): string {
    return this.type;
  }

  public override memberType(name: string, context: IValidationContext): VariableType | null {
    const definition = firstOrDefault(this.typeDefinition.variables, variable => variable.name == name);
    const variableType = definition?.type.createVariableType(context);
    return variableType ? variableType : null;
  }

  public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
    return [this.typeDefinition];
  }
}
