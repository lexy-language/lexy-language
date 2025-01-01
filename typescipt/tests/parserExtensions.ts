

export class ParserExtensions {
   public static parseNodes(parser: ILexyParser, code: string): RootNodeList {
     if (parser == null) throw new Error(nameof(parser));

     let codeLines = code.Split(Environment.NewLine);
     let context = parser.parse(codeLines, `tests.lexy`, false);

     return context.RootNodes;
   }

   public static parseFunction(parser: ILexyParser, code: string): Function {
     return parser.ParseNode<Function>(code);
   }

   public static parseTable(parser: ILexyParser, code: string): Table {
     return parser.ParseNode<Table>(code);
   }

   public static parseScenario(parser: ILexyParser, code: string): Scenario {
     return parser.ParseNode<Scenario>(code);
   }

   public static parseEnum(parser: ILexyParser, code: string): EnumDefinition {
     return parser.ParseNode<EnumDefinition>(code);
   }

   public static parseNode<T>(parser: ILexyParser, code: string): T where T : RootNode {
     if (parser == null) throw new Error(nameof(parser));

     let nodes = parser.ParseNodes(code);
     if (nodes.Count != 1) throw new Error(`Only 1 node expected. Actual: ` + nodes.Count);

     let first = nodes.First();
     if (!(first is T node))
       throw new Error($`Node not a {typeof(T).Name}. Actual: {first?.GetType()}`);

     return node;
   }
}
