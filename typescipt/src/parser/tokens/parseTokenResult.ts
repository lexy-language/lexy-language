import {Token} from "./token";

import type {IParsableToken} from "./parsableToken";

type ParseTokenInvalidResult = {
  state: "invalid";
  validationError: string;
}

export function newParseTokenInvalidResult(validationError: string)
  : ParseTokenInvalidResult {
  return {
    state: "invalid",
    validationError: validationError
  }
}

type ParseTokenFinishedResult = {
  state: "finished";
  charProcessed: boolean;
  newToken: Token | null;
}

export function newParseTokenFinishedResult(charProcessed: boolean = false, newToken: Token | null = null)
  : ParseTokenFinishedResult {
  return {
    state: "finished",
    charProcessed: charProcessed,
    newToken: newToken
  };
}

type ParseTokenInProgressResult = {
  state: "inProgress";
  newToken: IParsableToken | null;
}

export function newParseTokenInProgressResult(newToken: IParsableToken | null = null)
  : ParseTokenInProgressResult {
  return {
    state: "inProgress",
    newToken: newToken
  }
}

export type ParseTokenResult = ParseTokenInvalidResult
  | ParseTokenFinishedResult
  | ParseTokenInProgressResult;