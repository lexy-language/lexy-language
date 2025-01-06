import moment from "moment";

export class BuiltInDateFunctions {
   public static now(): Date {
     return new Date();
   }

   public static today(): Date {
     let now = new Date();
     return new Date(now.getFullYear(), now.getMonth(), now.getDay());
   }

   public static year(value: Date): number {
     return value.getFullYear();
   }

   public static month(value: Date): number {
     return value.getMonth() + 1;
   }

   public static day(value: Date): number {
     return value.getDay();
   }

   public static hour(value: Date): number {
     return value.getHours();
   }

   public static minute(value: Date): number {
     return value.getHours();
   }

   public static second(value: Date): number {
     return value.getSeconds();
   }

   public static years(end: Date, start: Date): number {
     return new moment(end).diff(moment(start), "years");
   }

   public static months(end: Date, start: Date): number {
     return new moment(end).diff(moment(start), "months");
   }

   public static days(end: Date, start: Date): number {
     return new moment(end).diff(moment(start), "days");
   }

   public static hours(end: Date, start: Date): number {
     return new moment(end).diff(moment(start), "hours");
   }

   public static minutes(end: Date, start: Date): number {
     return new moment(end).diff(moment(start), "minutes");
   }

   public static seconds(end: Date, start: Date): number {
     return new moment(end).diff(moment(start), "seconds");
   }
}
