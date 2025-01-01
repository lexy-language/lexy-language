

export class TableRowType extends ComplexTypeReference {
   public string TableName
   public ComplexType ComplexType

   public TableRowType(string tableName, ComplexType complexType) : base(tableName) {
     TableName = tableName ?? throw new Error(nameof(tableName));
     ComplexType = complexType;
   }

   public override getComplexType(context: IValidationContext): ComplexType {
     return ComplexType;
   }

   public override memberType(name: string, context: IValidationContext): VariableType {
     return ComplexType.MemberType(name, context);
   }
}
