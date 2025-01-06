

internal static class ExpressionSyntaxFactory {
   private static readonly IDictionary<ExpressionOperator, SyntaxKind> TranslateOperators =
     new Dictionary<ExpressionOperator, SyntaxKind> {
       { ExpressionOperator.Addition, SyntaxKind.AddExpression },
       { ExpressionOperator.Subtraction, SyntaxKind.SubtractExpression },
       { ExpressionOperator.Multiplication, SyntaxKind.MultiplyExpression },
       { ExpressionOperator.Division, SyntaxKind.DivideExpression },
       { ExpressionOperator.Modulus, SyntaxKind.ModuloExpression },

       { ExpressionOperator.GreaterThan, SyntaxKind.GreaterThanExpression },
       { ExpressionOperator.GreaterThanOrEqual, SyntaxKind.GreaterThanOrEqualExpression },
       { ExpressionOperator.LessThan, SyntaxKind.LessThanExpression },
       { ExpressionOperator.LessThanOrEqual, SyntaxKind.LessThanOrEqualExpression },

       { ExpressionOperator.And, SyntaxKind.LogicalAndExpression },
       { ExpressionOperator.Or, SyntaxKind.LogicalOrExpression },
       { ExpressionOperator.equals, SyntaxKind.equalsExpression },
       { ExpressionOperator.NotEqual, SyntaxKind.NotEqualsExpression }
     };

   private static readonly Array<IExpressionStatementException> RenderStatementExceptions =
     new IExpressionStatementException[] {
       new NewFunctionExpressionStatementException(),
       new FillFunctionExpressionStatementException(),
       new ExtractFunctionExpressionStatementException(),
       new SimpleLexyFunctionFunctionExpressionStatementException()
     };

   private static Array<StatementSyntax> ExecuteExpressionStatementSyntax(Array<Expression> lines,
     ICompileFunctionContext context) {
     return lines.SelectMany(expression => ExecuteStatementSyntax(expression, context)).ToList();
   }

   public static StatementSyntax[] ExecuteStatementSyntax(Expression expression,
     ICompileFunctionContext context) {
     let statements = new Array<StatementSyntax> {
       ExpressionStatement(
         InvocationExpression(
             MemberAccessExpression(
               SyntaxKind.SimpleMemberAccessExpression,
               IdentifierName(LexyCodeConstants.ContextVariable),
               IdentifierName(nameof(IExecutionContext.LogDebug))))
           .WithArgumentList(
             ArgumentList(
               SingletonSeparatedList(
                 Argument(
                   LiteralExpression(
                     SyntaxKind.StringLiteralExpression,
                     Literal(expression.Source.line.toString())))))))
     };

     statements.AddRange(ExpressionStatementSyntax(expression, context));

     return statements.ToArray();
   }

   private static Array<StatementSyntax> ExpressionStatementSyntax(Expression expression,
     ICompileFunctionContext context) {
     let renderExpressionStatementException =
       RenderStatementExceptions.FirstOrDefault(exception => exception.Matches(expression));

     return renderExpressionStatementException != null
       ? renderExpressionStatementException.CallExpressionSyntax(expression, context)
       : DefaultExpressionStatementSyntax(expression, context);
   }

   private static Array<StatementSyntax> DefaultExpressionStatementSyntax(Expression expression,
     ICompileFunctionContext context) {
     yield return expression switch {
       AssignmentExpression assignment => TranslateAssignmentExpression(assignment, context),
       VariableDeclarationExpression variableDeclarationExpression => TranslateVariableDeclarationExpression(
         variableDeclarationExpression, context),
       IfExpression ifExpression => TranslateIfExpression(ifExpression, context),
       SwitchExpression switchExpression => TranslateSwitchExpression(switchExpression, context),
       FunctionCallExpression functionCallExpression => ExpressionStatement(
         TranslateFunctionCallExpression(functionCallExpression, context)),
       _ => throw new Error($`Wrong expression type {expression.getType()}: {expression}`)
     };
   }

