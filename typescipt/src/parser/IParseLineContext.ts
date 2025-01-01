import {IParserLogger} from "./tokens/IParserLogger";
import {Line} from "./tokens/line";
import {TokenValidator} from "./TokenValidator";

export interface IParseLineContext {
  line: Line;
  logger: IParserLogger

  validateTokens(name: string): TokenValidator
}