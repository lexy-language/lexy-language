

internal abstract class SingleArgumentFunctionCall : MethodFunctionCall {
   public SingleArgumentFunction SingleArgumentFunction

   protected SingleArgumentFunctionCall(SingleArgumentFunction function) : base(function) {
     SingleArgumentFunction = function;
   }

   public override customMethodSyntax(context: ICompileFunctionContext): MemberDeclarationSyntax {
     return null;
   }

   protected override getArguments(context: ICompileFunctionContext): SeparatedSyntaxArray<ArgumentSyntax> {
     return SyntaxFactory.SingletonSeparatedList(
       SyntaxFactory.Argument(
         ExpressionSyntaxFactory.ExpressionSyntax(SingleArgumentFunction.ValueExpression, context)));
   }
}
