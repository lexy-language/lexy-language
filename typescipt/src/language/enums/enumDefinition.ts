import {RootNode} from "../rootNode";
import {EnumName} from "./enumName";
import {EnumMember} from "./enumMember";
import {SourceReference} from "../../parser/sourceReference";
import {NodeName} from "../../parser/nodeName";
import {IParsableNode} from "../parsableNode";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {any, lastOrDefault} from "../../infrastructure/enumerableExtensions";
import {INode} from "../node";
import {IValidationContext} from "../../parser/validationContext";
import {DuplicateChecker} from "../duplicateChecker";

export function instanceOfEnumDefinition(object: any) {
  return object?.nodeType == "EnumDefinition";
}

export function asEnumDefinition(object: any): EnumDefinition | null {
  return instanceOfEnumDefinition(object) ? object as EnumDefinition : null;
}

export class EnumDefinition extends RootNode {

  public name: EnumName

  public nodeType = "EnumDefinition";

   public override get nodeName() {
     return this.name.value;
   }

   public readonly members: Array<EnumMember> = [];

   constructor(name: string, reference: SourceReference) {
     super(reference);
     this.name = new EnumName(reference);
     this.name.parseName(name);
   }

   public static parse(name: NodeName, reference: SourceReference): EnumDefinition {
     return new EnumDefinition(name.Name, reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let lastIndex = lastOrDefault(this.members)?.numberValue ?? -1;
     let member = EnumMember.parse(context, lastIndex);
     if (member != null) this.members.push(member);
     return this;
   }

   public override getChildren(): Array<INode> {
     return [this.name, ...this.members];
   }

   protected override validate(context: IValidationContext): void {
     if (this.members.length == 0) {
       context.logger.fail(this.reference, `Enum has no members defined.`);
       return;
     }

     DuplicateChecker.validate(
       context,
       member => member.reference,
       member => member.name,
       member => `Enum member name should be unique. Duplicate name: '${member.name}'`,
       this.members);
   }

   public containsMember(name: string): boolean {
     return any(this.members, member => member.name == name);
   }
}
