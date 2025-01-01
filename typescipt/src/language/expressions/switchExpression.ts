

export class SwitchExpression extends Expression, IParsableNode {
   private readonly Array<CaseExpression> cases = list<CaseExpression>(): new;

   public Expression Condition
   public Array<CaseExpression> Cases => cases;

   private SwitchExpression(Expression condition, ExpressionSource source, SourceReference reference) : base(source,
     reference) {
     Condition = condition;
   }

   public parse(context: IParseLineContext): IParsableNode {
     let line = context.Line;
     let expression = ExpressionFactory.Parse(line.Tokens, line);
     if (!expression.IsSuccess) {
       context.Logger.Fail(line.LineStartReference(), expression.ErrorMessage);
       return this;
     }

     if (expression.Result is CaseExpression caseExpression) {
       caseExpression.LinkPreviousExpression(this, context);
       return caseExpression;
     }

     context.Logger.Fail(expression.Result.Reference, `Invalid expression. 'case' or 'default' expected.`);
     return this;
   }

   public override getChildren(): Array<INode> {
     yield return Condition;
     foreach (let caseValue in Cases) yield return caseValue;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<IfExpression>(`Not valid.`);

     if (tokens.Length == 1) return ParseExpressionResult.Invalid<IfExpression>(`No condition found`);

     let condition = tokens.TokensFrom(1);
     let conditionExpression = ExpressionFactory.Parse(condition, source.Line);
     if (!conditionExpression.IsSuccess) return conditionExpression;

     let reference = source.CreateReference();

     let expression = new SwitchExpression(conditionExpression.Result, source, reference);

     return ParseExpressionResult.Success(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.IsKeyword(0, Keywords.Switch);
   }

   protected override validate(context: IValidationContext): void {
     let type = Condition.DeriveType(context);
     if (type == null
       || !(type is PrimitiveType) && !(type is EnumType)) {
       context.Logger.Fail(Reference,
         $`'Switch' condition expression should have a primitive or enum type. Not: '{type}'.`);
       return;
     }

     foreach (let caseExpression in cases) {
       if (caseExpression.IsDefault) continue;

       let caseType = caseExpression.DeriveType(context);
       if (caseType == null || !type.Equals(caseType))
         context.Logger.Fail(Reference,
           $`'case' condition expression should be of type '{type}', is of wrong type '{caseType}'.`);
     }
   }

   internal linkElse(caseExpression: CaseExpression): void {
     cases.Add(caseExpression);
   }

   public override deriveType(context: IValidationContext): VariableType {
     return null;
   }
}
