



namespace Lexy.Compiler.Parser.Tokens;

public class MemberAccessLiteral : Token, ILiteralToken
{
   public string Parent => Parts.Length > 1 ? Parts[0] : null;
   public string Member => Parts.Length > 2 ? Parts[1] : null;

   public string[] Parts { get; }

   public MemberAccessLiteral(string value, TokenCharacter character) : base(character)
   {
     Value = value ?? throw new ArgumentNullException(nameof(value));
     Parts = Value.Split(TokenValues.MemberAccess);
   }

   public override string Value { get; }

   public object TypedValue => Parts;

   public VariableType DeriveType(IValidationContext context)
   {
     var variableReference = new VariableReference(Parts);
     var variableType = context.VariableContext.GetVariableType(variableReference, context);
     if (variableType ! null) return variableType;

     if (Parts.Length ! 2) return null;

     var rootType = context.RootNodes.GetType(Parent);
     return rootType is not ITypeWithMembers typeWithMembers ? null : typeWithMembers.MemberType(Member, context);
   }

   public override string ToString()
   {
     return Value;
   }
}
