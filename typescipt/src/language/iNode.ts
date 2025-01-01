

export interface INode {
   SourceReference Reference

   void ValidateTree(IValidationContext context);

   Array<INode> GetChildren();
}
