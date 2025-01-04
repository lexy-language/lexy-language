import type {IParseLineContext} from "../../parser/ParseLineContext";
import type {IValidationContext} from "../../parser/validationContext";

import {Expression} from "../expressions/expression";
import {INode, Node} from "../node";
import {ConstantValue} from "./constantValue";
import {VariableReference} from "../../runTime/variableReference";
import {VariableType} from "../variableTypes/variableType";
import {SourceReference} from "../../parser/sourceReference";
import {OperatorToken} from "../../parser/tokens/operatorToken";
import {OperatorType} from "../../parser/tokens/operatorType";
import {VariableReferenceParser} from "./variableReferenceParser";

export class AssignmentDefinition extends Node {

  public readonly nodeType = "AssignmentDefinition";

   private readonly valueExpression: Expression;
   private readonly variableExpression: Expression;

   private variableTypeValue: VariableType;

   public readonly constantValue: ConstantValue;
   public readonly variable: VariableReference;

   public get variableType(): VariableType {
     return this.variableTypeValue;
   }

   constructor(variable: VariableReference, constantValue: ConstantValue, variableExpression: Expression,
     valueExpression: Expression, reference: SourceReference) {
     super(reference);

     this.variable = variable;
     this.constantValue = constantValue;

     this.variableExpression = variableExpression;
     this.valueExpression = valueExpression;
   }

   public static parse(context: IParseLineContext): AssignmentDefinition | null {
     const line = context.line;
     const tokens = line.tokens;
     const reference = line.lineStartReference();

     const assignmentIndex = tokens.find<OperatorToken>(token => token.type == OperatorType.Assignment, OperatorToken);
     if (assignmentIndex <= 0 || assignmentIndex == tokens.length - 1) {
       context.logger.fail(reference, `Invalid assignment. Expected: 'Variable = Value'`);
       return null;
     }

     const targetExpression = context.expressionFactory.parse(tokens.tokensFromStart(assignmentIndex), line);
     if (targetExpression.state == "failed") {
       context.logger.fail(reference, targetExpression.errorMessage);
       return null;
     }

     const valueExpression = context.expressionFactory.parse(tokens.tokensFrom(assignmentIndex + 1), line);
     if (valueExpression.state == "failed") {
       context.logger.fail(reference, valueExpression.errorMessage);
       return null;
     }

     const variableReference = VariableReferenceParser.parseExpression(targetExpression.result);
     if (variableReference.state == "failed") {
       context.logger.fail(reference, variableReference.errorMessage);
       return null;
     }

     const constantValue = ConstantValue.parse(valueExpression.result);
     if (constantValue.state == "failed") {
       context.logger.fail(reference, constantValue.errorMessage);
       return null;
     }

     return new AssignmentDefinition(variableReference.result, constantValue.result, targetExpression.result,
       valueExpression.result, reference);
   }

   public override getChildren(): Array<INode> {
     return [this.variableExpression, this.valueExpression];
   }

   protected override validate(context: IValidationContext): void {
     if (!context.variableContext.contains(this.variable, context))
       //logger by IdentifierExpressionValidation
       return;

     let expressionType = this.valueExpression.deriveType(context);

     VariableType = context.variableContext.getVariableType(this.variable, context);
     if (expressionType != null && !expressionType.equals(VariableType))
       context.logger.fail(this.reference,
         `Variable '${this.variable}' of type '${this.variableType}' is not assignable from expression of type '${this.expressionType}'.`);
   }
}
