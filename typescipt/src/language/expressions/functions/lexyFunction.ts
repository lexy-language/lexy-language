import {ExpressionFunction} from "./expressionFunction";
import {IHasNodeDependencies} from "../../IHasNodeDependencies";
import {Expression} from "../expression";
import {Mapping} from "./mapping";
import {ComplexType} from "../../variableTypes/complexType";
import {SourceReference} from "../../../parser/sourceReference";
import {RootNodeList} from "../../rootNodeList";
import {IRootNode} from "../../rootNode";
import {INode} from "../../node";
import {IValidationContext} from "../../../parser/validationContext";
import {FillParametersFunction} from "./fillParametersFunction";
import {ExtractResultsFunction} from "./extractResultsFunction";
import {asIdentifierExpression} from "../identifierExpression";
import {VariableType} from "../../variableTypes/variableType";

export class LexyFunction extends ExpressionFunction implements IHasNodeDependencies {

  private variableNameValue: string | null
  private functionParametersTypeValue: ComplexType;
  private functionResultsTypeValue: ComplexType;

  public readonly hasNodeDependencies = true;
  public readonly nodeType = "LexyFunction";

  public readonly functionName: string
  public readonly argumentValues: Array<Expression>;

  public get variableName(): string | null {
    return this.variableNameValue;
  }

  private readonly mappingParameters: Array<Mapping> = [];
  private readonly mappingResults: Array<Mapping> = [];

   public get functionParametersType(): ComplexType {
     return this.functionParametersTypeValue;
   }
   public get functionResultsType(): ComplexType {
     return this.functionResultsTypeValue;
   }

   constructor(functionName: string, argumentValues: Array<Expression>, reference: SourceReference) {
     super(reference);
     this.functionName = functionName;
     this.argumentValues = argumentValues;
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     let functionNode = rootNodeList.getFunction(this.functionName);
     return functionNode != null ? [functionNode] : [];
   }

   public override getChildren(): Array<INode> {
     return [...this.argumentValues];
   }

   protected override validate(context: IValidationContext): void {
     let functionNode = context.rootNodes.getFunction(this.functionName);
     if (functionNode == null) {
       context.logger.fail(this.reference, `Invalid function name: '${this.functionName}'`);
       return;
     }

     if (this.argumentValues.length > 1) {
       context.logger.fail(this.reference, `Invalid function argument: '${this.functionName}'. Should be 0 or 1`);
       return;
     }

     if (this.argumentValues.length == 0) {
       FillParametersFunction.getMapping(this.reference, context, functionNode.getParametersType(context),
         this.mappingParameters);
       ExtractResultsFunction.getMapping(this.reference, context, functionNode.getResultsType(context), this.mappingResults);

       this.functionParametersTypeValue = functionNode.getParametersType(context);
       this.functionResultsTypeValue = functionNode.getResultsType(context);

       return;
     }

     let argumentType = this.argumentValues[0].deriveType(context);
     let parametersType = functionNode.getParametersType(context);

     if (argumentType == null || !argumentType.equals(parametersType)) {
       context.logger.fail(this.reference, `Invalid function argument: '${this.functionName}'. ` +
         `Argument should be of type function parameters. Use new(Function) of fill(Function) to create an variable of the function result type.`);
     }

    const identifierExpression = asIdentifierExpression(this.argumentValues[0]);
     this.variableNameValue = identifierExpression != null ? identifierExpression.identifier : null;
   }

   public override deriveReturnType(context: IValidationContext): VariableType {
     const functionNode = context.rootNodes.getFunction(this.functionName);
     return functionNode.getResultsType(context);
   }
}
