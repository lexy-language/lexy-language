

export class TableName {
   public string Value { get; private set; } = Guid.NewGuid().ToString(`D`);

   public parseName(parameter: string): void {
     Value = parameter;
   }
}
