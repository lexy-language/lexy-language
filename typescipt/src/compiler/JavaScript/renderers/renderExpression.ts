import {Expression} from "../../../language/expressions/expression";
import {CodeWriter} from "../writers/codeWriter";
import {NodeType} from "../../../language/nodeType";
import {asMemberAccessExpression, MemberAccessExpression} from "../../../language/expressions/memberAccessExpression";
import {VariableReference} from "../../../language/variableReference";
import {VariableTypeName} from "../../../language/variableTypes/variableTypeName";
import {enumClassName, functionClassName, tableClassName, typeClassName} from "../classNames";
import {asLiteralExpression, LiteralExpression} from "../../../language/expressions/literalExpression";
import {asAssignmentExpression, AssignmentExpression} from "../../../language/expressions/assignmentExpression";
import {asBinaryExpression, BinaryExpression} from "../../../language/expressions/binaryExpression";
import {asBracketedExpression, BracketedExpression} from "../../../language/expressions/bracketedExpression";
import {asElseExpression, ElseExpression} from "../../../language/expressions/elseExpression";
import {
  asParenthesizedExpression,
  ParenthesizedExpression
} from "../../../language/expressions/parenthesizedExpression";
import {asIfExpression, IfExpression} from "../../../language/expressions/ifExpression";
import {asSwitchExpression, SwitchExpression} from "../../../language/expressions/switchExpression";
import {CaseExpression} from "../../../language/expressions/caseExpression";
import {ExpressionOperator} from "../../../language/expressions/expressionOperator";
import {asIdentifierExpression, IdentifierExpression} from "../../../language/expressions/identifierExpression";
import {
  asVariableDeclarationExpression,
  VariableDeclarationExpression
} from "../../../language/expressions/variableDeclarationExpression";
import {CustomVariableDeclarationType} from "../../../language/variableTypes/customVariableDeclarationType";
import {asEnumType} from "../../../language/variableTypes/enumType";
import {asCustomType} from "../../../language/variableTypes/customType";
import {asTableType} from "../../../language/variableTypes/tableType";
import {VariableSource} from "../../../language/variableSource";
import {LexyCodeConstants} from "../../lexyCodeConstants";
import {renderTypeDefaultExpression} from "./renderVariableClass";
import {
  asFunctionCallExpression,
  FunctionCallExpression,
} from "../../../language/expressions/functionCallExpression";
import {renderFunctionCall} from "../builtInFunctions/createFunctionCall";
import {matchesLineExpressionException} from "../lineExpressionExceptions/matchesLineExpressionException";
import {TokenType} from "../../../parser/tokens/tokenType";
import {asDateTimeLiteral, DateTimeLiteral} from "../../../parser/tokens/dateTimeLiteral";

export function renderExpressions(expressions: ReadonlyArray<Expression>, codeWriter: CodeWriter) {
  for (const expression of expressions) {
    const line = codeWriter.currentLine;
    codeWriter.startLine()

    const exception = matchesLineExpressionException(expression);
    if (exception != null) {
      exception.render(expression, codeWriter);
    } else {
      renderExpression(expression, codeWriter);
      if (line == codeWriter.currentLine) {
        codeWriter.endLine(";")
      }
    }
  }
}

export function renderValueExpression(expression: Expression, codeWriter: CodeWriter) {

  function render<T>(castFunction: (expression: Expression) => T, render: (render: T, codeWriter: CodeWriter) => void) {
    const specificExpression = castFunction(expression);
    if (specificExpression == null) throw new Error(`Invalid expression type: '${expression.nodeType}' cast is null`);
    render(specificExpression, codeWriter);
  }

  switch (expression.nodeType) {
    case NodeType.LiteralExpression:
      return render(asLiteralExpression, renderLiteralExpression);

    case NodeType.IdentifierExpression:
      return render(asIdentifierExpression, renderIdentifierExpression);

    case NodeType.MemberAccessExpression:
      return render(asMemberAccessExpression, renderMemberAccessExpression);

    default:
      throw new Error(`Invalid expression type: ${expression.nodeType}`);
  }
}

