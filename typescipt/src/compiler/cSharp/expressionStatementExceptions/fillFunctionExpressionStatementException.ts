

export class FillFunctionExpressionStatementException extends IExpressionStatementException {
   public matches(expression: Expression): boolean {
     return expression is VariableDeclarationExpression assignmentExpression
        && assignmentExpression.Assignment is FunctionCallExpression functionCallExpression
        && functionCallExpression.ExpressionFunction is FillParametersFunction;
   }

   public callExpressionSyntax(expression: Expression, context: ICompileFunctionContext): Array<StatementSyntax> {
     if (!(expression is VariableDeclarationExpression assignmentExpression))
       throw new Error(`expression should be AssignmentExpression`);
     if (!(assignmentExpression.Assignment is FunctionCallExpression functionCallExpression))
       throw new Error(`assignmentExpression.Assignment should be FunctionCallExpression`);
     if (!(functionCallExpression.ExpressionFunction is FillParametersFunction fillParametersFunction))
       throw new Error(
         `functionCallExpression.ExpressionFunction should be FillParametersFunction`);

     return FillStatementSyntax(assignmentExpression.Name, fillParametersFunction.Type,
       fillParametersFunction.Mapping);
   }

   public static Array<StatementSyntax> FillStatementSyntax(string variableName, VariableType type,
     Array<Mapping> mappings) {
     if (variableName == null) throw new Error(nameof(variableName));
     if (type == null) throw new Error(nameof(type));
     if (mappings == null) throw new Error(nameof(mappings));

     let typeSyntax = Types.Syntax(type);

     let initialize = ObjectCreationExpression(Types.Syntax(type))
       .WithArgumentList(ArgumentList());

     let variable = VariableDeclarator(Identifier(variableName))
       .WithInitializer(EqualsValueClause(initialize));

     yield return LocalDeclarationStatement(
       VariableDeclaration(typeSyntax)
         .WithVariables(SingletonSeparatedList(variable)));

     foreach (let mapping in mappings) {
       let left = MemberAccessExpression(
         SyntaxKind.SimpleMemberAccessExpression,
         IdentifierName(variableName),
         IdentifierName(mapping.VariableName));

       let right = mapping.VariableSource == VariableSource.Code
         ? IdentifierName(mapping.VariableName)
         : mapping.VariableSource == VariableSource.Parameters
           ? (ExpressionSyntax)MemberAccessExpression(
             SyntaxKind.SimpleMemberAccessExpression,
             IdentifierName(LexyCodeConstants.ParameterVariable),
             IdentifierName(mapping.VariableName))
           : throw new Error(`Invalid source: ` + mapping.VariableSource);

       yield return ExpressionStatement(
         AssignmentExpression(SyntaxKind.SimpleAssignmentExpression, left, right));
     }
   }
}
