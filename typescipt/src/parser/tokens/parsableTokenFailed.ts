import {SourceReference} from "./sourceReference";
import {ParsableToken} from "./parsableToken";

type ParsableTokenFailed = {
  state: "failed";
  errorMessage: string;
  reference: SourceReference;
}

export function newParsableTokenFailed(reference: SourceReference, errorMessage: string): ParsableTokenFailed {
  return {
    state: "failed",
    errorMessage: errorMessage,
    reference: reference
  } as const;
}

type ParsableTokenSuccess = {
  state: "success";
  result: ParsableToken;
}

export function newParsableTokenSuccess(result: ParsableToken) {
  return {
    state: "success",
    result: result
  } as const;
}

export type ParsableTokenResult = ParsableTokenFailed | ParsableTokenSuccess;