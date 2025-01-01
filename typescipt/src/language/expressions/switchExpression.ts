import {Expression} from "./Expression";
import {CaseExpression} from "./caseExpression";
import {IParsableNode} from "../parsableNode";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {ExpressionFactory} from "./expressionFactory";
import {INode} from "../node";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {TokenList} from "../../parser/tokens/tokenList";
import {Keywords} from "../../parser/Keywords";
import {IValidationContext} from "../../parser/validationContext";
import {VariableType} from "../types/variableType";

export class SwitchExpression extends Expression implements IParsableNode {

  public isParsableNode: true;
  public nodeType: "SwitchExpression";

  public condition: Expression;
  public cases: Array<CaseExpression> = [];

  constructor(condition: Expression, source: ExpressionSource, reference: SourceReference) {
    super(source, reference);
    this.condition = condition;
  }

   public parse(context: IParseLineContext): IParsableNode {
     let line = context.line;
     let expression = ExpressionFactory.parse(line.tokens, line);
     if (expression.state != 'success') {
       context.logger.fail(line.lineStartReference(), expression.errorMessage);
       return this;
     }

     if (expression.result.nodeType == "CaseExpression") {
       const caseExpression = expression.result as CaseExpression;
       caseExpression.linkPreviousExpression(this, context);
       return caseExpression;
     }

     context.logger.fail(expression.result.reference, `Invalid expression. 'case' or 'default' expected.`);
     return this;
   }

  public override getChildren(): Array<INode> {
    const result = [this.condition];
    this.cases.forEach(caseValue => result.push(caseValue));
    return result;
  }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!this.isValid(tokens)) return newParseExpressionFailed(SwitchExpression, `Not valid.`);

     if (tokens.length == 1) return newParseExpressionFailed(SwitchExpression, `No condition found`);

     let condition = tokens.tokensFrom(1);
     let conditionExpression = ExpressionFactory.parse(condition, source.line);
     if (conditionExpression.state != 'success') return conditionExpression;

     let reference = source.createReference();

     let expression = new SwitchExpression(conditionExpression.result, source, reference);

     return newParseExpressionSuccess(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.isKeyword(0, Keywords.Switch);
   }

   protected override validate(context: IValidationContext): void {
     let type = this.condition.deriveType(context);
     if (type == null
       || type.variableTypeName != "PrimitiveType" && type.variableTypeName != "EnumType") {
       context.logger.fail(this.reference,
         `'Switch' condition expression should have a primitive or enum type. Not: '${type}'.`);
       return;
     }

     this.cases.forEach(caseExpression => {
       if (caseExpression.IsDefault) return;

       let caseType = caseExpression.deriveType(context);
       if (caseType == null || !type?.equals(caseType))
         context.logger.fail(this.reference,
           `'case' condition expression should be of type '${type}', is of wrong type '${caseType}'.`);
     });
   }

   public linkElse(caseExpression: CaseExpression): void {
     cases.Add(caseExpression);
   }

   public override deriveType(context: IValidationContext): VariableType | null {
     return null;
   }
}
