import type {IRootNode} from "../rootNode";
import type {INode} from "../node";
import type {IExpressionFactory} from "../expressions/expressionFactory";
import type {IParseLineContext} from "../../parser/ParseLineContext";
import type {IParsableNode} from "../parsableNode";

import {RootNode} from "../rootNode";
import {asHasNodeDependencies, IHasNodeDependencies} from "../IHasNodeDependencies";
import {FunctionName} from "./functionName";
import {FunctionParameters} from "./functionParameters";
import {FunctionResults} from "./functionResults";
import {FunctionCode} from "./functionCode";
import {SourceReference} from "../../parser/sourceReference";
import {RootNodeList} from "../rootNodeList";
import {Keywords} from "../../parser/Keywords";
import {KeywordToken} from "../../parser/tokens/keywordToken";
import {contains} from "../../infrastructure/enumerableExtensions";
import {VariableDefinition} from "../variableDefinition";
import {asCustomVariableDeclarationType} from "../variableTypes/customVariableDeclarationType";
import {IValidationContext} from "../../parser/validationContext";
import {ComplexType} from "../variableTypes/complexType";
import {ComplexTypeMember} from "../variableTypes/complexTypeMember";
import {ComplexTypeSource} from "../variableTypes/complexTypeSource";
import {NodesWalker} from "../nodesWalker";

export function instanceOfFunction(object: any) {
  return object?.nodeType == "Function";
}

export function asFunction(object: any): Function | null {
  return instanceOfFunction(object) ? object as Function : null;
}

export class Function extends RootNode implements IHasNodeDependencies {

  public static readonly parameterName = `Parameters`;
  public static readonly resultsName = `Results`;

  public readonly hasNodeDependencies = true;
  public readonly nodeType = "Function";

  public readonly name: FunctionName;
  public readonly parameters: FunctionParameters;
  public readonly results: FunctionResults;
  public readonly code: FunctionCode;

  public override get nodeName() {
    return this.name.value;
  }

  constructor(name: string, reference: SourceReference, factory) {
    super(reference);
    this.name = new FunctionName(reference);
    this.parameters = new FunctionParameters(reference);
    this.results = new FunctionResults(reference);
    this.code = new FunctionCode(reference, factory);

    this.name.parseName(name);
  }

  public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
    let result = new Array<IRootNode>();
    this.addEnumTypes(rootNodeList, this.parameters.variables, result);
    this.addEnumTypes(rootNodeList, this.results.variables, result);
    return result;
  }

  public static create(name: string, reference: SourceReference, factory: IExpressionFactory): Function {
    return new Function(name, reference, factory);
  }

  public override parse(context: IParseLineContext): IParsableNode {
    let line = context.line;
    let name = line.tokens.tokenValue(0);
    if (!line.tokens.isTokenType<KeywordToken>(0, KeywordToken)) return this.invalidToken(name, context);

    switch (name) {
      case Keywords.Parameters:
        return this.parameters;
      case Keywords.Results:
        return this.results;
      case Keywords.Code:
        return this.code;
      default:
        return this.invalidToken(name, context)
    }
  }

  private invalidToken(name: string | null, parserContext: IParseLineContext): IParsableNode {
    parserContext.logger.fail(this.reference, `Invalid token '${name}'.`);
    return this;
  }

  public getFunctionAndDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
    let result: Array<IRootNode> = [this];
    this.addDependentNodes(this, rootNodeList, result);

    let processed = 0;
    while (processed != result.length) {
      processed = result.length;
      for (const node of result) {
        this.addDependentNodes(node, rootNodeList, result);
      }
    }

    return result;
  }

  private addDependentNodes(node: INode, rootNodeList: RootNodeList, result: Array<IRootNode>): void {
    this.addNodeDependencies(node, rootNodeList, result);

    let children = node.getChildren();

    NodesWalker.walkNodes(children, eachNode => this.addNodeDependencies(eachNode, rootNodeList, result));
  }

  private addNodeDependencies(node: INode, rootNodeList: RootNodeList, result: Array<IRootNode>): void {
    const hasDependencies = asHasNodeDependencies(node);
    if (hasDependencies == null) return;

    let dependencies = hasDependencies.getDependencies(rootNodeList);
    for (const dependency of dependencies) {
      if (!contains(result, dependency)) {
        result.push(dependency);
      }
    }
  }

  private addEnumTypes(rootNodeList: RootNodeList, variableDefinitions: ReadonlyArray<VariableDefinition>,
                       result: Array<IRootNode>) {
    for (const parameter of variableDefinitions) {

      const enumVariableType = asCustomVariableDeclarationType(parameter.type);
      if (enumVariableType == null) continue;

      let dependency = rootNodeList.getEnum(enumVariableType.type);
      if (dependency != null) result.push(dependency);
    }
  }

  public override validateTree(context: IValidationContext): void {
    const scope = context.createVariableScope();
    try {
      super.validateTree(context);
    } finally {
      scope[Symbol.dispose]();
    }
  }

  public override getChildren(): Array<INode> {
    return [
      this.name,
      this.parameters,
      this.results,
      this.code
    ];
  }

  protected override validate(context: IValidationContext): void {
  }

  public getParametersType(context: IValidationContext): ComplexType {
    let members = this.parameters.variables
      .map(parameter => new ComplexTypeMember(parameter.name, parameter.type.createVariableType(context)));

    return new ComplexType(this.name.value, ComplexTypeSource.FunctionParameters, members);
  }

  public getResultsType(context: IValidationContext): ComplexType {
    let members = this.results.variables
      .map(parameter => new ComplexTypeMember(parameter.name, parameter.type.createVariableType(context)));

    return new ComplexType(this.name.value, ComplexTypeSource.FunctionResults, members);
  }
}
