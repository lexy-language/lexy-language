import {RootNodeList} from "../language/rootNodeList";
import {IParserLogger} from "./parserLogger";

export class ParserResult {
  public readonly rootNodes: RootNodeList;
  public readonly logger: IParserLogger;

   constructor(rootNodes: RootNodeList, logger: IParserLogger) {
     this.rootNodes = rootNodes;
     this.logger = logger;
   }
}
