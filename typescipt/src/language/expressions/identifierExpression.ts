import type {INode} from "../node";
import type {IValidationContext} from "../../parser/validationContext";
import type {IExpressionFactory} from "./expressionFactory";

import {Expression} from "./Expression";
import {VariableSource} from "../variableSource";
import {ExpressionSource} from "./expressionSource";
import {SourceReference} from "../../parser/sourceReference";
import {newParseExpressionFailed, newParseExpressionSuccess, ParseExpressionResult} from "./parseExpressionResult";
import {TokenList} from "../../parser/tokens/tokenList";
import {StringLiteralToken} from "../../parser/tokens/stringLiteralToken";
import {VariableType} from "../variableTypes/variableType";
import {NodeType} from "../nodeType";

export function asIdentifierExpression(object: any): IdentifierExpression | null {
  return object?.nodeType == NodeType.IdentifierExpression ? object as IdentifierExpression : null;
}

export class IdentifierExpression extends Expression {

  private variableSourceValue: VariableSource;

  public readonly nodeType = NodeType.IdentifierExpression;
  public readonly identifier: string;

  public get variableSource() {
    return this.variableSourceValue;
  }

  constructor(identifier: string, source: ExpressionSource, reference: SourceReference) {
    super(source, reference);
    this.identifier = identifier;
  }

  public static parse(source: ExpressionSource, factory: IExpressionFactory): ParseExpressionResult {
    let tokens = source.tokens;
    if (!IdentifierExpression.isValid(tokens)) return newParseExpressionFailed("IdentifierExpression", `Invalid expression`);

    let variableName = tokens.tokenValue(0);
    if (!variableName) return newParseExpressionFailed("IdentifierExpression",`Invalid token`);

    let reference = source.createReference();

    let expression = new IdentifierExpression(variableName, source, reference);

    return newParseExpressionSuccess(expression);
  }

  public static isValid(tokens: TokenList): boolean {
    return tokens.length == 1
      && tokens.isTokenType<StringLiteralToken>(0, StringLiteralToken);
  }

  public override getChildren(): Array<INode> {
    return [];
  }

  protected override validate(context: IValidationContext): void {
    if (!context.variableContext.ensureVariableExists(this.reference, this.identifier)) return;

    let variableSource = context.variableContext.getVariableSource(this.identifier);
    if (variableSource == null) {
      context.logger.fail(this.reference, `Can't define source of variable: ${this.identifier}`);
      return;
    }

    this.variableSourceValue = variableSource;
  }

  public override deriveType(context: IValidationContext): VariableType | null {
    return context.variableContext.getVariableTypeByName(this.identifier);
  }
}
