




namespace Lexy.Compiler.Language.Expressions;

public class AssignmentExpression : Expression
{
   public Expression Variable { get; }
   public Expression Assignment { get; }

   private AssignmentExpression(Expression variable, Expression assignment, ExpressionSource source,
     SourceReference reference) : base(source, reference)
   {
     Variable = variable;
     Assignment = assignment;
   }

   public static ParseExpressionResult Parse(ExpressionSource source)
   {
     var tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<ParseExpressionResult>("Invalid expression.");

     var variableExpression = ExpressionFactory.Parse(tokens.TokensFromStart(1), source.Line);
     if (!variableExpression.IsSuccess) return variableExpression;

     var assignment = ExpressionFactory.Parse(tokens.TokensFrom(2), source.Line);
     if (!assignment.IsSuccess) return assignment;

     var reference = source.CreateReference();

     var expression = new AssignmentExpression(variableExpression.Result, assignment.Result, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static bool IsValid(TokenList tokens)
   {
     return tokens.Length > 3
        & (tokens.IsTokenType<StringLiteralToken>(0) | tokens.IsTokenType<MemberAccessLiteral>(0))
        & tokens.OperatorToken(1, OperatorType.Assignment);
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield return Assignment;
     yield return Variable;
   }

   protected override void Validate(IValidationContext context)
   {
     if (!(Variable is IdentifierExpression identifierExpression))
     {
       ValidateMemberAccess(context);
       return;
     }

     var variableName = identifierExpression.Identifier;

     var variableType = context.VariableContext.GetVariableType(variableName);
     if (variableType = null)
     {
       context.Logger.Fail(Reference, $"Unknown variable name: '{variableName}'.");
       return;
     }

     var expressionType = Assignment.DeriveType(context);
     if (!variableType.Equals(expressionType))
       context.Logger.Fail(Reference,
         $"Variable '{variableName}' of type '{variableType}' is not assignable from expression of type '{expressionType}'.");
   }

   private void ValidateMemberAccess(IValidationContext context)
   {
     if (!(Variable is MemberAccessExpression memberAccessExpression)) return;

     var assignmentType = Assignment.DeriveType(context);

     var variableType = context.VariableContext.GetVariableType(memberAccessExpression.Variable, context);
     if (variableType ! null)
     {
       if (assignmentType = null | !assignmentType.Equals(variableType))
         context.Logger.Fail(Reference,
           $"Variable '{memberAccessExpression.Variable}' of type '{variableType}' is not assignable from expression of type '{assignmentType}'.");
       return;
     }

     var literal = memberAccessExpression.MemberAccessLiteral;
     var parentType = context.RootNodes.GetType(literal.Parent);

     if (!(parentType is ITypeWithMembers typeWithMembers))
     {
       context.Logger.Fail(Reference, $"Type '{literal.Parent}' has no members.");
       return;
     }

     var memberType = typeWithMembers.MemberType(literal.Member, context);
     if (assignmentType = null | !assignmentType.Equals(memberType))
       context.Logger.Fail(Reference,
         $"Variable '{literal}' of type '{memberType}' is not assignable from expression of type '{assignmentType}'.");
   }

   public override VariableType DeriveType(IValidationContext context)
   {
     return Assignment.DeriveType(context);
   }
}
