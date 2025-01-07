import {FunctionCall} from "./functionCall";
import {LookupFunction} from "../../../language/expressions/functions/lookupFunction";
import {CodeWriter} from "../writers/codeWriter";
import {LexyCodeConstants} from "../../lexyCodeConstants";
import {renderExpression} from "../writers/renderExpression";

export class LookUpFunctionCall extends FunctionCall {
  private readonly methodName: string;

  public lookupFunction: LookupFunction

  constructor(lookupFunction: LookupFunction) {
    super(lookupFunction);
    this.lookupFunction = lookupFunction;
    this.methodName = `__LookUp${lookupFunction.table}${lookupFunction.resultColumn.member}By${lookupFunction.searchValueColumn.member}`;
  }

  override renderCustomFunction(codeWriter: CodeWriter) {
    /* return MethodDeclaration(
      Types.Syntax(LookupFunction.resultColumnType),
      Identifier(methodName))
      .WithModifiers(Modifiers.PrivateStatic())
      .WithParameterList(
        ParameterList(
          SeparatedArray<ParameterSyntax>(
            new SyntaxNodeOrToken[]
    {
      Parameter(Identifier(`condition`))
        .WithType(Types.Syntax(LookupFunction.SearchValueColumnType)),
        Token(SyntaxKind.CommaToken),
        Parameter(Identifier(LexyCodeConstants.ContextVariable))
          .WithType(IdentifierName(`IExecutionContext`))
    }
  )))
  .
    WithBody(
      Block(
        SingletonArray<StatementSyntax>(
          ReturnStatement(
            InvocationExpression(
              MemberAccessExpression(
                SyntaxKind.SimpleMemberAccessExpression,
                IdentifierName(nameof(BuiltInTableFunctions)),
                IdentifierName(nameof(BuiltInTableFunctions.LookUp))))
              .WithArgumentList(
                ArgumentList(
                  SeparatedArray<ArgumentSyntax>(
                    new SyntaxNodeOrToken[]
    {
      Arguments.String(LookupFunction.resultColumn.Member),
        Token(SyntaxKind.CommaToken),
        Arguments.String(LookupFunction.searchValueColumn.Member),
        Token(SyntaxKind.CommaToken),
        Arguments.String(LookupFunction.Table),
        Token(SyntaxKind.CommaToken),
        Arguments.MemberAccess(ClassNames.TableClassName(LookupFunction.Table),
          `Values`),
        Token(SyntaxKind.CommaToken),
        Argument(IdentifierName(`condition`)),
        Token(SyntaxKind.CommaToken),
        Arguments.MemberAccessLambda(`row`,
          LookupFunction.searchValueColumn.Member),
        Token(SyntaxKind.CommaToken),
        Arguments.MemberAccessLambda(`row`,
          LookupFunction.resultColumn.Member),
        Token(SyntaxKind.CommaToken),
        Argument(IdentifierName(LexyCodeConstants.ContextVariable))
    }
  )))))))
    ;*/
  }

  public override renderExpression(codeWriter: CodeWriter) {
    codeWriter.write(`${this.methodName}(`)
    renderExpression(this.lookupFunction.valueExpression, codeWriter);
    codeWriter.write(`, ${LexyCodeConstants.contextVariable})`)
  }
}
