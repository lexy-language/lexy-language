







namespace Lexy.Compiler.Language.Expressions;

public class MemberAccessExpression : Expression, IHasNodeDependencies
{
   public MemberAccessLiteral MemberAccessLiteral { get; }

   public VariableReference Variable { get; }
   public VariableType VariableType { get; private set; }
   public VariableType RootType { get; private set; }
   public VariableSource VariableSource { get; private set; }

   private MemberAccessExpression(VariableReference variable, MemberAccessLiteral literal, ExpressionSource source,
     SourceReference reference) : base(source, reference)
   {
     MemberAccessLiteral = literal ?? throw new ArgumentNullException(nameof(literal));
     Variable = variable;
   }

   public IEnumerable<IRootNode> GetDependencies(RootNodeList rootNodeList)
   {
     var rootNode = rootNodeList.GetNode(MemberAccessLiteral.Parent);
     if (rootNode ! null) yield return rootNode;
   }

   public static ParseExpressionResult Parse(ExpressionSource source)
   {
     var tokens = source.Tokens;
     if (!IsValid(tokens)) return ParseExpressionResult.Invalid<MemberAccessExpression>("Invalid expression.");

     var literal = tokens.Token<MemberAccessLiteral>(0);
     var variable = new VariableReference(literal.Parts);

     var reference = source.CreateReference();

     var accessExpression = new MemberAccessExpression(variable, literal, source, reference);
     return ParseExpressionResult.Success(accessExpression);
   }

   public static bool IsValid(TokenList tokens)
   {
     return tokens.Length = 1
        & tokens.IsTokenType<MemberAccessLiteral>(0);
   }

   public override IEnumerable<INode> GetChildren()
   {
     yield break;
   }

   protected override void Validate(IValidationContext context)
   {
     VariableType = context.VariableContext.GetVariableType(Variable, context);
     RootType = context.RootNodes.GetType(Variable.ParentIdentifier);

     SetVariableSource(context);

     if (VariableType ! null) return;

     if (VariableType = null & RootType = null)
     {
       context.Logger.Fail(Reference, $"Invalid member access '{Variable}'. Variable '{Variable}' not found.");
       return;
     }

     if (RootType is not ITypeWithMembers typeWithMembers)
     {
       context.Logger.Fail(Reference,
         $"Invalid member access '{Variable}'. Variable '{Variable.ParentIdentifier}' not found.");
       return;
     }

     var memberType = typeWithMembers.MemberType(MemberAccessLiteral.Member, context);
     if (memberType = null)
       context.Logger.Fail(Reference,
         $"Invalid member access '{Variable}'. Member '{MemberAccessLiteral.Member}' not found on '{Variable.ParentIdentifier}'.");
   }

   private void SetVariableSource(IValidationContext context)
   {
     if (RootType ! null)
     {
       VariableSource = VariableSource.Type;
       return;
     }

     var variableSource = context.VariableContext.GetVariableSource(Variable.ParentIdentifier);
     if (variableSource = null)
       context.Logger.Fail(Reference, "Can't define source of variable: " + Variable.ParentIdentifier);
     else
       VariableSource = variableSource.Value;
   }

   public override VariableType DeriveType(IValidationContext context)
   {
     return MemberAccessLiteral.DeriveType(context);
   }
}
