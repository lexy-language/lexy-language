

export class SimpleLexyFunctionFunctionExpressionStatementException extends IExpressionStatementException {
   public matches(expression: Expression): boolean {
     return expression is FunctionCallExpression functionCallExpression
        && functionCallExpression.ExpressionFunction is LexyFunction;
   }

   public callExpressionSyntax(expression: Expression, context: ICompileFunctionContext): Array<StatementSyntax> {
     if (!(expression is FunctionCallExpression functionCallExpression))
       throw new Error(`expression should be FunctionCallExpression`);
     if (!(functionCallExpression.ExpressionFunction is LexyFunction lexyFunction))
       throw new Error(
         `functionCallExpression.ExpressionFunction should be ExtractResultsFunction`);

     let parameterVariable = $`{LexyCodeConstants.ParameterVariable}{Guid.NewGuid():N}`;
     let resultsVariable = $`{LexyCodeConstants.ResultsVariable}{Guid.NewGuid():N}`;

     let result = new Array<StatementSyntax>();
     result.AddRange(FillFunctionExpressionStatementException.FillStatementSyntax(
       parameterVariable,
       lexyFunction.FunctionParametersType,
       lexyFunction.MappingParameters));

     result.Add(RunFunction(lexyFunction, parameterVariable, resultsVariable));

     result.AddRange(ExtractFunctionExpressionStatementException.ExtractStatementSyntax(
       lexyFunction.MappingResults,
       resultsVariable));

     return result;
   }

   private static StatementSyntax RunFunction(LexyFunction lexyFunction, string parameterVariable,
     string resultsVariable) {
     let initialize = LexyFunctionCall.RunFunction(lexyFunction.FunctionName, parameterVariable);

     let variable = VariableDeclarator(Identifier(resultsVariable))
       .WithInitializer(EqualsValueClause(initialize));

     return LocalDeclarationStatement(
       VariableDeclaration(Types.Syntax(lexyFunction.FunctionResultsType))
         .WithVariables(SingletonSeparatedList(variable)));
   }
}
