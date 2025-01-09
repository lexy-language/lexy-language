
export class SystemFunctions {
  public static populate(parameters, values) {
    for (let key in values) {
      if (values[key] && typeof values[key] === 'object' && values[key].constructor !== Date)  {
        this.populate(parameters[key], values[key]);
      } else {
        parameters[key] = values[key];
      }
    }
  }
}