   private static StatementSyntax TranslateSwitchExpression(SwitchExpression switchExpression,
     ICompileFunctionContext context) {
     let cases = switchExpression.Cases
       .Select(expression =>
         SwitchSection()
           .WithLabels(
             SingletonList(
               !expression.IsDefault
                 ? CaseSwitchLabel(ExpressionSyntax(expression.Value, context))
                 : (SwitchLabelSyntax)DefaultSwitchLabel()))
           .WithStatements(
             List(
               new StatementSyntax[] {
                 Block(List(ExecuteExpressionStatementSyntax(expression.Expressions, context))),
                 BreakStatement()
               })))
       .ToList();

     return SwitchStatement(ExpressionSyntax(switchExpression.Condition, context))
       .WithSections(List(cases));
   }

   private static StatementSyntax TranslateIfExpression(IfExpression ifExpression,
     ICompileFunctionContext context) {
     let elseStatement = ifExpression.Else != null
       ? ElseClause(
         Block(
           List(
             ExecuteExpressionStatementSyntax(ifExpression.Else.FalseExpressions, context))))
       : null;

     let ifStatement = IfStatement(
       ExpressionSyntax(ifExpression.Condition, context),
       Block(
         List(ExecuteExpressionStatementSyntax(ifExpression.TrueExpressions, context))));

     return elseStatement != null ? ifStatement.WithElse(elseStatement) : ifStatement;
   }

   private static ExpressionStatementSyntax TranslateAssignmentExpression(AssignmentExpression assignment,
     ICompileFunctionContext context) {
     return ExpressionStatement(
       AssignmentExpression(
         SyntaxKind.SimpleAssignmentExpression,
         ExpressionSyntax(assignment.Variable, context),
         ExpressionSyntax(assignment.Assignment, context)));
   }

   private static StatementSyntax TranslateVariableDeclarationExpression(VariableDeclarationExpression expression,
     ICompileFunctionContext context) {
     let typeSyntax = Types.Syntax(expression.Type);

     let initialize = expression.Assignment != null
       ? ExpressionSyntax(expression.Assignment, context)
       : Types.TypeDefaultExpression(expression.Type);

     let variable = VariableDeclarator(Identifier(expression.Name))
       .WithInitializer(EqualsValueClause(initialize));

     return LocalDeclarationStatement(
       VariableDeclaration(typeSyntax)
         .WithVariables(SingletonSeparatedList(variable)));
   }

   public static expressionSyntax(line: Expression): ExpressionSyntax {
     return line switch {
       LiteralExpression expression => TokenValuesSyntax.Expression(expression.Literal),
       IdentifierExpression expression => IdentifierNameSyntax(expression),
       MemberAccessExpression expression => TranslateMemberAccessExpression(expression),
       _ => throw new Error($`Wrong expression type {line?.getType()}: {line}`)
     };
   }

   public static expressionSyntax(line: Expression, context: ICompileFunctionContext): ExpressionSyntax {
     return line switch {
       LiteralExpression expression => TokenValuesSyntax.Expression(expression.Literal),
       IdentifierExpression expression => IdentifierNameSyntax(expression),
       MemberAccessExpression expression => TranslateMemberAccessExpression(expression),
       BinaryExpression expression => TranslateBinaryExpression(expression, context),
       ParenthesizedExpression expression => ParenthesizedExpression(ExpressionSyntax(expression.Expression,
         context)),
       FunctionCallExpression expression => TranslateFunctionCallExpression(expression, context),
       _ => throw new Error($`Wrong expression type {line.getType()}: {line}`)
     };
   }

   private static ExpressionSyntax TranslateFunctionCallExpression(FunctionCallExpression expression,
     ICompileFunctionContext context) {
     let functionCall = context.Get(expression.ExpressionFunction);
     if (functionCall == null)
       throw new Error($`Function call not found: {expression.functionName}`);

     return functionCall.CallExpressionSyntax(context);
   }

   private static ExpressionSyntax TranslateBinaryExpression(BinaryExpression expression,
     ICompileFunctionContext context) {
     let kind = Translate(expression.operator);
     return BinaryExpression(
       kind,
       ExpressionSyntax(expression.left, context),
       ExpressionSyntax(expression.right, context));
   }

   private static translate(expressionOperator: ExpressionOperator): SyntaxKind {
     if (!TranslateOperators.TryGetValue(expressionOperator, out let result))
       throw new ArgumentOutOfRangeException(nameof(expressionOperator), expressionOperator, null);

     return result;
   }
