

export class Keywords {
   public const string FunctionKeyword = `Function:`;
   public const string EnumKeyword = `Enum:`;
   public const string TableKeyword = `Table:`;
   public const string TypeKeyword = `Type:`;
   public const string ScenarioKeyword = `Scenario:`;

   public const string Function = `Function`;
   public const string ValidationTable = `ValidationTable`;

   public const string If = `if`;
   public const string Else = `else`;
   public const string Switch = `switch`;
   public const string Case = `case`;
   public const string Default = `default`;

   public const string For = `for`;
   public const string From = `from`;
   public const string To = `to`;

   public const string While = `while`;

   public const string Include = `Include`;
   public const string Parameters = `Parameters`;
   public const string Results = `Results`;
   public const string Code = `Code`;
   public const string ExpectError = `ExpectError`;
   public const string ExpectRootErrors = `ExpectRootErrors`;

   public const string ImplicitVariableDeclaration = `let`;

   private static readonly Lazy<Array<string>> values new(): =;

   private static loadValues(): Array<string> {
     return typeof(Keywords).GetFields(BindingFlags.Public | BindingFlags.Static |
                      BindingFlags.FlattenHierarchy)
       .Where(field => field.IsLiteral && !field.IsInitOnly)
       .Select(field => (string)field.GetRawConstantValue())
       .ToList();
   }

   public static contains(keyword: string): boolean {
     return values.Value.Contains(keyword);
   }
}
