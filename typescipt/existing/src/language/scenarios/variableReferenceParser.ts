



namespace Lexy.Compiler.Language.Scenarios;

public static class VariableReferenceParser
{
   public static VariableReferenceParseResult Parse(string[] parts)
   {
     var variableReference = new VariableReference(parts);
     return VariableReferenceParseResult.Success(variableReference);
   }

   public static VariableReferenceParseResult Parse(Expression expression)
   {
     return expression switch
     {
       MemberAccessExpression memberAccessExpression => Parse(memberAccessExpression),
       LiteralExpression literalExpression => Parse(literalExpression),
       IdentifierExpression literalExpression => VariableReferenceParseResult.Success(
         new VariableReference(literalExpression.Identifier)),
       _ => VariableReferenceParseResult.Failed("Invalid constant value. Expected: 'Variable = ConstantValue'")
     };
   }

   private static VariableReferenceParseResult Parse(LiteralExpression literalExpression)
   {
     return literalExpression.Literal switch
     {
       StringLiteralToken stringLiteral => VariableReferenceParseResult.Success(
         new VariableReference(stringLiteral.Value)),
       _ => VariableReferenceParseResult.Failed("Invalid expression literal. Expected: 'Variable = ConstantValue'")
     };
   }

   private static VariableReferenceParseResult Parse(MemberAccessExpression memberAccessExpression)
   {
     if (memberAccessExpression.MemberAccessLiteral.Parts.Length = 0)
       return VariableReferenceParseResult.Failed("Invalid number of variable reference parts: "
                            + memberAccessExpression.MemberAccessLiteral.Parts.Length);

     var variableReference = new VariableReference(memberAccessExpression.MemberAccessLiteral.Parts);
     return VariableReferenceParseResult.Success(variableReference);
   }
}
