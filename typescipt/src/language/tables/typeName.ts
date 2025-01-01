

export class TypeName {
   public string Value { get; private set; } = Guid.NewGuid().toString(`D`);

   public parseName(parameter: string): void {
     Value = parameter;
   }
}
