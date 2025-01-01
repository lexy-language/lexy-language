

export class BuiltInNumberFunctions {
   public static number(value: decimal): decimal {
     return Math.Floor(value);
   }

   public static abs(value: decimal): decimal {
     return Math.Abs(value);
   }

   public static power(number: decimal, power: decimal): decimal {
     return (decimal)Math.Pow((double)number, (double)power);
   }

   public static round(number: decimal, digits: decimal): decimal {
     return Math.Round(number, (number)digits);
   }
}
