import {IParsableNode, ParsableNode} from "../parsableNode";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {QuotedLiteralToken} from "../../parser/tokens/quotedLiteralToken";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";

export class ScenarioExpectRootErrors extends ParsableNode {

   private readonly messagesValue: Array<string> = [];

  public readonly nodeType: "ScenarioExpectRootErrors";

  public get messages(): ReadonlyArray<string> {
     return this.messagesValue
   }

   public get hasValues(): boolean {
     return this.messages.length > 0;
   }

   constructor(reference: SourceReference) {
     super(reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let line = context.line;
     let valid = context.validateTokens("ScenarioExpectError")
       .count(1)
       .quotedString(0)
       .isValid;

     if (!valid) return this;

     const token = line.tokens.token<QuotedLiteralToken>(0, QuotedLiteralToken);
     if (token == null) throw new Error("No token found.");

     this.messagesValue.push(token.value);
     return this;
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
   }
}
