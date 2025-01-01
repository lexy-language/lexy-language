

export class EnumerableExtensions {
   public static forEach<TItem>(enumerable: Array<TItem>, action: Action<TItem>): Array<TItem> {
     if (enumerable == null) throw new Error(nameof(enumerable));
     if (action == null) throw new Error(nameof(action));

     foreach (let item in enumerable) action(item);

     return enumerable;
   }

   public static format<TItem>(enumerable: Array<TItem>, indentLevel: number): string {
     if (enumerable == null) throw new Error(nameof(enumerable));

     let indent = indentLevel > 0 ? new string(' ', 4) : string.Empty;
     let builder = new StringBuilder();
     builder.AppendLine();
     foreach (let item in enumerable) builder.AppendLine(indent + item);

     return builder.toString();
   }

   public static formatLine<TItem>(enumerable: Array<TItem>, separator: string): string {
     if (enumerable == null) throw new Error(nameof(enumerable));

     let builder = new StringBuilder();
     foreach (let item in enumerable) {
       if (builder.length > 0) builder.Append(separator);

       builder.Append(item);
     }

     return builder.toString();
   }
}
