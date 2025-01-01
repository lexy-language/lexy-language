import {IValidationContext} from "../parser/validationContext";
import {SourceReference} from "../parser/sourceReference";
import {IRootNode} from "./RootNode";
import {nameOf} from "../infrastructure/nameOf";
import {ITypeWithMembers} from "./types/iTypeWithMembers";

export interface INode {
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

  public abstract nodeType: string;
  public abstract getChildren(): Array<INode>;

   protected validateNodeTree(context: IValidationContext, child: INode | null): void {
     if (child == null) throw new Error(`(${this.nodeType}) Child is null`);

     const rootNode = nameOf<IRootNode>("isRootNode") in this ? child as IRootNode : null;
     if (rootNode != null) {
       context.logger.setCurrentNode(rootNode);
     }

     child.validateTree(context);

     const thisAsRootNode = nameOf<IRootNode>("isRootNode") in this ? this as IRootNode : null;
     if (thisAsRootNode != null) {
       context.logger.setCurrentNode(thisAsRootNode);
     }
   }

   protected abstract validate(context: IValidationContext): void;
}
