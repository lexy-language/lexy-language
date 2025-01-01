

export interface IVariableContext {
   void AddVariable(string variableName, VariableType type, VariableSource source);

   void RegisterVariableAndVerifyUnique(SourceReference reference, string variableName, VariableType type,
     VariableSource source);

   boolean EnsureVariableExists(SourceReference reference, string variableName);

   boolean Contains(string variableName);
   boolean Contains(VariableReference reference, IValidationContext context);

   VariableType GetVariableType(string variableName);
   VariableType GetVariableType(VariableReference reference, IValidationContext context);
   VariableSource? GetVariableSource(string variableName);

   VariableEntry GetVariable(string variableName);
}
