import type {IValidationContext} from "../../parser/validationContext";
import type {SourceReference} from "../../parser/sourceReference";

import {Expression} from "../expressions/expression";
import {VariableDeclarationType} from "./variableDeclarationType";
import {asCustomVariableDeclarationType, CustomVariableDeclarationType} from "./customVariableDeclarationType";
import {asPrimitiveVariableDeclarationType, PrimitiveVariableDeclarationType} from "./primitiveVariableDeclarationType";
import {instanceOfEnumType} from "./enumType";
import {asMemberAccessExpression} from "../expressions/memberAccessExpression";
import {TypeNames} from "./TypeNames";
import {asLiteralExpression} from "../expressions/literalExpression";


function validateCustomVariableType(context: IValidationContext, reference: SourceReference,
                                    customVariableDeclarationType: CustomVariableDeclarationType, defaultValueExpression: Expression | null) {

  let type = context.rootNodes.getType(customVariableDeclarationType.type);
  if (type == null || !instanceOfEnumType(type) && type.variableTypeName != "CustomType") {
    context.logger.fail(reference, `Unknown type: '${customVariableDeclarationType.type}'`);
    return;
  }

  if (defaultValueExpression == null) return;

  if (!(instanceOfEnumType(type))) {
    context.logger.fail(reference,
      `Invalid default value '${defaultValueExpression}'. Type: '${customVariableDeclarationType.type}' does not support a default value.`);
    return;
  }

  const memberAccessLiteralExpression = asMemberAccessExpression(defaultValueExpression);
  if (memberAccessLiteralExpression == null) {
    context.logger.fail(reference,
      `Invalid default value '${defaultValueExpression}'. (type: '${customVariableDeclarationType.type}')`);
    return;
  }

  const variableReference = memberAccessLiteralExpression.variable;
  if (variableReference.parts != 2) {
    context.logger.fail(reference,
      `Invalid default value '${defaultValueExpression}'. (type: '${customVariableDeclarationType.type}')`);
  }
  if (variableReference.parentIdentifier != customVariableDeclarationType.type) {
    context.logger.fail(reference,
      `Invalid default value '${defaultValueExpression}'. Invalid enum type. (type: '${customVariableDeclarationType.type}')`);
  }

  const enumDeclaration = context.rootNodes.getEnum(variableReference.parentIdentifier);
  if (enumDeclaration == null || !enumDeclaration.containsMember(variableReference.path[1])) {
    context.logger.fail(reference,
      `Invalid default value '${defaultValueExpression}'. Invalid member. (type: '${customVariableDeclarationType.type}')`);
  }
}

function validatePrimitiveVariableType(context: IValidationContext, reference: SourceReference,
                                       primitiveVariableDeclarationType: PrimitiveVariableDeclarationType, defaultValueExpression: Expression | null) {

  if (defaultValueExpression == null) return;

  switch (primitiveVariableDeclarationType.type) {
    case TypeNames.number:
      validateDefaultLiteral("NumberLiteralToken", context, reference, primitiveVariableDeclarationType,
        defaultValueExpression);
      break;

    case TypeNames.string:
      validateDefaultLiteral("QuotedLiteralToken", context, reference, primitiveVariableDeclarationType,
        defaultValueExpression);
      break;

    case TypeNames.boolean:
      validateDefaultLiteral("BooleanLiteral", context, reference, primitiveVariableDeclarationType,
        defaultValueExpression);
      break;

    case TypeNames.date:
      validateDefaultLiteral("DateTimeLiteral", context, reference, primitiveVariableDeclarationType,
        defaultValueExpression);
      break;

    default:
      throw new Error(`Unexpected type: ${primitiveVariableDeclarationType.type}`);
  }
}

function validateDefaultLiteral(literalType: string, context: IValidationContext, reference: SourceReference,
                                primitiveVariableDeclarationType: PrimitiveVariableDeclarationType,
                                defaultValueExpression: Expression | null) {
  const literalExpression = asLiteralExpression(defaultValueExpression);
  if (literalExpression == null) {
    context.logger.fail(reference,
      `Invalid default value '${defaultValueExpression}'. (type: '${primitiveVariableDeclarationType.type}')`);
    return;
  }

  if (literalExpression.literal.tokenType != literalType) {
    context.logger.fail(reference,
      `Invalid default value '${defaultValueExpression}'. (type: '${primitiveVariableDeclarationType.type}')`);
  }
}

export function validateTypeAndDefault(context: IValidationContext, reference: SourceReference,
                                       type: VariableDeclarationType, defaultValueExpression: Expression | null) {

  const customVariableType = asCustomVariableDeclarationType(type);
  if (customVariableType != null) {
    validateCustomVariableType(context, reference, customVariableType, defaultValueExpression);
    return;
  }

  const primitiveVariableType = asPrimitiveVariableDeclarationType(type);
  if (primitiveVariableType != null) {
    validatePrimitiveVariableType(context, reference, primitiveVariableType, defaultValueExpression);
    return;
  }

  throw new Error(`Invalid Type: ${type.nodeType}`);
}
