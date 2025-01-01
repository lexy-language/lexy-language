

export class ParsableNode extends Node, IParsableNode {
   protected ParsableNode(SourceReference reference) : base(reference) {
   }

   public abstract parse(context: IParseLineContext): IParsableNode;
}
