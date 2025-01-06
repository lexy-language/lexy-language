import {VariableDeclarationType} from "./variableDeclarationType";
import {VariableType} from "./variableType";
import {SourceReference} from "../../parser/sourceReference";
import {IValidationContext} from "../../parser/validationContext";
import {INode} from "../node";
import {NodeType} from "../nodeType";
import {SwitchExpression} from "../expressions/switchExpression";


export function instanceOfImplicitVariableDeclaration(object: any): boolean {
  return object?.nodeType == NodeType.ImplicitVariableDeclaration;
}

export function asImplicitVariableDeclaration(object: any): ImplicitVariableDeclaration | null {
  return instanceOfImplicitVariableDeclaration(object) ? object as ImplicitVariableDeclaration : null;
}

export class ImplicitVariableDeclaration extends VariableDeclarationType {

  private variableTypeValue: VariableType;

  public nodeType = NodeType.ImplicitVariableDeclaration;

  public get variableType(): VariableType{
    return this.variableTypeValue;
  }

   constructor(reference: SourceReference) {
     super(reference);
   }

   public override createVariableType(context: IValidationContext): VariableType {
     return VariableType ??
        throw new Error(`Not supported. Nodes should be Validated first.`);
   }

   public define(variableType: VariableType): void {
     this.variableTypeValue = variableType;
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
   }
}
