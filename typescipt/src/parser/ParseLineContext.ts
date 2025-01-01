import {Line} from "./line";
import {TokenValidator} from "./TokenValidator";
import {IParserLogger} from "./IParserLogger";

export interface IParseLineContext {
  line: Line;
  logger: IParserLogger

  validateTokens(name: string): TokenValidator
}

export class ParseLineContext implements IParseLineContext {

  public readonly line: Line;
  public readonly logger: IParserLogger;

  constructor(line: Line, logger: IParserLogger) {
    this.line = line;
    this.logger = logger;
  }

  public validateTokens(name: string): TokenValidator {
    return new TokenValidator(name, this.line, this.logger);
  }
}