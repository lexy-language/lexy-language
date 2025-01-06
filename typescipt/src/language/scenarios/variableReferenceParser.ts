import {
  newVariableReferenceParseFailed,
  newVariableReferenceParseSuccess,
  VariableReferenceParseResult
} from "./variableReferenceParseResult";
import {Expression} from "../expressions/expression";
import {VariableReference} from "../variableReference";
import {asMemberAccessExpression, MemberAccessExpression} from "../expressions/memberAccessExpression";
import {asLiteralExpression, LiteralExpression} from "../expressions/literalExpression";
import {asIdentifierExpression} from "../expressions/identifierExpression";
import {asStringLiteralToken} from "../../parser/tokens/stringLiteralToken";

export class VariableReferenceParser {
  
   public static parse(parts: string[]): VariableReferenceParseResult {
     let variableReference = new VariableReference(parts);
     return newVariableReferenceParseSuccess(variableReference);
   }

   public static parseExpression(expression: Expression): VariableReferenceParseResult {

     const memberAccessExpression = asMemberAccessExpression(expression);
     if (memberAccessExpression != null) {
       return VariableReferenceParser.parseMemberAccessExpression(memberAccessExpression);
     }

     const literalExpression = asLiteralExpression(expression);
     if (literalExpression != null) {
       return VariableReferenceParser.parseLiteralExpression(literalExpression);
     }

     const identifierExpression = asIdentifierExpression(expression);
     if (identifierExpression != null) {
       return newVariableReferenceParseSuccess(new VariableReference(identifierExpression.identifier.split(".")));
     }

     return newVariableReferenceParseFailed(`Invalid constant value. Expected: 'Variable = ConstantValue'`);
   }

   private static parseLiteralExpression(literalExpression: LiteralExpression): VariableReferenceParseResult {
     const stringLiteral = asStringLiteralToken(literalExpression.literal);
     if (stringLiteral != null) {
       return newVariableReferenceParseSuccess(new VariableReference(stringLiteral.value.split(".")))
     }
     return newVariableReferenceParseFailed(`Invalid expression literal. Expected: 'Variable = ConstantValue'`);
   }

   private static parseMemberAccessExpression(memberAccessExpression: MemberAccessExpression): VariableReferenceParseResult {
     if (memberAccessExpression.memberAccessLiteral.parts.length == 0) {
       return newVariableReferenceParseFailed(
         `Invalid number of variable reference parts: ${memberAccessExpression.memberAccessLiteral.parts.length}`);
     }

     let variableReference = new VariableReference(memberAccessExpression.memberAccessLiteral.parts);
     return newVariableReferenceParseSuccess(variableReference);
   }
}
