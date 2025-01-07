import {Expression} from "../../../language/expressions/expression";
import {CodeWriter} from "./codeWriter";
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
import {VariableDeclarationType} from "../../../language/variableTypes/variableDeclarationType";
import {asPrimitiveVariableDeclarationType} from "../../../language/variableTypes/primitiveVariableDeclarationType";
import {
  asCustomVariableDeclarationType,
  CustomVariableDeclarationType
} from "../../../language/variableTypes/customVariableDeclarationType";
import {asEnumType} from "../../../language/variableTypes/enumType";
import {asCustomType} from "../../../language/variableTypes/customType";
import {asTableType} from "../../../language/variableTypes/tableType";
import {asImplicitVariableDeclaration} from "../../../language/variableTypes/implicitVariableDeclaration";
import {VariableSource} from "../../../language/variableSource";
import {LexyCodeConstants} from "../../lexyCodeConstants";
import {renderTypeDefaultExpression} from "./renderVariableClass";
import {
  asFunctionCallExpression,
  FunctionCallExpression,
  instanceOfFunctionCallExpression
} from "../../../language/expressions/functionCallExpression";

export function renderExpressions(expressions: ReadonlyArray<Expression>, codeWriter: CodeWriter) {
  for (const expression of expressions) {
    const line = codeWriter.currentLine;
    codeWriter.startLine()
    renderExpression(expression, codeWriter);
    if (line == codeWriter.currentLine) {
      codeWriter.endLine(";")
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

  renderVariableClassName(memberAccessExpression, memberAccessExpression.variable, codeWriter);

  let childReference = memberAccessExpression.variable;
  while (childReference.hasChildIdentifiers) {
    childReference = childReference.childrenReference();
    codeWriter.write(".")
    codeWriter.write(childReference.parentIdentifier)
  }
}

function renderVariableClassName(expression: MemberAccessExpression, reference: VariableReference, codeWriter: CodeWriter) {
  switch (expression.rootType?.variableTypeName) {
    case VariableTypeName.CustomType:
      codeWriter.writeNamespace()
      codeWriter.write(`.${typeClassName(reference.parentIdentifier)}`);
      break;
    case VariableTypeName.EnumType:
      codeWriter.writeNamespace()
      codeWriter.write(`.${enumClassName(reference.parentIdentifier)}`);
      break;
    case VariableTypeName.FunctionType:
      codeWriter.writeNamespace()
      codeWriter.write(`.${functionClassName(reference.parentIdentifier)}`);
      break;
    case VariableTypeName.TableType:
      codeWriter.writeNamespace()
      codeWriter.write(`.${tableClassName(reference.parentIdentifier)}`);
      break;
  }
}

function renderIdentifierExpression(expression: IdentifierExpression, codeWriter: CodeWriter) {
  const value = fromSource(expression.variableSource, expression.identifier);
  codeWriter.write(value);
}

function renderLiteralExpression(expression: LiteralExpression, codeWriter: CodeWriter) {
  codeWriter.write(expression.literal.value);
}

function renderAssignmentExpression(expression: AssignmentExpression, codeWriter: CodeWriter) {
  renderExpression(expression.variable, codeWriter);
  codeWriter.write(" = ");
  renderExpression(expression.assignment, codeWriter);
}

function renderBinaryExpression(expression: BinaryExpression, codeWriter: CodeWriter) {
  renderExpression(expression.left, codeWriter);
  codeWriter.write(operaorString(expression.operator));
  renderExpression(expression.right, codeWriter);
}

function operaorString(operator: ExpressionOperator) {
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
    codeWriter.closeScope()
    return;
  }

  codeWriter.write("case ");
  renderExpression(caseValue.value, codeWriter)
  codeWriter.openScope(":");
  renderExpressions(caseValue.expressions, codeWriter);
  codeWriter.closeScope()
}

function renderSwitchExpression(expression: SwitchExpression, codeWriter: CodeWriter) {
  codeWriter.write("switch(");
  renderExpression(expression.condition, codeWriter)
  codeWriter.openScope(")");
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

function typeName(type: VariableDeclarationType) {
  switch (type.nodeType) {
    case NodeType.PrimitiveVariableDeclarationType:
      const primitive = asPrimitiveVariableDeclarationType(type);
      if (primitive == null) throw new Error("Invalid PrimitiveVariableDeclarationType")
      return primitive.type;
    case NodeType.CustomVariableDeclarationType:
      const custom = asCustomVariableDeclarationType(type);
      if (custom == null) throw new Error("Invalid CustomVariableDeclarationType")
      return identifierNameSyntax(custom);
    case NodeType.ImplicitVariableDeclaration:
      const implicit = asImplicitVariableDeclaration(type);
      if (implicit == null) throw new Error("Invalid PrimitiveVariableDeclarationType")
      return implicit.variableType;
  }
  throw new Error(`Invalid type: ${type.nodeType}`)
}

function identifierNameSyntax(customVariable: CustomVariableDeclarationType) {
  if (customVariable.variableType == null) throw new Error("Variable type expected: " + customVariable.nodeType);

  const variableTypeName = customVariable.variableType.variableTypeName;
  switch (variableTypeName) {
    case VariableTypeName.EnumType:
      const enumType = asEnumType(customVariable.variableType);
      if (enumType == null) throw new Error("Invalid EnumType")
      return enumClassName(enumType.type)
    case VariableTypeName.TableType:
      const tableType = asTableType(customVariable.variableType);
      if (tableType == null) throw new Error("Invalid TableType")
      return tableClassName(tableType.type)
    case VariableTypeName.CustomType:
      const customType = asCustomType(customVariable.variableType);
      if (customType == null) throw new Error("Invalid CustomType")
      return enumClassName(customType.type)
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
  codeWriter.renderFunctionCall(expression.expressionFunction);
}