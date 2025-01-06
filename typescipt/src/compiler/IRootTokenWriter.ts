import type {IRootNode} from "../language/rootNode";
import {GeneratedType} from "./generatedType";

export interface IRootTokenWriter {
   createCode(generateNode: IRootNode): GeneratedType;
}
