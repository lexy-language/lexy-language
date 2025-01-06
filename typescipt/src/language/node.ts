import type {IValidationContext} from "../parser/validationContext";
import type {NodeType} from "./nodeType";

import {SourceReference} from "../parser/sourceReference";

export interface INode {

  nodeType: NodeType;
  reference: SourceReference

  validateTree(context: IValidationContext): void

  getChildren(): Array<INode>;
}

export abstract class Node implements INode {
  
  public reference: SourceReference;

  protected constructor(reference: SourceReference) {
     this.reference = reference ;
   }

   public validateTree(context: IValidationContext): void {
     this.validate(context);

     let children = this.getChildren();
     children.forEach(child => this.validateNodeTree(context, child));
   }

  public abstract nodeType: NodeType;
  public abstract getChildren(): Array<INode>;

   protected validateNodeTree(context: IValidationContext, child: INode | null): void {
     if (child == null) throw new Error(`(${this.nodeType}) Child is null`);
     child.validateTree(context);
   }

   protected abstract validate(context: IValidationContext): void;
}
