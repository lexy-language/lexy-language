

export class TableType extends TypeWithMembers {
   public string Type
   public Table Table

   constructor(type: string, table: Table) {
     Type = type;
     Table = table;
   }

   protected equals(other: TableType): boolean {
     return Type == other.Type;
   }

   public override equals(obj: object): boolean {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() != GetType()) return false;
     return Equals((TableType)obj);
   }

   public override getHashCode(): number {
     return Type != null ? Type.GetHashCode() : 0;
   }

   public override toString(): string {
     return Type;
   }

   public override memberType(name: string, context: IValidationContext): VariableType {
     return name switch {
       `Count` => PrimitiveType.number,
       Table.RowName => TableRowType(context),
       _ => null
     };
   }

   private tableRowType(context: IValidationContext): TableRowType {
     let complexType = context.RootNodes.GetTable(Type)?.GetRowType(context);
     return new TableRowType(Type, complexType);
   }

   private getMembers(context: IValidationContext): Array<ComplexTypeMember> {
     return Table.Header.Columns.Select(column =>
         new ComplexTypeMember(column.Name, column.Type.createVariableType(context)))
       .ToList();
   }
}
