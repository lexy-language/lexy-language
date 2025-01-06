
export class BuiltInTableFunctions {
  /*
   public static TResult LookUp<TCondition, TRow, TResult>(
     resultName string,
     valueName string,
     string tableName,
     IReadOnlyArray<TRow> tableValues,
     TCondition condition,
     Func<TRow, TCondition> getValue,
     Func<TRow, TResult> getResult,
     IExecutionContext context)
     where TRow : class
     where TCondition : IComparable {
     if (tableValues == null) throw new Error(nameof(tableValues));
     if (getValue == null) throw new Error(nameof(getValue));
     if (getResult == null) throw new Error(nameof(getResult));
     let functionName = $`Lookup '{resultName}' by '{valueName}' from table '{tableName}'`;

     TRow lastRow = null;

     for (let index = 0; index < tableValues.Count; index++) {
       let row = tableValues[index];
       let value = getValue(row);

       let valueComparedToCondition = value.CompareTo(condition);
       if (valueComparedToCondition == 0) {
         context.LogDebug($`{functionName} returned value from row: {index + 1}`);
         return getResult(row);
       }

       if (valueComparedToCondition > 0) {
         context.LogDebug($`{functionName} returned value from previous row: {index}`);

         if (lastRow == null)
           throw new ExecutionException($`{functionName} failed. Search value '{condition}' not found.`);

         return getResult(lastRow);
       }

       lastRow = row;
     }

     if (lastRow == null)
       throw new ExecutionException($`{functionName} failed. Search value '{condition}' not found.`);

     context.LogDebug($`{functionName} returned value from last row: {tableValues.Count}`);
     return getResult(lastRow);
   }

   public static TRow LookUpRow<TCondition, TRow>(
     string valueName,
     string tableName,
     IReadOnlyArray<TRow> tableValues,
     TCondition condition,
     Func<TRow, TCondition> getValue,
     IExecutionContext context)
     where TRow : class
     where TCondition : IComparable {
     if (tableValues == null) throw new Error(nameof(tableValues));
     if (getValue == null) throw new Error(nameof(getValue));
     let functionName = $`LookupRow' by '{valueName}' from table '{tableName}'`;

     TRow lastRow = null;

     for (let index = 0; index < tableValues.Count; index++) {
       let row = tableValues[index];
       let value = getValue(row);

       let valueComparedToCondition = value.CompareTo(condition);
       if (valueComparedToCondition == 0) {
         context.LogDebug($`{functionName} returned value from row: {index + 1}`);
         return row;
       }

       if (valueComparedToCondition > 0) {
         context.LogDebug($`{functionName} returned value from previous row: {index}`);

         if (lastRow == null)
           throw new ExecutionException($`{functionName} failed. Search value '{condition}' not found.`);

         return lastRow;
       }

       lastRow = row;
     }

     if (lastRow == null)
       throw new ExecutionException($`{functionName} failed. Search value '{condition}' not found.`);

     context.LogDebug($`{functionName} returned value from last row: {tableValues.Count}`);
     return lastRow;
   }
   */
}
