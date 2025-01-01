

export class VariableDefinition extends Node, IHasNodeDependencies {
   public Expression DefaultExpression
   public VariableSource Source
   public VariableDeclarationType Type
   public VariableType VariableType { get; private set; }
   public string Name

   private VariableDefinition(string name, VariableDeclarationType type,
     VariableSource Source, SourceReference reference, Expression defaultExpression = null) {
     super(reference);
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
     let line = context.line;
     let result = context.ValidateTokens<VariableDefinition>()
       .CountMinimum(2)
       .StringLiteral(0)
       .StringLiteral(1)
       .IsValid;

     if (!result) return null;

     let tokens = line.tokens;
     let name = tokens.tokenValue(1);
     let type = tokens.tokenValue(0);

     let variableType = VariableDeclarationType.parse(type, line.TokenReference(0));
     if (variableType == null) return null;

     if (tokens.length == 2) return new VariableDefinition(name, variableType, source, line.lineStartReference());

     if (tokens.Token<OperatorToken>(2).Type != OperatorType.Assignment) {
       context.logger.fail(line.TokenReference(2), `Invalid variable declaration token. Expected '='.`);
       return null;
     }

     if (tokens.length != 4) {
       context.logger.fail(line.lineEndReference(),
         `Invalid variable declaration. Expected literal token.`);
       return null;
     }

     let defaultValue = ExpressionFactory.parse(tokens.tokensFrom(3), line);
     if (context.failed(defaultValue, line.TokenReference(3))) return null;

     return new VariableDefinition(name, variableType, source, line.lineStartReference(), defaultValue.result);
   }

   public override getChildren(): Array<INode> {
     if (DefaultExpression != null) yield return DefaultExpression;
     yield return Type;
   }

   protected override validate(context: IValidationContext): void {
     VariableType = Type.createVariableType(context);

     context.variableContext.registerVariableAndVerifyUnique(this.reference, Name, VariableType, Source);

     context.ValidateTypeAndDefault(this.reference, Type, DefaultExpression);
   }
}
