import type {IRootNode} from "../rootNode";

import {RootNodeList} from "../rootNodeList";

export abstract class VariableType {

  public abstract readonly variableTypeName: string;
  public abstract equals(other: VariableType | null): boolean;

  public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
    return [];
  }
}
