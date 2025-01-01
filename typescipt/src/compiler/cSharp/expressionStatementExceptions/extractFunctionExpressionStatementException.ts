

export class ExtractFunctionExpressionStatementException extends IExpressionStatementException {
   public matches(expression: Expression): boolean {
     return expression is FunctionCallExpression functionCallExpression
        && functionCallExpression.ExpressionFunction is ExtractResultsFunction;
   }

   public callExpressionSyntax(expression: Expression, context: ICompileFunctionContext): Array<StatementSyntax> {
     if (!(expression is FunctionCallExpression functionCallExpression))
       throw new Error(`expression should be FunctionCallExpression`);
     if (!(functionCallExpression.ExpressionFunction is ExtractResultsFunction extractResultsFunction))
       throw new Error(
         `functionCallExpression.ExpressionFunction should be ExtractResultsFunction`);

     return ExtractStatementSyntax(extractResultsFunction.Mapping, extractResultsFunction.FunctionResultVariable);
   }

   public static Array<StatementSyntax> ExtractStatementSyntax(Array<Mapping> mappings,
     string functionResultVariable) {
     if (mappings == null) throw new Error(nameof(mappings));

     foreach (let mapping in mappings) yield return StatementSyntax(functionResultVariable, mapping);
   }

   private static statementSyntax(functionResultVariable: string, mapping: Mapping): StatementSyntax {
     let left = mapping.VariableSource == VariableSource.Code
       ? IdentifierName(mapping.VariableName)
       : mapping.VariableSource == VariableSource.Results
         ? (ExpressionSyntax)MemberAccessExpression(
           SyntaxKind.SimpleMemberAccessExpression,
           IdentifierName(LexyCodeConstants.ResultsVariable),
           IdentifierName(mapping.VariableName))
         : throw new Error($`Invalid source: {mapping.VariableSource}`);

     let right = MemberAccessExpression(
       SyntaxKind.SimpleMemberAccessExpression,
       IdentifierName(functionResultVariable),
       IdentifierName(mapping.VariableName));

     return ExpressionStatement(
       AssignmentExpression(SyntaxKind.SimpleAssignmentExpression, left, right));
   }
}
