import {DependencyGraphFactory} from "../../src/dependencyGraph/dependencyGraphFactory";
import {parseNodes} from "../parseFunctions";
import {Dependencies} from "../../src/dependencyGraph/dependencies";

export function buildDependencyGraph(code: string , throwException:boolean = true): Dependencies {
  let {nodes, logger} = parseNodes(code);
  if (throwException) logger.assertNoErrors();
  return DependencyGraphFactory.create(nodes);
}
