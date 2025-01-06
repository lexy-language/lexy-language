import {IParsableNode, ParsableNode} from "./parsableNode";
import {SourceReference} from "../parser/sourceReference";
import {IParseLineContext} from "../parser/ParseLineContext";
import {INode} from "./node";
import {IValidationContext} from "../parser/validationContext";
import {NodeType} from "./nodeType";

export class Comments extends ParsableNode {

  private readonly lines: Array<string> = [];

  public nodeType = NodeType.Comments;

   constructor(sourceReference: SourceReference) {
     super(sourceReference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let valid = context.validateTokens("Comments")
       .count(1)
       .comment(0)
       .isValid;

     if (!valid) return this;

     let comment = context.line.tokens.tokenValue(0);
     if (comment != null) {
       this.lines.push(comment);
     }
     return this;
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
   }

}
