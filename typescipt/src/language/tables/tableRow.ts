import type {IValidationContext} from "../../parser/validationContext";
import type {IParseLineContext} from "../../parser/ParseLineContext";
import type {INode} from "../node";

import {Node} from "../node";
import {Expression} from "../expressions/expression";
import {SourceReference} from "../../parser/sourceReference";
import {TableSeparatorToken} from "../../parser/tokens/tableSeparatorToken";
import {Token} from "../../parser/tokens/token";
import {TokenList} from "../../parser/tokens/tokenList";

export class TableRow extends Node {

  private readonly valuesValue: Array<Expression>;

  public readonly nodeType = "TableRow";

  public get values(): ReadonlyArray<Expression> {
    return this.valuesValue;
  }

   constructor(values: Expression[], reference: SourceReference) {
     super(reference);
     this.valuesValue = values;
   }

   public static parse(context: IParseLineContext): TableRow | null {
     let index = 0;
     let validator = context.validateTokens("TableRow");

     if (!validator.type<TableSeparatorToken>(index, TableSeparatorToken).isValid) return null;

     let tokens = new Array<Expression>();
     let currentLineTokens = context.line.tokens;
     while (++index < currentLineTokens.length) {
       let valid = !validator
         .isLiteralToken(index)
         .type<TableSeparatorToken>(index + 1, TableSeparatorToken)
         .isValid;

       if (valid) return null;

       let token = currentLineTokens.token<Token>(index++, Token);
       if (token == null) return null;

       let expression = context.expressionFactory.parse(new TokenList([token]), context.line);
       if (expression.state == "failed") {
         context.logger.fail(context.line.tokenReference(index), expression.errorMessage);
         return null;
       }

       tokens.push(expression.result);
     }

     return new TableRow(tokens, context.line.lineStartReference());
   }

   public override getChildren(): Array<INode> {
     return [...this.values];
   }

   protected override validate(context: IValidationContext): void {
   }
}
