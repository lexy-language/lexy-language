

internal abstract class EndStartDateFunctionCall : MethodFunctionCall {
   public EndStartDateFunction Function

   protected EndStartDateFunctionCall(EndStartDateFunction function) : base(function) {
     Function = function;
   }

   public override customMethodSyntax(context: ICompileFunctionContext): MemberDeclarationSyntax {
     return null;
   }

   protected override getArguments(context: ICompileFunctionContext): SeparatedSyntaxArray<ArgumentSyntax> {
     return SyntaxFactory.SeparatedArray<ArgumentSyntax>(
       new SyntaxNodeOrToken[] {
         SyntaxFactory.Argument(ExpressionSyntaxFactory.ExpressionSyntax(Function.EndDateExpression, context)),
         SyntaxFactory.Token(SyntaxKind.CommaToken),
         SyntaxFactory.Argument(ExpressionSyntaxFactory.ExpressionSyntax(Function.StartDateExpression, context))
       });
   }
}
