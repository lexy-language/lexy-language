import type {IRootNode} from "../language/rootNode";
import {ExecutableFunction} from "./executableFunction";

export enum GeneratedTypeKind {
  function,
  enum,
  type,
  table
}

export class GeneratedType {
  public readonly kind: GeneratedTypeKind;
  public readonly node: IRootNode;
  public readonly name: string;
  public readonly initializationFunction: string;
  public readonly executableFunction: ExecutableFunction | null;

  constructor(kind: GeneratedTypeKind, node: IRootNode, name: string, initializationFunction: string, executableFunction: ExecutableFunction | null = null) {
    this.kind = kind;
    this.node = node;
    this.name = name;
    this.initializationFunction = initializationFunction;
    this.executableFunction = executableFunction;
  }
}
