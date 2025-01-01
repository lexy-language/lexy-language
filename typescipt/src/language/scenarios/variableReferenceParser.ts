

export class VariableReferenceParser {
   public static parse(parts: string[]): VariableReferenceParseResult {
     let variableReference = new VariableReference(parts);
     return VariableReferenceParseResult.Success(variableReference);
   }

   public static parse(expression: Expression): VariableReferenceParseResult {
     return expression switch {
       MemberAccessExpression memberAccessExpression => Parse(memberAccessExpression),
       LiteralExpression literalExpression => Parse(literalExpression),
       IdentifierExpression literalExpression => VariableReferenceParseResult.Success(
         new VariableReference(literalExpression.Identifier)),
       _ => VariableReferenceParseResult.Failed(`Invalid constant value. Expected: 'Variable = ConstantValue'`)
     };
   }

   private static parse(literalExpression: LiteralExpression): VariableReferenceParseResult {
     return literalExpression.Literal switch {
       StringLiteralToken stringLiteral => VariableReferenceParseResult.Success(
         new VariableReference(stringLiteral.Value)),
       _ => VariableReferenceParseResult.Failed(`Invalid expression literal. Expected: 'Variable = ConstantValue'`)
     };
   }

   private static parse(memberAccessExpression: MemberAccessExpression): VariableReferenceParseResult {
     if (memberAccessExpression.MemberAccessLiteral.Parts.Length == 0)
       return VariableReferenceParseResult.Failed(`Invalid number of variable reference parts: `
                            + memberAccessExpression.MemberAccessLiteral.Parts.Length);

     let variableReference = new VariableReference(memberAccessExpression.MemberAccessLiteral.Parts);
     return VariableReferenceParseResult.Success(variableReference);
   }
}
