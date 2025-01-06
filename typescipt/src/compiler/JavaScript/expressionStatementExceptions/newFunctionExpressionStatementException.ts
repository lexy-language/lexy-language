

export class NewFunctionExpressionStatementException extends IExpressionStatementException {
   public matches(expression: Expression): boolean {
     return expression is VariableDeclarationExpression assignmentExpression
        && assignmentExpression.assignment is FunctionCallExpression functionCallExpression
        && functionCallExpression.ExpressionFunction is NewFunction;
   }

   public callExpressionSyntax(expression: Expression, context: ICompileFunctionContext): Array<StatementSyntax> {
     if (!(expression is VariableDeclarationExpression assignmentExpression))
       throw new Error(`expression should be VariableDeclarationExpression`);
     if (!(assignmentExpression.assignment is FunctionCallExpression functionCallExpression))
       throw new Error(`assignmentExpression.assignment should be FunctionCallExpression`);
     if (!(functionCallExpression.ExpressionFunction is NewFunction _))
       throw new Error(`functionCallExpression.ExpressionFunction should be NewFunction`);

     let typeSyntax = Types.Syntax(assignmentExpression.type);

     let initialize = ObjectCreationExpression(typeSyntax)
       .WithArgumentList(ArgumentList());

     let variable = VariableDeclarator(Identifier(assignmentExpression.name))
       .WithInitializer(EqualsValueClause(initialize));

     yield return LocalDeclarationStatement(
       VariableDeclaration(typeSyntax)
         .WithVariables(SingletonSeparatedList(variable)));
   }
}
