export class Keywords
{
  public static readonly FunctionKeyword = "Function:";
  public static readonly EnumKeyword = "Enum:";
  public static readonly TableKeyword = "Table:";
  public static readonly TypeKeyword = "Type:";
  public static readonly ScenarioKeyword = "Scenario:";

  public static readonly Function = "Function";
  public static readonly ValidationTable = "ValidationTable";

  public static readonly If = "if";
  public static readonly Else = "else";
  public static readonly Switch = "switch";
  public static readonly Case = "case";
  public static readonly Default = "default";

  public static readonly For = "for";
  public static readonly From = "from";
  public static readonly To = "to";

  public static readonly While = "while";

  public static readonly Include = "Include";
  public static readonly Parameters = "Parameters";
  public static readonly Results = "Results";
  public static readonly Code = "Code";
  public static readonly ExpectError = "ExpectError";
  public static readonly ExpectRootErrors = "ExpectRootErrors";

  public static readonly ImplicitVariableDeclaration = "var";

  private static readonly values = [
    Keywords.FunctionKeyword,
    Keywords.EnumKeyword,
    Keywords.TableKeyword ,
    Keywords.TypeKeyword,
    Keywords.ScenarioKeyword,
    Keywords.Function,
    Keywords.ValidationTable,
    Keywords.If,
    Keywords.Else,
    Keywords.Switch,
    Keywords.Case,
    Keywords.Default,
    Keywords.For,
    Keywords.From,
    Keywords.To,
    Keywords.While,
    Keywords.Include,
    Keywords.Parameters,
    Keywords.Results,
    Keywords.Code,
    Keywords.ExpectError,
    Keywords.ExpectRootErrors,
    Keywords.ImplicitVariableDeclaration
  ];

  public static contains(keyword: string): boolean {
    return Keywords.values.findIndex(value => value == keyword) >= 0;
  }
}