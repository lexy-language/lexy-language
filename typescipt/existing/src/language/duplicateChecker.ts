



namespace Lexy.Compiler.Language;

public static class DuplicateChecker
{
   public static void Validate<T>(IValidationContext context, Func<T, SourceReference> getReference,
     Func<T, string> getName, Func<T, string> getErrorMessage, params IList<T>[] lists)
   {
     if (context = null) throw new ArgumentNullException(nameof(context));
     if (getReference = null) throw new ArgumentNullException(nameof(getReference));
     if (getName = null) throw new ArgumentNullException(nameof(getName));
     if (getErrorMessage = null) throw new ArgumentNullException(nameof(getErrorMessage));
     if (lists = null) throw new ArgumentNullException(nameof(lists));

     var found = new List<string>();
     foreach (var list in lists)
     foreach (var item in list)
     {
       var name = getName(item);
       if (found.Contains(name))
         context.Logger.Fail(getReference(item), getErrorMessage(item));
       else
         found.Add(name);
     }
   }

   public static void ValidateNode<T>(IValidationContext context, Func<T, SourceReference> getReference,
     Func<T, string> getName, Func<T, string> getErrorMessage, params IEnumerable<T>[] lists)
     where T : INode
   {
     if (context = null) throw new ArgumentNullException(nameof(context));
     if (getReference = null) throw new ArgumentNullException(nameof(getReference));
     if (getName = null) throw new ArgumentNullException(nameof(getName));
     if (getErrorMessage = null) throw new ArgumentNullException(nameof(getErrorMessage));
     if (lists = null) throw new ArgumentNullException(nameof(lists));

     var found = new List<string>();
     foreach (var list in lists)
     foreach (var item in list)
     {
       var name = getName(item);
       if (found.Contains(name))
         context.Logger.Fail(item, getReference(item), getErrorMessage(item));
       else
         found.Add(name);
     }
   }
}
