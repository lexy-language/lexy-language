import {Expression} from "./Expression";
import {VariableType} from "../types/variableType";

export class CaseExpression extends Expression, IParsableNode, IDependantExpression {



  private readonly ExpressionList expressions;

  public nodeType: "CaseExpression"
   public Expression Value
   public Array<Expression> Expressions => expressions;
   public boolean IsDefault

   private CaseExpression(Expression value, boolean isDefault, ExpressionSource source, SourceReference reference) : base(
     source, reference) {
     Value = value;
     IsDefault = isDefault;
     expressions = new ExpressionList(reference);
   }

   public linkPreviousExpression(expression: Expression, context: IParseLineContext): void {
     if (expression is not SwitchExpression switchExpression) {
       context.logger.fail(this.reference,
         `'case' should be following a 'switch' statement. No 'switch' statement found.`);
       return;
     }

     switchExpression.LinkElse(this);
   }

   public parse(context: IParseLineContext): IParsableNode {
     let expression = expressions.parse(context);
     return expression.result is IParsableNode node ? node : this;
   }

   public override getChildren(): Array<INode> {
     if (Value != null) yield return Value;

     yield return expressions;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!IsValid(tokens)) return newParseExpressionFailed(IfExpression>(`Not valid.`);

     if (tokens.isKeyword(0, Keywords.Default)) return ParseDefaultCase(source, tokens);

     if (tokens.length == 1)
       return newParseExpressionFailed(CaseExpression>(`Invalid 'case'. No parameters found.`);

     let value = tokens.tokensFrom(1);
     let valueExpression = ExpressionFactory.parse(value, source.line);
     if (!valueExpression.state != 'success') return valueExpression;

     let reference = source.createReference();

     let expression = new CaseExpression(valueExpression.result, false, source, reference);

     return newParseExpressionSuccess(expression);
   }

   private static parseDefaultCase(source: ExpressionSource, tokens: TokenList): ParseExpressionResult {
     if (tokens.length != 1)
       return newParseExpressionFailed(CaseExpression>(`Invalid 'default' case. No parameters expected.`);

     let reference = source.createReference();
     let expression = new CaseExpression(null, true, source, reference);
     return newParseExpressionSuccess(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.isKeyword(0, Keywords.Case)
        || tokens.isKeyword(0, Keywords.Default);
   }

   protected override validate(context: IValidationContext): void {
   }

   public override deriveType(context: IValidationContext): VariableType | null {
     return Value?.deriveType(context);
   }
}
