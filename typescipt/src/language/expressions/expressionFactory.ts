import {TokenList} from "../../parser/tokens/tokenList";
import {ExpressionSource} from "./expressionSource";
import {newParseExpressionFailed, ParseExpressionResult} from "./parseExpressionResult";
import {Line} from "../../parser/line";

export class ExpressionFactory {

   private static factories: [{
      criteria: (tokens: TokenList) => boolean,
      factory: ((source: ExpressionSource) => ParseExpressionResult) }] = [
         { criteria: IfExpression.IsValid, factory: IfExpression.Parse },
         { criteria: ElseExpression.IsValid, factory: ElseExpression.Parse },
         { criteria: SwitchExpression.IsValid, factory: SwitchExpression.Parse },
         { criteria: CaseExpression.IsValid, factory: CaseExpression.Parse },
         { criteria: VariableDeclarationExpression.IsValid, factory: VariableDeclarationExpression.Parse },
         { criteria: AssignmentExpression.IsValid, factory: AssignmentExpression.Parse },
         { criteria: ParenthesizedExpression.IsValid, factory: ParenthesizedExpression.Parse },
         { criteria: BracketedExpression.IsValid, factory: BracketedExpression.Parse },
         { criteria: IdentifierExpression.IsValid, factory: IdentifierExpression.Parse },
         { criteria: MemberAccessExpression.IsValid, factory: MemberAccessExpression.Parse },
         { criteria: LiteralExpression.IsValid, factory: LiteralExpression.Parse },
         { criteria: BinaryExpression.IsValid, factory: BinaryExpression.Parse },
         { criteria: FunctionCallExpression.IsValid, factory: FunctionCallExpression.Parse }
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
