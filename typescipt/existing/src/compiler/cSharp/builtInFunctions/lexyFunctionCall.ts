




namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class LexyFunctionCall : FunctionCall
{
   public LexyFunction ExpressionFunction { get; }

   public LexyFunctionCall(LexyFunction expressionFunction) : base(expressionFunction)
   {
     ExpressionFunction = expressionFunction;
   }

   public override MemberDeclarationSyntax CustomMethodSyntax(ICompileFunctionContext context)
   {
     return null;
   }

   public override ExpressionSyntax CallExpressionSyntax(ICompileFunctionContext context)
   {
     return RunFunction(ExpressionFunction.FunctionName, ExpressionFunction.VariableName);
   }

   public static InvocationExpressionSyntax RunFunction(string functionName, string variableName)
   {
     return SyntaxFactory.InvocationExpression(
         SyntaxFactory.MemberAccessExpression(
           SyntaxKind.SimpleMemberAccessExpression,
           SyntaxFactory.IdentifierName(ClassNames.FunctionClassName(functionName)),
           SyntaxFactory.IdentifierName(LexyCodeConstants.RunMethod)))
       .WithArgumentList(
         SyntaxFactory.ArgumentList(
           SyntaxFactory.SeparatedList<ArgumentSyntax>(
             new SyntaxNodeOrToken[]
             {
               SyntaxFactory.Argument(SyntaxFactory.IdentifierName(variableName)),
               SyntaxFactory.Token(SyntaxKind.CommaToken),
               SyntaxFactory.Argument(SyntaxFactory.IdentifierName(LexyCodeConstants.ContextVariable))
             })));
   }
}
