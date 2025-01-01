


namespace Lexy.Compiler.Parser;

public interface IVariableContext
{
   void AddVariable(string variableName, VariableType type, VariableSource source);

   void RegisterVariableAndVerifyUnique(SourceReference reference, string variableName, VariableType type,
     VariableSource source);

   bool EnsureVariableExists(SourceReference reference, string variableName);

   bool Contains(string variableName);
   bool Contains(VariableReference reference, IValidationContext context);

   VariableType GetVariableType(string variableName);
   VariableType GetVariableType(VariableReference reference, IValidationContext context);
   VariableSource? GetVariableSource(string variableName);

   VariableEntry GetVariable(string variableName);
}
