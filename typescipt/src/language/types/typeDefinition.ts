import type {IValidationContext} from "../../parser/validationContext";
import type {IParseLineContext} from "../../parser/ParseLineContext";
import type {IParsableNode} from "../parsableNode";
import type {INode} from "../node";

import {RootNode} from "../rootNode";
import {TypeName} from "./typeName";
import {VariableDefinition} from "../variableDefinition";
import {SourceReference} from "../../parser/sourceReference";
import {NodeName} from "../../parser/nodeName";
import {VariableSource} from "../variableSource";

export function instanceOfTypeDefinition(object: any) {
  return object?.nodeType == "TypeDefinition";
}

export function asTypeDefinition(object: any): TypeDefinition | null {
  return instanceOfTypeDefinition(object) ? object as TypeDefinition : null;
}

export class TypeDefinition extends RootNode {

  private variablesValue: Array<VariableDefinition> = [];

  public readonly nodeType = "TypeDefinition";

  public name: TypeName = new TypeName();

  public get variables(): ReadonlyArray<VariableDefinition> {
    return this.variablesValue;
  }

   public override get nodeName() {
     return this.name.value;
   }

   constructor(name: string , reference: SourceReference) {
     super(reference);
     this.name.parseName(name);
   }

   public static parse(name: NodeName, reference: SourceReference): TypeDefinition {
     return new TypeDefinition(name.Name, reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let variableDefinition = VariableDefinition.parse(VariableSource.Parameters, context);
     if (variableDefinition != null) this.variablesValue.push(variableDefinition);
     return this;
   }

   public override getChildren(): Array<INode> {
     return [...this.variables];
   }

   protected override validate(context: IValidationContext): void {
   }

   public override validateTree(context: IValidationContext): void {
     const scope = context.createVariableScope();
     try {
       super.validateTree(context);
     }
     finally {
       scope[Symbol.dispose]();
     }
   }
}
