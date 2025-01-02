import {ExpressionFunction} from "./functions/expressionFunction";

type ParseExpressionFunctionsFailed = {
  state: "failed";
  errorMessage: string;
}

export function newParseExpressionFunctionsFailed(errorMessage: string, ): ParseExpressionFunctionsFailed {
  return {
    state: "failed",
    errorMessage: errorMessage,
  } as const;
}

type ParseExpressionFunctionsSuccess = {
  state: "success";
  result: ExpressionFunction;
}

export function newParseExpressionFunctionsSuccess(result: ExpressionFunction) {
  return {
    state: "success",
    result: result
  } as const;
}

export type ParseExpressionFunctionsResult = ParseExpressionFunctionsFailed | ParseExpressionFunctionsSuccess;