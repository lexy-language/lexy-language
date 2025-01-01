import {SourceReference} from "./sourceReference";
import {TokenList} from "./tokenList";

export type TokenizeFailed = {
  state: 'failed';
  reference: SourceReference;
  errorMessage: string;
}

export function newTokenizeFailed(reference: SourceReference, errorMessage: string) {
  return {
    state: 'failed',
    reference: reference,
    errorMessage: errorMessage
  } as const;
}

type TokenizeSuccess = {
  state: 'success';
  result: TokenList;
}

export function newTokenizeSuccess(result: TokenList) {
  return {
    state: 'success',
    result: result,
  } as const;
}

export type TokenizeResult = TokenizeFailed | TokenizeSuccess;