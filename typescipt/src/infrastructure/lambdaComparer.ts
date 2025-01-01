

export class LambdaComparer<T> extends IEqualityComparer<T> {
   private readonly Func<T, T, bool> expression;

   lambdaComparer(lambda: Func<T, T, bool>): public {
     expression = lambda;
   }

   public equals(x: T, y: T): boolean {
     return expression(x, y);
   }

   public getHashCode(obj: T): number {
     /*
     If you just return 0 for the hash the Equals comparer will kick in.
     The underlying evaluation checks the hash and then short circuits the evaluation if it is false.
     Otherwise, it checks the Equals. If you force the hash to be true (by assuming 0 for both objects),
     you will always fall through to the Equals check which is what we are always going for.
     */
     return 0;
   }
}
