import {LoggingConfiguration} from "../loggingConfiguration";
import {createParser} from "../parseFunctions";
import {LexyCompiler} from "../../src/compiler/lexyCompiler";
import {NodeFileSystem} from "../nodeFileSystem";
import {SpecificationsRunner} from "../../src/specifications/specificationsRunner";

export function createRunner() {
  const mainLogger = LoggingConfiguration.getMainLogger();
  const {parser} = createParser();
  const compiler = new LexyCompiler(LoggingConfiguration.getCompilerLogger(), LoggingConfiguration.getExecutionLogger());
  const nodeFileSystem = new NodeFileSystem();

  return new SpecificationsRunner(mainLogger, nodeFileSystem, parser, compiler);
}