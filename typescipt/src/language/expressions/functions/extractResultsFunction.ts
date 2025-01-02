import {ExpressionFunction} from "./expressionFunction";
import {Mapping} from "./mapping";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {IdentifierExpression} from "../identifierExpression";
import {INode} from "../../node";
import {asComplexType, ComplexType} from "../../types/complexType";
import {IValidationContext} from "../../../parser/validationContext";
import {VariableSource} from "../../variableSource";
import {VariableType} from "../../types/variableType";
import {VoidType} from "../../types/voidType";

export class ExtractResultsFunction extends ExpressionFunction {

  public readonly nodeType = "ExtractResultsFunction";
   public readonly name: string  = `extract`;

  protected get functionHelp() {
    return `${this.name} expects 1 argument. extract(variable)`;
  }

   public functionResultVariable: string | null;
  public valueExpression: Expression;

  public readonly mapping: Array<Mapping> = [];

   constructor(valueExpression: Expression, reference: SourceReference) {
     super(reference);
     this.valueExpression = valueExpression;
     const identifierExpression = valueExpression as IdentifierExpression
     this.functionResultVariable = identifierExpression != null ? identifierExpression.identifier : null;
   }

   public override getChildren(): Array<INode> {
     return [this.valueExpression];
   }

   protected override validate(context: IValidationContext): void {
     if (this.functionResultVariable == null) {
       context.logger.fail(this.reference, `Invalid variable argument. ${(this.functionHelp)}`);
       return;
     }

     let variableType = context.variableContext.getVariableTypeByName(this.functionResultVariable);
     if (variableType == null) {
       context.logger.fail(this.reference, `Unknown variable: '${(this.functionResultVariable)}'. ${(this.functionHelp)}`);
       return;
     }

     const complexType = asComplexType(variableType);
     if (complexType == null) {
       context.logger.fail(this.reference,
         `Invalid variable type: '${this.functionResultVariable}'. ` +
         `Should be Function Results. ` +
         `Use new(Function.results) or fill(Function.results) to create new function results. ${this.functionHelp}`);
       return;
     }

     ExtractResultsFunction.getMapping(this.reference, context, complexType, this.mapping);
   }

   public static getMapping(reference: SourceReference, context: IValidationContext, complexType: ComplexType | null,
     mapping: Array<Mapping>): void {

     if (complexType == null) return;

    for (const member of complexType.members) {
      let variable = context.variableContext.getVariable(member.name);
      if (variable == null || variable.variableSource == VariableSource.Parameters) continue;

     if (!variable.variableType?.equals(member.type)) {
       context.logger.fail(reference,
         `Invalid parameter mapping. Variable '${member.name}' of type '${variable.variableType}' can't be mapped to parameter '${member.name}' of type '${member.type}'.`);
     } else {
        mapping.push(new Mapping(member.name, variable.variableType, variable.variableSource));
      }
    }

     if (mapping.length == 0) {
       context.logger.fail(reference,
         `Invalid parameter mapping. No parameter could be mapped from variables.`);
     }
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     return new VoidType();
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new ExtractResultsFunction(expression, reference);
   }
}