

export class FunctionType extends TypeWithMembers {
   public string Type
   public Function Function

   constructor(type: string, function: Function) {
     Type = type;
     Function = function;
   }

   protected equals(other: FunctionType): boolean {
     return Type == other.Type;
   }

   public override equals(obj: object): boolean {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.getType() != getType()) return false;
     return Equals((FunctionType)obj);
   }

   public override getHashCode(): number {
     return Type != null ? Type.GetHashCode() : 0;
   }

   public override toString(): string {
     return Type;
   }

   public override memberType(name: string, context: IValidationContext): VariableType {
     return name switch {
       Function.ParameterName => FunctionParametersType(context),
       Function.resultsName => FunctionResultsType(context),
       _ => null
     };
   }

   private functionParametersType(context: IValidationContext): FunctionParametersType {
     let complexType = context.rootNodes.GetFunction(Type)?.GetParametersType(context);
     return new FunctionParametersType(Type, complexType);
   }

   private functionResultsType(context: IValidationContext): FunctionResultsType {
     let complexType = context.rootNodes.GetFunction(Type)?.GetResultsType(context);
     return new FunctionResultsType(Type, complexType);
   }
}
