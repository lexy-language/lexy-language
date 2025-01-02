import {IHasNodeDependencies} from "../../IHasNodeDependencies";
import {ExpressionFunction} from "./expressionFunction";
import {Mapping} from "./mapping";
import {MemberAccessLiteral} from "../../../parser/tokens/memberAccessLiteral";
import {asComplexTypeReference, ComplexTypeReference} from "../../types/complexTypeReference";
import {Expression} from "../expression";
import {SourceReference} from "../../../parser/sourceReference";
import {IValidationContext} from "../../../parser/ValidationContext";
import {asMemberAccessExpression} from "../memberAccessExpression";
import {RootNodeList} from "../../rootNodeList";
import {IRootNode} from "../../rootNode";
import {INode} from "../../node";
import {ComplexType} from "../../types/complexType";
import {VariableType} from "../../types/variableType";
import {Function} from "../../functions/function";

export class FillParametersFunction extends ExpressionFunction implements IHasNodeDependencies {

   public readonly name = `fill`;

  public readonly nodeType = "FillParametersFunction";

  protected get functionHelp() {
    return `${this.name} expects 1 argument (Function.Parameters)`;
  }

   public readonly typeLiteral: MemberAccessLiteral | undefined;
  public readonly valueExpression: Expression;

   public type: ComplexTypeReference;

  public readonly mapping: Array<Mapping> = [];

   constructor(valueExpression: Expression, reference: SourceReference) {
     super(reference);
     this.valueExpression = valueExpression;

     const memberAccessExpression = asMemberAccessExpression(valueExpression);
     this.typeLiteral = memberAccessExpression?.memberAccessLiteral;
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     const rootNode = rootNodeList.getNode(this.type.name);
     return rootNode != null ? [rootNode] : [];
   }

   public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
     return new FillParametersFunction(expression, reference);
   }

   public override getChildren(): Array<INode> {
     return [this.valueExpression];
   }

   protected override validate(context: IValidationContext): void {
     const valueType = this.valueExpression.deriveType(context);
     const complexTypeReference = asComplexTypeReference(valueType);
     if (complexTypeReference == null) {
       context.logger.fail(this.reference,
         `Invalid argument 1 'Value' should be of type 'ComplexTypeReference' but is '${valueType}'. ${this.functionHelp}`);
       return;
     }

     this.type = complexTypeReference;

     const complexType = complexTypeReference.getComplexType(context);

     if (complexType == null) return;

     FillParametersFunction.getMapping(this.reference, context, complexType, this.mapping);
   }

   public static getMapping(reference: SourceReference, context: IValidationContext, complexType: ComplexType,
     mapping: Array<Mapping>): void {

     for (const member of complexType.members) {
       let variable = context.variableContext.getVariable(member.name);
       if (variable == null) continue;

       if (!variable.variableType.equals(member.type)) {
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

   public override deriveReturnType(context: IValidationContext): VariableType | null {

     if (this.typeLiteral == undefined) return null;
     let functionValue = context.rootNodes.getFunction(this.typeLiteral.parent);
     if (functionValue == null) return null;

     if (this.typeLiteral.member == Function.parameterName) {
       return functionValue.getParametersType(context);
     }
     if (this.typeLiteral.member == Function.parameterName) {
       return functionValue.getResultsType(context);
     }
     return null;
   }
}
