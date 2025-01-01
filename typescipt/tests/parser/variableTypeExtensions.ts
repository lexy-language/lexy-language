

internal static class VariableTypeExtensions {
   public static shouldBePrimitiveType(type: VariableDeclarationType, name: string): void {
     type.ShouldBeOfType<PrimitiveVariableDeclarationType>()
       .Type.ShouldBe(name);
   }
}
