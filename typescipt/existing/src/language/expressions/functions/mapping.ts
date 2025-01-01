


namespace Lexy.Compiler.Language.Expressions.Functions;

public class Mapping
{
   public string VariableName { get; }
   public VariableType VariableType { get; }
   public VariableSource VariableSource { get; }

   public Mapping(string variableName, VariableType variableType, VariableSource variableSource)
   {
     VariableName = variableName;
     VariableType = variableType;
     VariableSource = variableSource;
   }
}
