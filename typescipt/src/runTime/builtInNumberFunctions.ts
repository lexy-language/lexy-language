

export class BuiltInNumberFunctions {
   public static number(value: number): number {
     return Math.floor(value);
   }

   public static abs(value: number): number {
     return Math.abs(value);
   }

   public static power(number: number, power: number): number {
     return Math.pow(number, power);
   }

   public static round(number: number, digits: number): number {
     return parseFloat(number.toFixed(digits));
   }
}
