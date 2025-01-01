



namespace Lexy.Compiler.Language.Expressions;

public static class ExpressionFactory
{
   private static readonly IDictionary<Func<TokenList, bool>, Func<ExpressionSource, ParseExpressionResult>>
     factories =
       new Dictionary<Func<TokenList, bool>, Func<ExpressionSource, ParseExpressionResult>>
       {
         { IfExpression.IsValid, IfExpression.Parse },
         { ElseExpression.IsValid, ElseExpression.Parse },
         { SwitchExpression.IsValid, SwitchExpression.Parse },
         { CaseExpression.IsValid, CaseExpression.Parse },
         { VariableDeclarationExpression.IsValid, VariableDeclarationExpression.Parse },
         { AssignmentExpression.IsValid, AssignmentExpression.Parse },
         { ParenthesizedExpression.IsValid, ParenthesizedExpression.Parse },
         { BracketedExpression.IsValid, BracketedExpression.Parse },
         { IdentifierExpression.IsValid, IdentifierExpression.Parse },
         { MemberAccessExpression.IsValid, MemberAccessExpression.Parse },
         { LiteralExpression.IsValid, LiteralExpression.Parse },
         { BinaryExpression.IsValid, BinaryExpression.Parse },
         { FunctionCallExpression.IsValid, FunctionCallExpression.Parse }
       };

   public static ParseExpressionResult Parse(TokenList tokens, Line currentLine)
   {
     foreach (var factory in factories)
       if (factory.Key(tokens))
       {
         var source = new ExpressionSource(currentLine, tokens);
         return factory.Value(source);
       }

     return ParseExpressionResult.Invalid<Expression>($"Invalid expression: {tokens}");
   }
}
