import {VariableDefinition} from "../../../language/variableDefinition";
import {CodeWriter} from "./codeWriter";
import {renderExpression} from "./renderExpression";
import {VariableDeclarationType} from "../../../language/variableTypes/variableDeclarationType";
import {
  asPrimitiveVariableDeclarationType,
  PrimitiveVariableDeclarationType
} from "../../../language/variableTypes/primitiveVariableDeclarationType";
import {
  asCustomVariableDeclarationType,
  CustomVariableDeclarationType
} from "../../../language/variableTypes/customVariableDeclarationType";
import {TypeNames} from "../../../language/variableTypes/typeNames";
import {instanceOfCustomType} from "../../../language/variableTypes/customType";

export function createVariableClass(className: string,
                                    variables: ReadonlyArray<VariableDefinition>,
                                    codeWriter: CodeWriter) {
  codeWriter.openScope(`class ${className}`);
  for (const variable of variables) {
    renderVariableDefinition(variable, codeWriter)
  }
  codeWriter.closeScope();
}

function renderVariableDefinition(variable: VariableDefinition,
                                  codeWriter: CodeWriter) {
  codeWriter.startLine(`${variable.name} = `);
  renderDefaultExpression(variable, codeWriter);
  codeWriter.endLine(`;`);
}

function renderDefaultExpression(variable: VariableDefinition,
                                 codeWriter: CodeWriter) {

  if (variable.defaultExpression != null) {
    renderExpression(variable.defaultExpression, codeWriter);
  } else {
    renderTypeDefaultExpression(variable.type, codeWriter);
  }
}

export function renderTypeDefaultExpression(variableDeclarationType: VariableDeclarationType,
                                            codeWriter: CodeWriter) {

  const primitiveVariableDeclarationType = asPrimitiveVariableDeclarationType(variableDeclarationType);
  if (primitiveVariableDeclarationType != null) {
    renderPrimitiveTypeDefaultExpression(primitiveVariableDeclarationType, codeWriter);
    return;
  }
  const customType = asCustomVariableDeclarationType(variableDeclarationType);
  if (customType != null) {
    renderDefaultExpressionSyntax(customType, codeWriter);
  }
  throw new Error(`Wrong VariableDeclarationType ${variableDeclarationType.nodeType}`)
}

function renderPrimitiveTypeDefaultExpression(type: PrimitiveVariableDeclarationType,
                                              codeWriter: CodeWriter) {
  switch (type.type) {
    case TypeNames.number:
      codeWriter.write("0");
      return;

    case TypeNames.boolean:
      codeWriter.write("false");
      return;

    case TypeNames.string:
      codeWriter.write('""');
      return;

    case TypeNames.date:
      codeWriter.write('new Date(1, 0, 1, 0, 0, 0');
      return;

    default:
      throw new Error(`Invalid type: ${type.type}`);
  }
}

function renderDefaultExpressionSyntax(customType: CustomVariableDeclarationType,
                                       codeWriter: CodeWriter) {
  if (instanceOfCustomType(customType.variableType)) {
    codeWriter.write(`new ${customType}()`);
    return;
  } else {
    throw new Error(`Invalid renderDefaultExpressionSyntax: ${customType.nodeType}`);
  }
}