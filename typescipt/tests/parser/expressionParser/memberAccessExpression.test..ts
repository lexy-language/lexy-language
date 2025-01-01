

export class MemberAccessExpressionTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public simpleMemberAccess(): void {
     let expression = this.ParseExpression(`A = B.C`);
     expression.ValidateOfType<AssignmentExpression>(assignmentExpression => {
       assignmentExpression.Variable.ValidateIdentifierExpression(`A`);
       assignmentExpression.Assignment.ValidateOfType<MemberAccessExpression>(memberAccess =>
         memberAccess.Variable.ToString().ShouldBe(`B.C`));
     });
   }
}
