import {Expression} from "./Expression";
import {VariableType} from "../types/variableType";
import {asParsableNode, IParsableNode} from "../parsableNode";
import {IDependantExpression} from "./IDependantExpression";
import {ExpressionList} from "./expressionList";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {SwitchExpression} from "./switchExpression";
import {INode} from "../node";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {Keywords} from "../../parser/Keywords";
import {ExpressionFactory} from "./expressionFactory";
import {TokenList} from "../../parser/tokens/tokenList";
import {IValidationContext} from "../../parser/validationContext";

export class CaseExpression extends Expression implements IParsableNode, IDependantExpression {

  private readonly expressionsValues: ExpressionList;

  public isParsableNode: true;
  public isDependantExpression: true;

  public nodeType: "CaseExpression";
   public value: Expression | null;
   public get expressions(): Array<Expression>  {
    return this.expressionsValues.asArray();
   }
   public isDefault: boolean;

  constructor(value: Expression | null, isDefault: boolean, source: ExpressionSource, reference: SourceReference) {
    super(source, reference);
     this.value = value;
     this.isDefault = isDefault;
     this.expressionsValues = new ExpressionList(reference);
   }

   public linkPreviousExpression(expression: Expression, context: IParseLineContext): void {

     if (expression.nodeType != "SwitchExpression") {
       context.logger.fail(this.reference,
         `'case' should be following a 'switch' statement. No 'switch' statement found.`);
       return;
     }

     const  switchExpression = expression as SwitchExpression;
     switchExpression.linkElse(this);
   }

   public parse(context: IParseLineContext): IParsableNode {
     const expression = this.expressionsValues.parse(context);
     if (expression.state != "success") return this;
     const node = asParsableNode(expression.result)
     return node != null ? node : this;
   }

   public override getChildren(): Array<INode> {
    return this.value != null ? [this.value, ...this.expressions] : [...this.expressions];
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!this.isValid(tokens)) return newParseExpressionFailed(CaseExpression, `Not valid.`);

     if (tokens.isKeyword(0, Keywords.Default)) return this.parseDefaultCase(source, tokens);

     if (tokens.length == 1)
       return newParseExpressionFailed(CaseExpression, `Invalid 'case'. No parameters found.`);

     let value = tokens.tokensFrom(1);
     let valueExpression = ExpressionFactory.parse(value, source.line);
     if (valueExpression.state != 'success') return valueExpression;

     let reference = source.createReference();

     let expression = new CaseExpression(valueExpression.result, false, source, reference);

     return newParseExpressionSuccess(expression);
   }

   private static parseDefaultCase(source: ExpressionSource, tokens: TokenList): ParseExpressionResult {
     if (tokens.length != 1)
       return newParseExpressionFailed(CaseExpression, `Invalid 'default' case. No parameters expected.`);

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
     return this.value != null ? this.value.deriveType(context) : null;
   }
}
