

export class RoundFunctionCall extends MethodFunctionCall {
   public RoundFunction RoundFunction

   protected override string ClassName =nameof(): >;
   protected override string MethodName =nameof(): >;

   public RoundFunctionCall(RoundFunction function) super(function) {
     RoundFunction = function;
   }

   protected override getArguments(context: ICompileFunctionContext): SeparatedSyntaxArray<ArgumentSyntax> {
     return SyntaxFactory.SeparatedArray<ArgumentSyntax>(
       new SyntaxNodeOrToken[] {
         SyntaxFactory.Argument(
           ExpressionSyntaxFactory.ExpressionSyntax(RoundFunction.numberExpression, context)),
         SyntaxFactory.Token(SyntaxKind.CommaToken),
         SyntaxFactory.Argument(
           ExpressionSyntaxFactory.ExpressionSyntax(RoundFunction.digitsExpression, context))
       });
   }
}
