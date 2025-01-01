

export class VariableDefinition extends Node, IHasNodeDependencies {
   public Expression DefaultExpression
   public VariableSource Source
   public VariableDeclarationType Type
   public VariableType VariableType { get; private set; }
   public string Name

   private VariableDefinition(string name, VariableDeclarationType type,
     VariableSource Source, SourceReference reference, Expression defaultExpression = null) : base(reference) {
     Type = type ?? throw new Error(nameof(type));
     Name = name ?? throw new Error(nameof(name));

     DefaultExpression = defaultExpression;
     this.Source = Source;
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     if (VariableType is EnumType enumType) {
       yield return rootNodeList.GetEnum(enumType.Type);
       yield break;
     }

     if (VariableType is not CustomType customType) yield break;

     yield return customType.TypeDefinition;
   }

   public static parse(source: VariableSource, context: IParseLineContext): VariableDefinition {
     let line = context.Line;
     let result = context.ValidateTokens<VariableDefinition>()
       .CountMinimum(2)
       .StringLiteral(0)
       .StringLiteral(1)
       .IsValid;

     if (!result) return null;

     let tokens = line.Tokens;
     let name = tokens.TokenValue(1);
     let type = tokens.TokenValue(0);

     let variableType = VariableDeclarationType.Parse(type, line.TokenReference(0));
     if (variableType == null) return null;

     if (tokens.Length == 2) return new VariableDefinition(name, variableType, source, line.LineStartReference());

     if (tokens.Token<OperatorToken>(2).Type != OperatorType.Assignment) {
       context.Logger.Fail(line.TokenReference(2), `Invalid variable declaration token. Expected '='.`);
       return null;
     }

     if (tokens.Length != 4) {
       context.Logger.Fail(line.LineEndReference(),
         `Invalid variable declaration. Expected literal token.`);
       return null;
     }

     let defaultValue = ExpressionFactory.Parse(tokens.TokensFrom(3), line);
     if (context.Failed(defaultValue, line.TokenReference(3))) return null;

     return new VariableDefinition(name, variableType, source, line.LineStartReference(), defaultValue.Result);
   }

   public override getChildren(): Array<INode> {
     if (DefaultExpression != null) yield return DefaultExpression;
     yield return Type;
   }

   protected override validate(context: IValidationContext): void {
     VariableType = Type.CreateVariableType(context);

     context.VariableContext.RegisterVariableAndVerifyUnique(Reference, Name, VariableType, Source);

     context.ValidateTypeAndDefault(Reference, Type, DefaultExpression);
   }
}
