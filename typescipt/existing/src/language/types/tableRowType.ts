


namespace Lexy.Compiler.Language.Types;

public class TableRowType : ComplexTypeReference
{
   public string TableName { get; }
   public ComplexType ComplexType { get; }

   public TableRowType(string tableName, ComplexType complexType) : base(tableName)
   {
     TableName = tableName ?? throw new ArgumentNullException(nameof(tableName));
     ComplexType = complexType;
   }

   public override ComplexType GetComplexType(IValidationContext context)
   {
     return ComplexType;
   }

   public override VariableType MemberType(string name, IValidationContext context)
   {
     return ComplexType.MemberType(name, context);
   }
}
