import type {IParsableNode} from "../parsableNode";
import type {IParseLineContext} from "../../parser/ParseLineContext";
import type {IValidationContext} from "../../parser/validationContext";

import {ParsableNode} from "../parsableNode";
import {SourceReference} from "../../parser/sourceReference";
import {QuotedLiteralToken} from "../../parser/tokens/quotedLiteralToken";
import {INode} from "../node";

export class ScenarioExpectError extends ParsableNode {
  private messageValue: string | null;

  public readonly nodeType: "ScenarioExpectError";

  public get message(): string | null {
     return this.messageValue;
   }

   public get hasValue(): boolean {
    return this.messageValue != null;
   }

   constructor(reference: SourceReference) {
     super(reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let line = context.line;

     let valid = context.validateTokens("ScenarioExpectError")
       .count(2)
       .keyword(0)
       .quotedString(1)
       .isValid;

     if (!valid) return this;

     const token = line.tokens.token<QuotedLiteralToken>(1, QuotedLiteralToken);
     if (token == null) throw new Error("No token.")

     this.messageValue = token.value;
     return this;
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
   }
}
