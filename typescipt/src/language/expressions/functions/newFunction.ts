import {IHasNodeDependencies} from "../../IHasNodeDependencies";
import {ExpressionFunction} from "./expressionFunction";
import {Expression} from "../expression";
import {MemberAccessLiteral} from "../../../parser/tokens/memberAccessLiteral";
import {asComplexTypeReference, ComplexTypeReference} from "../../variableTypes/complexTypeReference";
import {SourceReference} from "../../../parser/sourceReference";
import {asMemberAccessExpression} from "../memberAccessExpression";
import {RootNodeList} from "../../rootNodeList";
import {IRootNode} from "../../rootNode";
import {INode} from "../../node";
import {IValidationContext} from "../../../parser/validationContext";
import {VariableType} from "../../variableTypes/variableType";
import {NodeType} from "../../nodeType";

export class NewFunction extends ExpressionFunction implements IHasNodeDependencies {

  private typeValue: ComplexTypeReference;

  public readonly hasNodeDependencies = true;
  public readonly nodeType = NodeType.NewFunction;

  public static readonly name: string = `new`;

  protected get functionHelp() {
    return `${NewFunction.name} expects 1 argument (Function.Parameters)`;
  }

  public typeLiteral: MemberAccessLiteral;

  public valueExpression: Expression;

  public get type(): ComplexTypeReference {
    return this.typeValue;
  }

  constructor(valueExpression: Expression, reference: SourceReference) {
    super(reference);
    this.valueExpression = valueExpression;

    const memberAccessExpression = asMemberAccessExpression(valueExpression);
    if (memberAccessExpression == null) throw new Error("valueExpression should be MemberAccessExpression");
    this.typeLiteral = memberAccessExpression.memberAccessLiteral;
  }

  public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
    let rootNode = this.typeValue ? rootNodeList.getNode(this.typeValue.name) : null;
    return rootNode != null ? [rootNode] : [];
  }

  public static create(reference: SourceReference, expression: Expression): ExpressionFunction {
    return new NewFunction(expression, reference);
  }

  public override getChildren(): Array<INode> {
    return [this.valueExpression];
  }

  protected override validate(context: IValidationContext): void {
    const valueType = this.valueExpression.deriveType(context);
    const complexTypeReference = asComplexTypeReference(valueType);
    if (complexTypeReference == null) {
      context.logger.fail(this.reference,
        `Invalid argument 1 'Value' should be of type 'ComplexTypeType' but is 'ValueType'. ${this.functionHelp}`);
      return;
    }

    this.typeValue = complexTypeReference;
  }

  public override deriveReturnType(context: IValidationContext): VariableType | null {
    let nodeType = context.rootNodes.getType(this.typeLiteral.parent);
    let typeReference = nodeType?.memberType(this.typeLiteral.member, context) as ComplexTypeReference;
    let complexType = typeReference?.getComplexType(context);
    return !!complexType ? complexType : null;
  }
}
