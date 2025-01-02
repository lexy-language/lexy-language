import {TokenList} from "../../parser/tokens/tokenList";
import {ExpressionSource} from "./expressionSource";
import {newParseExpressionFailed, ParseExpressionResult} from "./parseExpressionResult";
import {Line} from "../../parser/line";

export class ExpressionFactory {

   private static factories: [{
      criteria: (tokens: TokenList) => boolean,
      factory: ((source: ExpressionSource) => ParseExpressionResult) }] = [
         { criteria: IfExpression.isValid, factory: IfExpression.Parse },
         { criteria: ElseExpression.isValid, factory: ElseExpression.Parse },
         { criteria: SwitchExpression.isValid, factory: SwitchExpression.Parse },
         { criteria: CaseExpression.isValid, factory: CaseExpression.Parse },
         { criteria: VariableDeclarationExpression.isValid, factory: VariableDeclarationExpression.Parse },
         { criteria: AssignmentExpression.isValid, factory: AssignmentExpression.Parse },
         { criteria: ParenthesizedExpression.isValid, factory: ParenthesizedExpression.Parse },
         { criteria: BracketedExpression.isValid, factory: BracketedExpression.Parse },
         { criteria: IdentifierExpression.isValid, factory: IdentifierExpression.Parse },
         { criteria: MemberAccessExpression.isValid, factory: MemberAccessExpression.Parse },
         { criteria: LiteralExpression.isValid, factory: LiteralExpression.Parse },
         { criteria: BinaryExpression.isValid, factory: BinaryExpression.Parse },
         { criteria: FunctionCallExpression.isValid, factory: FunctionCallExpression.Parse }
       ];

   public static parse(tokens: TokenList, currentLine: Line): ParseExpressionResult {
     for (let index = 0 ; index < ExpressionFactory.factories.length ; index++) {
       const factory = ExpressionFactory.factories[index];
       if (factory.criteria(tokens)) {
         let source = new ExpressionSource(currentLine, tokens);
         return factory.factory(source);
       }
     }

     return newParseExpressionFailed(`Invalid expression: {tokens}`);
   }
}
