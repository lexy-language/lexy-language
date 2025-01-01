import {Expression} from "./Expression";

export class ElseExpression extends Expression, IParsableNode, IDependantExpression {
   private readonly ExpressionList falseExpressions;

  public nodeType: "ElseExpression"
  public Array<Expression> FalseExpressions => falseExpressions;

   private ElseExpression(ExpressionSource source, SourceReference reference) : {super(source, reference) {
     falseExpressions = new ExpressionList(reference);
   }

   public linkPreviousExpression(expression: Expression, context: IParseLineContext): void {
     if (expression is not IfExpression ifExpression) {
       context.logger.fail(this.reference, `Else should be following an If statement. No if statement found.`);
       return;
     }

     ifExpression.LinkElse(this);
   }

   public override getChildren(): Array<INode> {
     foreach (let expression in FalseExpressions) yield return expression;
   }

   public parse(context: IParseLineContext): IParsableNode {
     let expression = falseExpressions.parse(context);
     return expression.result is IParsableNode node ? node : this;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!IsValid(tokens)) return newParseExpressionFailed(ElseExpression>(`Not valid.`);

     if (tokens.length > 1) return newParseExpressionFailed(ElseExpression>(`No tokens expected.`);

     let reference = source.createReference();

     let expression = new ElseExpression(source, reference);

     return newParseExpressionSuccess(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.isKeyword(0, Keywords.Else);
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType {
     return null;
   }
}
