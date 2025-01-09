
export class BuiltInTableFunctions {

  public static lookUp(resultName, valueName, tableName, tableValues, condition, context) {
    let functionName = `Lookup '${resultName}' by '${valueName}' from table '${tableName}'`;

    let lastRow = null;

    for (let index = 0; index < tableValues.length; index++) {
      let row = tableValues[index];
      let value = row[valueName];

      //let valueComparedToCondition = value.CompareTo(condition);
      if (value == condition) {
        context.logDebug(`${functionName} returned value from row: ${index + 1}`);
        return row[resultName];
      }

      if (value > condition) {
        context.logDebug(`{functionName} returned value from previous row: {index}`);

        if (lastRow == null) {
          throw new Error(`${functionName} failed. Search value '${condition}' not found.`);
        }

        return lastRow[resultName];
      }

      lastRow = row;
    }

    if (lastRow == null) {
      throw new Error(`${functionName} failed. Search value '${condition}' not found.`);
    }

    context.logDebug(`${functionName} returned value from last row: ${tableValues.length}`);
    return lastRow[resultName];
  }

  public static lookUpRow(valueName, tableName, tableValues, condition, context) {
    let functionName = `Lookup row by '${valueName}' from table '${tableName}'`;

    let lastRow = null;

    for (let index = 0; index < tableValues.length; index++) {
      let row = tableValues[index];
      let value = row[valueName];

      //let valueComparedToCondition = value.CompareTo(condition);
      if (value == condition) {
        context.logDebug(`${functionName} returned value from row: ${index + 1}`);
        return row;
      }

      if (value > condition) {
        context.logDebug(`{functionName} returned value from previous row: {index}`);

        if (lastRow == null) {
          throw new Error(`${functionName} failed. Search value '${condition}' not found.`);
        }

        return lastRow;
      }

      lastRow = row;
    }

    if (lastRow == null) {
      throw new Error(`${functionName} failed. Search value '${condition}' not found.`);
    }

    context.logDebug(`${functionName} returned value from last row: ${tableValues.length}`);
    return lastRow;
  }
}