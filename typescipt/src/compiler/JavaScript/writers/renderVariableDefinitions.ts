/* import type {ICompileFunctionContext} from "../compileFunctionContext";

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

export function renderVariableDefinitions(variables: ReadonlyArray<VariableDefinition>,
                                   context: ICompileFunctionContext,
                                   codeWriter: CodeWriter) {
  for (const variable of variables) {
    renderVariableDefinition(variable, context, codeWriter)
  }
}

function renderVariableDefinition(variable: VariableDefinition,
                                  context: ICompileFunctionContext,
                                  codeWriter: CodeWriter) {
  codeWriter.startLine(`${variable.name}: `);
  renderDefaultExpression(variable,context, codeWriter);
  codeWriter.endLine(`,`);

}

 function renderDefaultExpression(variable: VariableDefinition,
                                  context: ICompileFunctionContext,
                                  codeWriter: CodeWriter) {

   if (variable.defaultExpression != null) {
     renderExpression(variable.defaultExpression, context, codeWriter);
   } else {
     renderTypeDefaultExpression(variable.type, context, codeWriter);
   }
}

function renderTypeDefaultExpression(variableDeclarationType: VariableDeclarationType,
                                     context: ICompileFunctionContext,
                                     codeWriter: CodeWriter) {

  const primitiveVariableDeclarationType = asPrimitiveVariableDeclarationType(variableDeclarationType);
  if (primitiveVariableDeclarationType != null) {
    renderPrimitiveTypeDefaultExpression(primitiveVariableDeclarationType, context, codeWriter);
    return;
  }
  const customType = asCustomVariableDeclarationType(variableDeclarationType);
  if (customType != null) {
    renderDefaultExpressionSyntax(customType, context, codeWriter);
  }
  throw new Error(`Wrong VariableDeclarationType ${variableDeclarationType.nodeType}`)
}

function renderPrimitiveTypeDefaultExpression(type: PrimitiveVariableDeclarationType,
                                              context: ICompileFunctionContext,
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
                                       context: ICompileFunctionContext,
                                       codeWriter: CodeWriter){
  if (instanceOfCustomType(customType.variableType))
  {
    codeWriter.write(`new ${customType}()`);
    return;
  } else {
    throw new Error(`Invalid renderDefaultExpressionSyntax: ${customType.nodeType}`);
  }
}*/