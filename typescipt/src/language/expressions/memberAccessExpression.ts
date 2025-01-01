import {Expression} from "./Expression";

export class MemberAccessExpression extends Expression, IHasNodeDependencies {

  public nodeType: "MemberAccessExpression"

  public MemberAccessLiteral MemberAccessLiteral

   public variable: VariableReference
   public VariableType VariableType { get; private set; }
   public VariableType RootType { get; private set; }
   public VariableSource VariableSource { get; private set; }

constructor(VariableReference variable, MemberAccessLiteral literal, ExpressionSource source,
     SourceReference reference) {
    {super(source, reference) {
     MemberAccessLiteral = literal ?? throw new Error(nameof(literal));
     Variable = variable;
   }

   public getDependencies(rootNodeList: RootNodeList): Array<IRootNode> {
     let rootNode = rootNodeList.GetNode(MemberAccessLiteral.Parent);
     if (rootNode != null) yield return rootNode;
   }

   public static parse(source: ExpressionSource): ParseExpressionResult {
     let tokens = source.tokens;
     if (!IsValid(tokens)) return newParseExpressionFailed(MemberAccessExpression>(`Invalid expression.`);

     let literal = tokens.Token<MemberAccessLiteral>(0);
     let variable = new VariableReference(literal.Parts);

     let reference = source.createReference();

     let accessExpression = new MemberAccessExpression(variable, literal, source, reference);
     return newParseExpressionSuccess(accessExpression);
   }

   public static isValid(tokens: TokenList): boolean {
     return tokens.length == 1
        && tokens.isTokenType<MemberAccessLiteral>(0);
   }

   public override getChildren(): Array<INode> {
     yield break;
   }

   protected override validate(context: IValidationContext): void {
     VariableType = context.variableContext.getVariableType(Variable, context);
     RootType = context.RootNodes.GetType(Variable.ParentIdentifier);

     SetVariableSource(context);

     if (VariableType != null) return;

     if (VariableType == null && RootType == null) {
       context.logger.fail(this.reference, $`Invalid member access '{Variable}'. Variable '{Variable}' not found.`);
       return;
     }

     if (RootType is not ITypeWithMembers typeWithMembers) {
       context.logger.fail(this.reference,
         $`Invalid member access '{Variable}'. Variable '{Variable.ParentIdentifier}' not found.`);
       return;
     }

     let memberType = typeWithMembers.MemberType(MemberAccessLiteral.Member, context);
     if (memberType == null)
       context.logger.fail(this.reference,
         $`Invalid member access '{Variable}'. Member '{MemberAccessLiteral.Member}' not found on '{Variable.ParentIdentifier}'.`);
   }

   private setVariableSource(context: IValidationContext): void {
     if (RootType != null) {
       VariableSource = VariableSource.Type;
       return;
     }

     let variableSource = context.variableContext.getVariableSource(Variable.ParentIdentifier);
     if (variableSource == null)
       context.logger.fail(this.reference, `Can't define source of variable: ` + Variable.ParentIdentifier);
     else
       VariableSource = variableSource.Value;
   }

   public override deriveType(context: IValidationContext): VariableType {
     return MemberAccessLiteral.deriveType(context);
   }
}
