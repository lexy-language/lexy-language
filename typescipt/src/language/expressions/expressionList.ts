import {Expression} from "./expression";
import {INode, Node} from "../node";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {ParseExpressionResult} from "./parseExpressionResult";
import {ExpressionFactory} from "./expressionFactory";
import { asDependantExpression} from "./IDependantExpression";

export class ExpressionList extends Node {

   private readonly values: Array<Expression> = [];

  public nodeType: "ExpressionList";

  public get length(): number {
     return this.values.length;
   }

   constructor(reference: SourceReference) {
     super(reference);
   }

  public asArray(): Array<Expression> {
     return this.values;
  }
  public get(index: number): Expression {
    return this.values[index];
  }

   public override getChildren(): Array<INode> {
     return this.values;
   }

   protected override validate(context: IValidationContext): void {
   }

   public override validateTree(context: IValidationContext): void {
     const scope = context.createVariableScope();
     try {
       super.validateTree(context);
     } finally {
       scope[Symbol.dispose]();
     }
   }

   public parse(context: IParseLineContext): ParseExpressionResult {
     let line = context.line;
     let expression = ExpressionFactory.parse(line.tokens, line);
     if (expression.state != 'success') {
       context.logger.fail(line.lineStartReference(), expression.errorMessage);
       return expression;
     }

     this.add(expression.result, context);
     return expression;
   }

   private add(expression: Expression, context: IParseLineContext): void {
     const childExpression = asDependantExpression(expression);
     if (childExpression != null) {
       const lastOrDefault = this.values.length > 0 ? this.values[this.values.length - 1] : null;
       childExpression.linkPreviousExpression(lastOrDefault, context);
     } else {
       this.values.push(expression);
     }
   }
}