export function renderExpression(expression: Expression, codeWriter: CodeWriter) {

  function render<T>(castFunction: (expression: Expression) => T, render: (render: T, codeWriter: CodeWriter) => void) {
    const specificExpression = castFunction(expression);
    if (specificExpression == null) throw new Error(`Invalid expression type: '${expression.nodeType}' cast is null`);
    render(specificExpression, codeWriter);
  }

  switch (expression.nodeType) {
    case NodeType.AssignmentExpression:
      return render(asAssignmentExpression, renderAssignmentExpression);

    case NodeType.BinaryExpression:
      return render(asBinaryExpression, renderBinaryExpression);

    case NodeType.BracketedExpression:
      return render(asBracketedExpression, renderBracketedExpression);

    case NodeType.ElseExpression:
      return render(asElseExpression, renderElseExpression);

    case NodeType.IfExpression:
      return render(asIfExpression, renderIfExpression);

    case NodeType.LiteralExpression:
      return render(asLiteralExpression, renderLiteralExpression);

    case NodeType.IdentifierExpression:
      return render(asIdentifierExpression, renderIdentifierExpression);

    case NodeType.ParenthesizedExpression:
      return render(asParenthesizedExpression, renderParenthesizedExpression);

    case NodeType.SwitchExpression:
      return render(asSwitchExpression, renderSwitchExpression);

    case NodeType.MemberAccessExpression:
      return render(asMemberAccessExpression, renderMemberAccessExpression);

    case NodeType.VariableDeclarationExpression:
      return render(asVariableDeclarationExpression, renderVariableDeclarationExpression);
  }

  const functionCallExpression = asFunctionCallExpression(expression);
  if (functionCallExpression != null) {
    return render(asFunctionCallExpression, renderFunctionCallExpression);
  }

  throw new Error(`Invalid expression type: ${expression.nodeType}`);
}

function renderMemberAccessExpression(memberAccessExpression: MemberAccessExpression, codeWriter: CodeWriter) {
  if (memberAccessExpression.variable.parts < 2) throw new Error(`Invalid MemberAccessExpression: {expression}`);

  const parentIdentifier = translateParentVariableClassName(memberAccessExpression, memberAccessExpression.variable, codeWriter);
  const parent = fromSource(memberAccessExpression.variableSource, parentIdentifier);

  codeWriter.write(parent)

  let childReference = memberAccessExpression.variable;
  while (childReference.hasChildIdentifiers) {
    childReference = childReference.childrenReference();
    codeWriter.write(".")
    codeWriter.write(childReference.parentIdentifier)
  }
}

function translateParentVariableClassName(expression: MemberAccessExpression, reference: VariableReference, codeWriter: CodeWriter) {
  switch (expression.parentVariableType?.variableTypeName) {
    case VariableTypeName.CustomType:
      return codeWriter.identifierFromNamespace(typeClassName(reference.parentIdentifier));
    case VariableTypeName.EnumType:
      return codeWriter.identifierFromNamespace(enumClassName(reference.parentIdentifier));
    case VariableTypeName.FunctionType:
      return codeWriter.identifierFromNamespace(functionClassName(reference.parentIdentifier));
    case VariableTypeName.TableType:
      return codeWriter.identifierFromNamespace(tableClassName(reference.parentIdentifier));
    default:
      return reference.parentIdentifier;
  }
}

function renderIdentifierExpression(expression: IdentifierExpression, codeWriter: CodeWriter) {
  const value = fromSource(expression.variableSource, expression.identifier);
  codeWriter.write(value);
}

function renderLiteralExpression(expression: LiteralExpression, codeWriter: CodeWriter) {
  if (expression.literal.tokenType == TokenType.QuotedLiteralToken) {
    codeWriter.write(`"${expression.literal.value}"`);
  } else if (expression.literal.tokenType == TokenType.DateTimeLiteral) {
    const dateTimeLiteral = asDateTimeLiteral(expression.literal);
    const dateValue =  dateTimeLiteral?.dateTimeValue;
    if (dateValue == null) throw new Error("DateTimeLiteral.dateTimeValue expected")
    codeWriter.write(`new Date(${dateValue.getFullYear()}, ${dateValue.getMonth()}, ${dateValue.getDate()}, ${dateValue.getHours()}, ${dateValue.getMinutes()}, ${dateValue.getSeconds()})`);
  } else {
    codeWriter.write(expression.literal.value);
  }
}

function renderAssignmentExpression(expression: AssignmentExpression, codeWriter: CodeWriter) {
  renderExpression(expression.variable, codeWriter);
  codeWriter.write(" = ");
  renderExpression(expression.assignment, codeWriter);
}

function renderBinaryExpression(expression: BinaryExpression, codeWriter: CodeWriter) {
  renderExpression(expression.left, codeWriter);
  codeWriter.write(operatorString(expression.operator));
  renderExpression(expression.right, codeWriter);
}

