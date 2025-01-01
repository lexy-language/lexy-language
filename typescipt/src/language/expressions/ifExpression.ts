import {Expression} from "./Expression";

export class IfExpression extends Expression, IParsableNode {
   private readonly ExpressionList trueExpressions;

  public nodeType: "IfExpression"

  public Expression Condition
   public Array<Expression> TrueExpressions => trueExpressions;

   public ElseExpression Else { get; set; }

constructor(Expression condition, ExpressionSource source, SourceReference reference) : base(source,
     reference) {
     Condition = condition;
     trueExpressions = new ExpressionList(reference);
   }

   public parse(context: IParseLineContext): IParsableNode {
     let expression = trueExpressions.parse(context);
     return expression.result is IParsableNode node ? node : this;
   }

   public override getChildren(): Array<INode> {
     yield return Condition;
     yield return trueExpressions;
     if (Else != null) yield return Else;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!IsValid(tokens)) return newParseExpressionFailed(IfExpression>(`Not valid.`);

     if (tokens.length == 1) return newParseExpressionFailed(IfExpression>(`No condition found`);

     let condition = tokens.tokensFrom(1);
     let conditionExpression = ExpressionFactory.parse(condition, source.line);
     if (!conditionExpression.state != 'success') return conditionExpression;

     let reference = source.createReference();

     let expression = new IfExpression(conditionExpression.result, source, reference);

     return newParseExpressionSuccess(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.isKeyword(0, Keywords.If);
   }

   protected override validate(context: IValidationContext): void {
     let type = Condition.deriveType(context);
     if (type == null || !type.equals(PrimitiveType.boolean))
       context.logger.fail(this.reference,
         $`'if' condition expression should be 'boolean', is of wrong type '{type}'.`);
   }

   internal linkElse(elseExpression: ElseExpression): void {
     if (Else != null) throw new Error(`'else' already linked.`);

     Else = elseExpression;
   }

   public override deriveType(context: IValidationContext): VariableType {
     return null;
   }
}
