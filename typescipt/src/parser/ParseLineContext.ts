import {IParseLineContext} from "./IParseLineContext";
import {Line} from "./tokens/line";
import {IParserLogger} from "./tokens/IParserLogger";
import {TokenValidator} from "./TokenValidator";

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