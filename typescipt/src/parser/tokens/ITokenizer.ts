import {Line} from "./line";
import {TokenizeResult} from "./tokenizeResult";

export interface ITokenizer {
  tokenize(line: Line): TokenizeResult;
}