export class TypeNames
{
  public static readonly number: string = "number";
  public static readonly boolean: string = "boolean";
  public static readonly date: string = "date";
  public static readonly string: string = "string";

  private static readonly existing = [
    TypeNames.number,
    TypeNames.boolean,
    TypeNames.date,
    TypeNames.string
  ];

  public static contains(parameterType: string): boolean {
    return this.existing.indexOf(parameterType) > -1;
  }
}