function operatorString(operator: ExpressionOperator) {
  switch (operator) {
    case ExpressionOperator.Addition:
      return " + ";
    case ExpressionOperator.Subtraction:
      return " - ";
    case ExpressionOperator.Multiplication:
      return " * ";
    case ExpressionOperator.Division:
      return " / ";
    case ExpressionOperator.Modulus:
      return " % ";
    case ExpressionOperator.GreaterThan:
      return " > ";
    case ExpressionOperator.GreaterThanOrEqual:
      return " >= ";
    case ExpressionOperator.LessThan:
      return " < ";
    case ExpressionOperator.LessThanOrEqual:
      return " <= ";
    case ExpressionOperator.And:
      return " && ";
    case ExpressionOperator.Or:
      return " || ";
    case ExpressionOperator.Equals:
      return " == ";
    case ExpressionOperator.NotEqual:
      return " != ";

    default:
      throw new Error("Invalid operator: " + operator)
  }
}

function renderBracketedExpression(expression: BracketedExpression, codeWriter: CodeWriter) {
  codeWriter.write("[");
  renderExpression(expression.expression, codeWriter);
  codeWriter.write("]");
}

function renderElseExpression(expression: ElseExpression, codeWriter: CodeWriter) {
  codeWriter.openScope("else")
  renderExpressions(expression.falseExpressions, codeWriter);
  codeWriter.closeScope();
}

function renderIfExpression(expression: IfExpression, codeWriter: CodeWriter) {
  codeWriter.write("if (");
  renderExpression(expression.condition, codeWriter);
  codeWriter.openInlineScope(")");
  renderExpressions(expression.trueExpressions, codeWriter);

  if (expression.else != null) {
    codeWriter.write("} else {");
    renderExpressions(expression.else.falseExpressions, codeWriter);
  }

  codeWriter.closeScope();
}

function renderParenthesizedExpression(expression: ParenthesizedExpression, codeWriter: CodeWriter) {
  codeWriter.write("(");
  renderExpression(expression.expression, codeWriter);
  codeWriter.write(")");
}

function renderCaseExpression(caseValue: CaseExpression, codeWriter: CodeWriter) {
  if (caseValue.value == null) {
    codeWriter.openScope("default:");
    renderExpressions(caseValue.expressions, codeWriter);
    codeWriter.writeLine("break;")
    codeWriter.closeScope()
    return;
  }

  codeWriter.startLine("case ");
  renderExpression(caseValue.value, codeWriter)
  codeWriter.openInlineScope(":");
  renderExpressions(caseValue.expressions, codeWriter);
  codeWriter.writeLine("break;")
  codeWriter.closeScope()
}

function renderSwitchExpression(expression: SwitchExpression, codeWriter: CodeWriter) {
  codeWriter.write("switch(");
  renderExpression(expression.condition, codeWriter)
  codeWriter.openInlineScope(")");
  for (const caseValue of expression.cases) {
    renderCaseExpression(caseValue, codeWriter)
  }
  codeWriter.closeScope()
}

function renderVariableDeclarationExpression(expression: VariableDeclarationExpression, codeWriter: CodeWriter) {
  codeWriter.write(`let ${expression.name} = `);
  if (expression.assignment != null) {
    renderExpression(expression.assignment, codeWriter);
  } else {
    renderTypeDefaultExpression(expression.type, codeWriter);
  }
}

export function customVariableIdentifier(customVariable: CustomVariableDeclarationType, codeWriter: CodeWriter) {
  if (customVariable.variableType == null) throw new Error("Variable type expected: " + customVariable.nodeType);

  const variableTypeName = customVariable.variableType.variableTypeName;
  switch (variableTypeName) {
    case VariableTypeName.EnumType:
      const enumType = asEnumType(customVariable.variableType);
      if (enumType == null) throw new Error("Invalid EnumType")
      return codeWriter.identifierFromNamespace(enumClassName(enumType.type));
    case VariableTypeName.TableType:
      const tableType = asTableType(customVariable.variableType);
      if (tableType == null) throw new Error("Invalid TableType")
      return codeWriter.identifierFromNamespace(tableClassName(tableType.tableName));
    case VariableTypeName.CustomType:
      const customType = asCustomType(customVariable.variableType);
      if (customType == null) throw new Error("Invalid CustomType")
      return codeWriter.identifierFromNamespace(typeClassName(customType.type));
  }
  throw new Error(`Couldn't map type: ${customVariable.variableType}`)
}

function fromSource(source: VariableSource, name: string): string {
  switch (source) {
    case VariableSource.Parameters:
      return `${LexyCodeConstants.parameterVariable}.${name}`;

    case VariableSource.Results:
      return `${LexyCodeConstants.resultsVariable}.${name}`;

    case VariableSource.Code:
    case VariableSource.Type:
      return name;

    case VariableSource.Unknown:
    default:
      throw new Error(`source: {source}`);
  }
}

function renderFunctionCallExpression(expression: FunctionCallExpression, codeWriter: CodeWriter) {
  renderFunctionCall(expression.expressionFunction, codeWriter);
}