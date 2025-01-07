import {ParsableToken} from "./parsableToken";
import {TokenCharacter} from "./tokenCharacter";
import {newParseTokenFinishedResult, newParseTokenInProgressResult, ParseTokenResult} from "./parseTokenResult";
import {TokenType} from "./tokenType";

export function instanceOfCommentToken(object: any): boolean {
  return object?.tokenType == TokenType.CommentToken;
}

export function asCommentToken(object: any): CommentToken | null {
  return instanceOfCommentToken(object) ? object as CommentToken : null;
}

export class CommentToken extends ParsableToken {

  public tokenIsLiteral: boolean = false;
  public tokenType = TokenType.CommentToken;

  constructor(character: TokenCharacter) {
    super(character);
  }

  public parse(character: TokenCharacter): ParseTokenResult {
    this.appendValue(character.value);
    return newParseTokenInProgressResult();
  }

  public finalize(): ParseTokenResult {
    return newParseTokenFinishedResult(true);
  }
}