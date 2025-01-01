

export class Node extends INode {
   constructor(reference: SourceReference) {
     Reference = reference ?? throw new Error(nameof(reference));
   }

   public SourceReference Reference

   public validateTree(context: IValidationContext): void {
     Validate(context);

     let children = GetChildren();
     foreach (let child in children) ValidateNodeTree(context, child);
   }

   public abstract getChildren(): Array<INode>;

   protected validateNodeTree(context: IValidationContext, child: INode): void {
     if (child == null) throw new Error($`({GetType().Name}) Child is null`);

     if (child is IRootNode node) context.Logger.SetCurrentNode(node);

     child.ValidateTree(context);

     if (this is IRootNode) context.Logger.SetCurrentNode(this as IRootNode);
   }

   protected abstract validate(context: IValidationContext): void;
}
