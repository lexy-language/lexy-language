import {VariableDeclarationType} from "../variableTypes/variableDeclarationType";
import {SourceReference} from "../../parser/sourceReference";
import {INode, Node} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {VariableDeclarationTypeParser} from "../variableTypes/variableDeclarationTypeParser";
import {NodeType} from "../nodeType";

export class ColumnHeader extends Node {

  public nodeType = NodeType.ColumnHeader;
   public name: string
   public type: VariableDeclarationType

   constructor(name: string, type: VariableDeclarationType, reference: SourceReference) {
     super(reference);
     this.name = name;
     this.type = type;
   }

   public static parse(name: string, typeName: string, reference: SourceReference): ColumnHeader {
     let type = VariableDeclarationTypeParser.parse(typeName, reference);
     return new ColumnHeader(name, type, reference);
   }

   public override getChildren(): Array<INode> {
     return [this.type];
   }

   protected override validate(context: IValidationContext): void {
   }
}
