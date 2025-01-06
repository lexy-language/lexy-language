import {VariableReference} from "../variableReference";

export type VariableReferenceParseFailed = {
  state: "failed";
  errorMessage: string;
}

export function newVariableReferenceParseFailed(errorMessage: string, ): VariableReferenceParseFailed {
  return {
    state: "failed",
    errorMessage: errorMessage,
  } as const;
}

export type VariableReferenceParseSuccess = {
  state: "success";
  result: VariableReference;
}

export function newVariableReferenceParseSuccess(result: VariableReference) {
  return {
    state: "success",
    result: result
  } as const;
}

export type VariableReferenceParseResult = VariableReferenceParseFailed | VariableReferenceParseSuccess;