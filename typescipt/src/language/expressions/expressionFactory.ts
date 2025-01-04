import {TokenList} from "../../parser/tokens/tokenList";
import {ExpressionSource} from "./expressionSource";
import {newParseExpressionFailed, ParseExpressionResult} from "./parseExpressionResult";
import {Line} from "../../parser/line";
import {IfExpression} from "./ifExpression";
import {ElseExpression} from "./elseExpression";
import {SwitchExpression} from "./switchExpression";
import {CaseExpression} from "./caseExpression";
import {VariableDeclarationExpression} from "./variableDeclarationExpression";
import {AssignmentExpression} from "./assignmentExpression";
import {ParenthesizedExpression} from "./parenthesizedExpression";
import {BracketedExpression} from "./bracketedExpression";
import {IdentifierExpression} from "./identifierExpression";
import {MemberAccessExpression} from "./memberAccessExpression";
import {LiteralExpression} from "./literalExpression";
import {BinaryExpression} from "./binaryExpression";
import {FunctionCallExpression} from "./functionCallExpression";

export interface IExpressionFactory {
  parse(tokens: TokenList, currentLine: Line): ParseExpressionResult;
}

export class ExpressionFactory implements IExpressionFactory {

   private static factories: {
      criteria: (tokens: TokenList) => boolean,
      factory: ((source: ExpressionSource, factory: IExpressionFactory) => ParseExpressionResult) }[] = [
         { criteria: IfExpression.isValid, factory: IfExpression.parse },
         { criteria: ElseExpression.isValid, factory: ElseExpression.parse },
         { criteria: SwitchExpression.isValid, factory: SwitchExpression.parse },
         { criteria: CaseExpression.isValid, factory: CaseExpression.parse },
         { criteria: VariableDeclarationExpression.isValid, factory: VariableDeclarationExpression.parse },
         { criteria: AssignmentExpression.isValid, factory: AssignmentExpression.parse },
         { criteria: ParenthesizedExpression.isValid, factory: ParenthesizedExpression.parse },
         { criteria: BracketedExpression.isValid, factory: BracketedExpression.parse },
         { criteria: IdentifierExpression.isValid, factory: IdentifierExpression.parse },
         { criteria: MemberAccessExpression.isValid, factory: MemberAccessExpression.parse },
         { criteria: LiteralExpression.isValid, factory: LiteralExpression.parse },
         { criteria: BinaryExpression.isValid, factory: BinaryExpression.parse },
         { criteria: FunctionCallExpression.isValid, factory: FunctionCallExpression.parse }
       ];

   public parse(tokens: TokenList, currentLine: Line): ParseExpressionResult {
     for (let index = 0 ; index < ExpressionFactory.factories.length ; index++) {
       const factory = ExpressionFactory.factories[index];
       if (factory.criteria(tokens)) {
         let source = new ExpressionSource(currentLine, tokens);
         return factory.factory(source, this);
       }
     }

     return newParseExpressionFailed("ExpressionFactory", `Invalid expression: ${tokens}`);
   }
}
