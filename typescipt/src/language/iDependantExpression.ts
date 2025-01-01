

export interface IDependantExpression {
   void LinkPreviousExpression(Expression expression, IParseLineContext context);
}
