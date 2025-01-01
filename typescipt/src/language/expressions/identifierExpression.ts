import {Expression} from "./Expression";

export class IdentifierExpression extends Expression {


  public nodeType: "IdentifierExpression"

  public VariableSource VariableSource { get; private set; }

   public string Identifier

   private IdentifierExpression(string identifier, ExpressionSource source, SourceReference reference) : base(source,
     reference) {
     Identifier = identifier;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!IsValid(tokens)) return newParseExpressionFailed(IdentifierExpression>(`Invalid expression`);

     let variableName = tokens.tokenValue(0);
     let reference = source.createReference();

     let expression = new IdentifierExpression(variableName, source, reference);

     return newParseExpressionSuccess(expression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.length == 1
        && tokens.isTokenType<StringLiteralToken>(0);
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
     if (!context.variableContext.ensureVariableExists(this.reference, Identifier)) return;

     let variableSource = context.variableContext.getVariableSource(Identifier);
     if (variableSource == null) {
       context.logger.fail(this.reference, `Can't define source of variable: ` + Identifier);
       return;
     }

     VariableSource = variableSource.Value;
   }

   public override deriveType(context: IValidationContext): VariableType {
     return context.variableContext.getVariableType(Identifier);
   }
}
