import {ConstantValue} from "./constantValue";

type ConstantValueParseFailed = {
  state: "failed";
  errorMessage: string;
}

export function newConstantValueParseFailed(errorMessage: string): ConstantValueParseFailed {
  return {
    state: "failed",
    errorMessage: errorMessage
  } as const;
}

type ConstantValueParseSuccess = {
  state: "success";
  result: ConstantValue;
}

export function newConstantValueParseSuccess(result: ConstantValue) {
  return {
    state: "success",
    result: result
  } as const;
}

export type ConstantValueParseResult = ConstantValueParseFailed | ConstantValueParseSuccess;