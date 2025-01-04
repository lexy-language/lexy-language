import type {IRootNode} from "../rootNode";
import type {INode} from "../node";
import type {IValidationContext} from "../../parser/validationContext";
import type {IExpressionFactory} from "./expressionFactory";
import type {IHasNodeDependencies} from "../IHasNodeDependencies";

import {Expression} from "./Expression";
import {VariableReference} from "../../runTime/variableReference";
import {VariableType} from "../variableTypes/variableType";
import {SourceReference} from "../../parser/sourceReference";
import {ExpressionSource} from "./expressionSource";
import {MemberAccessLiteral} from "../../parser/tokens/memberAccessLiteral";
import {VariableSource} from "../variableSource"
import {RootNodeList} from "../rootNodeList";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {TokenList} from "../../parser/tokens/tokenList";
import {asTypeWithMembers} from "../variableTypes/ITypeWithMembers";

export function asMemberAccessExpression(object: any): MemberAccessExpression | null {
  return object.nodeType == "MemberAccessExpression" ? object as MemberAccessExpression : null;
}

export class MemberAccessExpression extends Expression implements IHasNodeDependencies {

  public readonly hasNodeDependencies: true;
  public nodeType = "MemberAccessExpression";

  public readonly memberAccessLiteral: MemberAccessLiteral;
  public readonly variable: VariableReference;

  public variableSource: VariableSource;
  public variableType: VariableType | null;
  public rootType: VariableType | null;

  constructor(variable: VariableReference, literal: MemberAccessLiteral, source: ExpressionSource, reference: SourceReference) {
    super(source, reference);
    this.memberAccessLiteral = literal;
    this.variable = variable;
  }

  public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
    let rootNode = rootNodeList.getNode(this.memberAccessLiteral.parent);
    return rootNode != null ? [rootNode] : [];
  }

  public static parse(source: ExpressionSource, factory: IExpressionFactory): ParseExpressionResult {
    let tokens = source.tokens;
    if (!MemberAccessExpression.isValid(tokens)) return newParseExpressionFailed("MemberAccessExpression", `Invalid expression.`);

    let literal = tokens.token<MemberAccessLiteral>(0, MemberAccessLiteral);
    if (!literal) return newParseExpressionFailed("MemberAccessExpression", `Invalid expression.`);

    let variable = new VariableReference(literal.parts);
    let reference = source.createReference();

    let accessExpression = new MemberAccessExpression(variable, literal, source, reference);
    return newParseExpressionSuccess(accessExpression);
  }

  public static isValid(tokens: TokenList): boolean {
    return tokens.length == 1
      && tokens.isTokenType<MemberAccessLiteral>(0, MemberAccessLiteral);
  }

  public override getChildren(): Array<INode> {
    return [];
  }

  protected override validate(context: IValidationContext): void {
    this.variableType = context.variableContext.getVariableType(this.variable, context);
    this.rootType = context.rootNodes.getType(this.variable.parentIdentifier);

    this.setVariableSource(context);

    if (this.variableType != null) return;

    if (this.variableType == null && this.rootType == null) {
      context.logger.fail(this.reference, `Invalid member access '${this.variable}'. Variable '{this.variable}' not found.`);
      return;
    }

    const typeWithMembers = asTypeWithMembers(this.rootType);
    if (typeWithMembers == null) {
      context.logger.fail(this.reference,
        `Invalid member access '${this.variable}'. Variable '${this.variable.parentIdentifier}' not found.`);
      return;
    }

    let memberType = typeWithMembers.memberType(this.memberAccessLiteral.member, context);
    if (memberType == null)
      context.logger.fail(this.reference,
        `Invalid member access '${this.variable}'. Member '${this.memberAccessLiteral.member}' not found on '${this.variable.parentIdentifier}'.`);
  }

  private setVariableSource(context: IValidationContext): void {
    if (this.rootType != null) {
      this.variableSource = VariableSource.Type;
      return;
    }

    let variableSource = context.variableContext.getVariableSource(this.variable.parentIdentifier);
    if (variableSource == null) {
      context.logger.fail(this.reference, `Can't define source of variable: ${this.variable.parentIdentifier}`);
    } else {
      this.variableSource = variableSource;
    }
  }

  public override deriveType(context: IValidationContext): VariableType | null {
    return this.memberAccessLiteral.deriveType(context);
  }
}
