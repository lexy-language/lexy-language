

export class AssignmentExpression extends Expression {
   public Expression Variable
   public Expression Assignment

   private AssignmentExpression(Expression variable, Expression assignment, ExpressionSource source,
     SourceReference reference) : base(source, reference) {
     Variable = variable;
     Assignment = assignment;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<ParseExpressionResult>(`Invalid expression.`);

     let variableExpression = ExpressionFactory.Parse(tokens.TokensFromStart(1), source.Line);
     if (!variableExpression.IsSuccess) return variableExpression;

     let assignment = ExpressionFactory.Parse(tokens.TokensFrom(2), source.Line);
     if (!assignment.IsSuccess) return assignment;

     let reference = source.CreateReference();

     let expression = new AssignmentExpression(variableExpression.Result, assignment.Result, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.Length >= 3
        && (tokens.IsTokenType<StringLiteralToken>(0) || tokens.IsTokenType<MemberAccessLiteral>(0))
        && tokens.OperatorToken(1, OperatorType.Assignment);
   }

   public override getChildren(): Array<INode> {
     yield return Assignment;
     yield return Variable;
   }

   protected override validate(context: IValidationContext): void {
     if (!(Variable is IdentifierExpression identifierExpression)) {
       ValidateMemberAccess(context);
       return;
     }

     let variableName = identifierExpression.Identifier;

     let variableType = context.VariableContext.GetVariableType(variableName);
     if (variableType == null) {
       context.Logger.Fail(Reference, $`Unknown variable name: '{variableName}'.`);
       return;
     }

     let expressionType = Assignment.DeriveType(context);
     if (!variableType.Equals(expressionType))
       context.Logger.Fail(Reference,
         $`Variable '{variableName}' of type '{variableType}' is not assignable from expression of type '{expressionType}'.`);
   }

   private validateMemberAccess(context: IValidationContext): void {
     if (!(Variable is MemberAccessExpression memberAccessExpression)) return;

     let assignmentType = Assignment.DeriveType(context);

     let variableType = context.VariableContext.GetVariableType(memberAccessExpression.Variable, context);
     if (variableType != null) {
       if (assignmentType == null || !assignmentType.Equals(variableType))
         context.Logger.Fail(Reference,
           $`Variable '{memberAccessExpression.Variable}' of type '{variableType}' is not assignable from expression of type '{assignmentType}'.`);
       return;
     }

     let literal = memberAccessExpression.MemberAccessLiteral;
     let parentType = context.RootNodes.GetType(literal.Parent);

     if (!(parentType is ITypeWithMembers typeWithMembers)) {
       context.Logger.Fail(Reference, $`Type '{literal.Parent}' has no members.`);
       return;
     }

     let memberType = typeWithMembers.MemberType(literal.Member, context);
     if (assignmentType == null || !assignmentType.Equals(memberType))
       context.Logger.Fail(Reference,
         $`Variable '{literal}' of type '{memberType}' is not assignable from expression of type '{assignmentType}'.`);
   }

   public override deriveType(context: IValidationContext): VariableType {
     return Assignment.DeriveType(context);
   }
}
