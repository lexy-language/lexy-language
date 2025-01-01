

export class DuplicateChecker {
   public static void Validate<T>(IValidationContext context, Func<T, SourceReference> getReference,
     Func<T, string> getName, Func<T, string> getErrorMessage, params Array<T>[] lists) {
     if (context == null) throw new Error(nameof(context));
     if (getReference == null) throw new Error(nameof(getReference));
     if (getName == null) throw new Error(nameof(getName));
     if (getErrorMessage == null) throw new Error(nameof(getErrorMessage));
     if (lists == null) throw new Error(nameof(lists));

     let found = new Array<string>();
     foreach (let list in lists)
     foreach (let item in list) {
       let name = getName(item);
       if (found.Contains(name))
         context.Logger.Fail(getReference(item), getErrorMessage(item));
       else
         found.Add(name);
     }
   }

   public static void ValidateNode<T>(IValidationContext context, Func<T, SourceReference> getReference,
     Func<T, string> getName, Func<T, string> getErrorMessage, params Array<T>[] lists)
     where T : INode {
     if (context == null) throw new Error(nameof(context));
     if (getReference == null) throw new Error(nameof(getReference));
     if (getName == null) throw new Error(nameof(getName));
     if (getErrorMessage == null) throw new Error(nameof(getErrorMessage));
     if (lists == null) throw new Error(nameof(lists));

     let found = new Array<string>();
     foreach (let list in lists)
     foreach (let item in list) {
       let name = getName(item);
       if (found.Contains(name))
         context.Logger.Fail(item, getReference(item), getErrorMessage(item));
       else
         found.Add(name);
     }
   }
}
