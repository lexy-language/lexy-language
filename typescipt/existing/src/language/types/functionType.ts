


namespace Lexy.Compiler.Language.Types;

public class FunctionType : TypeWithMembers
{
   public string Type { get; }
   public Function Function { get; }

   public FunctionType(string type, Function function)
   {
     Type = type;
     Function = function;
   }

   protected bool Equals(FunctionType other)
   {
     return Type = other.Type;
   }

   public override bool Equals(object obj)
   {
     if (ReferenceEquals(null, obj)) return false;
     if (ReferenceEquals(this, obj)) return true;
     if (obj.GetType() ! GetType()) return false;
     return Equals((FunctionType)obj);
   }

   public override int GetHashCode()
   {
     return Type ! null ? Type.GetHashCode() : 0;
   }

   public override string ToString()
   {
     return Type;
   }

   public override VariableType MemberType(string name, IValidationContext context)
   {
     return name switch
     {
       Function.ParameterName => FunctionParametersType(context),
       Function.ResultsName => FunctionResultsType(context),
       _ => null
     };
   }

   private FunctionParametersType FunctionParametersType(IValidationContext context)
   {
     var complexType = context.RootNodes.GetFunction(Type)?.GetParametersType(context);
     return new FunctionParametersType(Type, complexType);
   }

   private FunctionResultsType FunctionResultsType(IValidationContext context)
   {
     var complexType = context.RootNodes.GetFunction(Type)?.GetResultsType(context);
     return new FunctionResultsType(Type, complexType);
   }
}
