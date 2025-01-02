import {RootNodeList} from "./rootNodeList";
import {IRootNode} from "./rootNode";

export interface IHasNodeDependencies {
   getDependencies(rootNodeList: RootNodeList): Array<IRootNode>;
}
