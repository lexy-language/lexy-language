import {TokenList} from "../../parser/tokens/tokenList";

type ArgumentTokenParseFailed = {
  state: "failed";
  errorMessage: string;
}

export function newArgumentTokenParseFailed(errorMessage: string): ArgumentTokenParseFailed {
  return {
    state: "failed",
    errorMessage: errorMessage,
  } as const;
}

type ArgumentTokenParseSuccess = {
  state: "success";
  result: Array<TokenList>;
}

export function newArgumentTokenParseSuccess(result: Array<TokenList>) {
  return {
    state: "success",
    result: result
  } as const;
}

export type ArgumentTokenParseResult = ArgumentTokenParseFailed | ArgumentTokenParseSuccess;
