export class BuiltInNumberFunctions {
   public static int(value: number): number {
     return Math.floor(value);
   }

   public static abs(value: number): number {
     return Math.abs(value);
   }

   public static power(number: number, power: number): number {
     return Math.pow(number, power);
   }

   public static round(number: number, digits: number): number {
     const factor = Math.pow(10, digits);
     return (number >= 0 || -1) *  Math.round(Math.abs(number) * factor)/factor;
   }
}
