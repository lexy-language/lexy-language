

export class FunctionResult {
   private readonly object valueObject;

   constructor(valueObject: object) {
     this.valueObject = valueObject;
   }

   public number(name: string): decimal {
     let value = GetValue(new VariableReference(name));
     return (decimal)value;
   }

   private getField(parentbject: object, name: string): FieldInfo {
     let type = parentbject.GetType();
     let field = type.GetField(name, BindingFlags.Instance | BindingFlags.Public);
     if (field == null) throw new Error($`Couldn't find field: '{name}' on type: '{type.Name}'`);
     return field;
   }

   public getValue(expectedVariable: VariableReference): object {
     let currentReference = expectedVariable;
     let currentValue = GetField(valueObject, expectedVariable.ParentIdentifier).GetValue(valueObject);
     while (currentReference.HasChildIdentifiers) {
       currentReference = currentReference.childrenReference();
       currentValue = GetField(currentValue, currentReference.ParentIdentifier).GetValue(currentValue);
     }

     return currentValue;
   }
}
