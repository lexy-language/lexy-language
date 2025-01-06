import type {ICompileFunctionContext} from "../CompileFunctionContext";

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

export function renderExpressions(expressions: ReadonlyArray<Expression>, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  for (const expression of expressions) {
    codeWriter.startLine()
    renderExpression(expression, context, codeWriter);
    codeWriter.endLine(";")
  }
}

export function renderExpression(expression: Expression, context: ICompileFunctionContext, codeWriter: CodeWriter) {

  function render<T>(castFunction: (expression: Expression) => T, render: (render: T, context: ICompileFunctionContext, codeWriter: CodeWriter) => void) {
    const specificExpression = castFunction(expression);
    if (specificExpression == null) throw new Error(`Invalid expression type: '${expression.nodeType}' cast is null`);
    render(specificExpression, context, codeWriter);
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

    default:
      throw new Error(`Invalid expression type: ${expression.nodeType}`);
  }
}

function renderMemberAccessExpression(memberAccessExpression: MemberAccessExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  if (memberAccessExpression.variable.parts < 2) throw new Error(`Invalid MemberAccessExpression: {expression}`);

  const rootType = variableClassName(memberAccessExpression, memberAccessExpression.variable);
  let childReference = memberAccessExpression.variable.childrenReference();

  codeWriter.write(rootType)

  while (childReference.hasChildIdentifiers) {
    childReference = childReference.childrenReference();
    codeWriter.write(".")
    codeWriter.write(childReference.parentIdentifier)
  }

  return result;
}

function variableClassName(expression: MemberAccessExpression, reference: VariableReference): string {
  switch (expression.rootType?.variableTypeName) {
    case VariableTypeName.CustomType:
      return typeClassName(reference.parentIdentifier);
    case VariableTypeName.EnumType:
      return enumClassName(reference.parentIdentifier);
    case VariableTypeName.FunctionType:
      return functionClassName(reference.parentIdentifier);
    case VariableTypeName.TableType:
      return tableClassName(reference.parentIdentifier);
  }
}

function renderIdentifierExpression(expression: IdentifierExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  const value = fromSource(expression.variableSource, expression.identifier);
  codeWriter.write(value);
}

function renderLiteralExpression(expression: LiteralExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  codeWriter.write(expression.literal.value);
}

function renderAssignmentExpression(expression: AssignmentExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  renderExpression(expression.variable, context, codeWriter);
  codeWriter.write(" = ");
  renderExpression(expression.assignment, context, codeWriter);
}

function renderBinaryExpression(expression: BinaryExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  renderExpression(expression.left, context, codeWriter);
  codeWriter.write(operaorString(expression.operator));
  renderExpression(expression.right, context, codeWriter);
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

function renderBracketedExpression(expression: BracketedExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  codeWriter.write("[");
  renderExpression(expression.expression, context, codeWriter);
  codeWriter.write("]");
}

function renderElseExpression(expression: ElseExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  codeWriter.openScope("else")
  renderExpressions(expression.falseExpressions, context, codeWriter);
  codeWriter.closeScope();
}

function renderIfExpression(expression: IfExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  codeWriter.openScope("if")
  renderExpressions(expression.trueExpressions, context, codeWriter);
  codeWriter.closeScope();
}

function renderParenthesizedExpression(expression: ParenthesizedExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  codeWriter.write("(");
  renderExpression(expression.expression, context, codeWriter);
  codeWriter.write(")");
}

function renderCaseExpression(caseValue: CaseExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  if (caseValue.value == null) {
    codeWriter.openScope("default:");
    renderExpressions(caseValue.expressions, context, codeWriter);
    codeWriter.closeScope()
    return;
  }

  codeWriter.write("case ");
  renderExpression(caseValue.value, context, codeWriter)
  codeWriter.openScope(":");
  renderExpressions(caseValue.expressions, context, codeWriter);
  codeWriter.closeScope()
}

function renderSwitchExpression(expression: SwitchExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  codeWriter.write("switch(");
  renderExpression(expression.condition, context, codeWriter)
  codeWriter.openScope(")");
  for (const caseValue of expression.cases) {
    renderCaseExpression(caseValue, context, codeWriter)
  }
  codeWriter.closeScope()
}

function renderVariableDeclarationExpression(expression: VariableDeclarationExpression, context: ICompileFunctionContext, codeWriter: CodeWriter) {
  codeWriter.write(`let ${expression.name} = `);
  if (expression.assignment != null) {
    renderExpression(expression.assignment, context, codeWriter);
  } else {
    renderTypeDefaultExpression(expression.type, context, codeWriter);
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