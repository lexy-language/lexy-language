
export class SystemFunctions {
  public static populate(parameters, values) {
    for (let key in values) {
      if (typeof parameters[key] === 'object')  {
        this.populate(parameters[key], values[key]);
      } else {
        parameters[key] = values[key];
      }
    }
  }
}
