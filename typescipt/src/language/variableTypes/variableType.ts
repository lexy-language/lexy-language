import type {IRootNode} from "../rootNode";

import {RootNodeList} from "../rootNodeList";
import {VariableTypeName} from "./variableTypeName";

export abstract class VariableType {

  public abstract readonly variableTypeName: VariableTypeName;
  public abstract equals(other: VariableType | null): boolean;

  public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
    return [];
  }
}
