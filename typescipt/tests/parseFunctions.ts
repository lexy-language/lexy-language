import {RootNodeList} from "../src/language/rootNodeList";
import {LexyParser} from "../src/parser/lexyParser";
import {ParserContext} from "../src/parser/parserContext";
import {Tokenizer} from "../src/parser/tokens/tokenizer";
import {ExpressionFactory} from "../src/language/expressions/expressionFactory";
import {IParserLogger, ParserLogger} from "../src/parser/parserLogger";
import {asTable, Table} from "../src/language/tables/table";
import {asScenario, Scenario} from "../src/language/scenarios/scenario";
import {asEnumDefinition, EnumDefinition} from "../src/language/enums/enumDefinition";
import {RootNode} from "../src/language/rootNode";
import {asFunction, Function} from "../src/language/functions/function";
import {LoggingConfiguration} from "./loggingConfiguration";
import {NodeFileSystem} from "./nodeFileSystem";

export function createParser() {
  const parserLogger = new ParserLogger(LoggingConfiguration.getParserLogger())
  const expressionFactory = new ExpressionFactory();
  const fileSystem = new NodeFileSystem();
  const context = new ParserContext(parserLogger, fileSystem, expressionFactory)
  const tokenizer = new Tokenizer();
  const parser = new LexyParser(context, parserLogger, tokenizer, fileSystem, expressionFactory);
  return {parserLogger, parser};
}

export function parseNodes(code: string): { nodes: RootNodeList, logger: IParserLogger } {
  const {parserLogger, parser} = createParser();
  const codeLines = code.split("\n");
  const result = parser.parse(codeLines, `tests.lexy`, false);

  return {nodes: result.rootNodes, logger: parserLogger};
}

export function parseFunction(code: string): { functionNode: Function, logger: IParserLogger } {
  const {result, logger} = parseNode<Function>(asFunction, code);
  return {functionNode: result, logger};
}

export function parseTable(code: string): { table: Table, logger: IParserLogger } {
  const {result, logger} = parseNode<Table>(asTable, code);
  return {table: result, logger};
}

export function parseScenario(code: string): { scenario: Scenario, logger: IParserLogger } {
  const {result, logger} = parseNode<Scenario>(asScenario, code);
  return {scenario: result, logger};
}

export function parseEnum(code: string): { enumDefinition: EnumDefinition, logger: IParserLogger } {
  const {result, logger} = parseNode<EnumDefinition>(asEnumDefinition, code);
  return {enumDefinition: result, logger};
}

export function parseNode<T extends RootNode>(castFunction: (value: object) => T | null, code: string):
  { result: T, logger: IParserLogger } {

  const {nodes, logger} = parseNodes(code);
  if (nodes.length != 1) throw new Error(`Only 1 node expected. Actual: ` + nodes.length);

  const first = nodes.first();
  const specificType = castFunction(first);
  if (specificType == null) {
    throw new Error(`Node not a ${castFunction.name}. Actual: ${first?.nodeType}`);
  }

  return {result: specificType, logger: logger};
}