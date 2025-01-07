import {IRootNode} from "../../../language/rootNode";
import {IRootTokenWriter} from "../../IRootTokenWriter";
import {asTable} from "../../../language/tables/table";
import {GeneratedType, GeneratedTypeKind} from "../../generatedType";
import {typeClassName} from "../classNames";
import {CodeWriter} from "./codeWriter";

export class EnumWriter implements IRootTokenWriter {

  private readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  public createCode(node: IRootNode): GeneratedType {
    const table = asTable(node);
    if (table == null) throw new Error(`Root token not Table`);

    const enumName = enumClassName(typeDefinition.name.value);

    const codeWriter = new CodeWriter(this.namespace);

     let members = WriteValues(enumDefinition);

     let enumNode = EnumDeclaration(className)
       .WithMembers(SeparatedArray<EnumMemberDeclarationSyntax>(members))
       .WithModifiers(Modifiers.Public());

    return new GeneratedType(GeneratedTypeKind.enum, node, enumName, codeWriter.toString());
   }

   private SyntaxNodeOrToken[writeValues(enumDefinition: EnumDefinition): ] {
     let result = new Array<SyntaxNodeOrToken>();
     foreach (let value in enumDefinition.Members) {
       if (result.Count > 0) result.Add(Token(SyntaxKind.CommaToken));

       let declaration = EnumMemberDeclaration(value.Name)
         .WithEqualsValue(
           EqualsValueClause(
             LiteralExpression(SyntaxKind.NumericLiteralExpression,
               Literal(value.NumberValue))));

       result.Add(declaration);
     }

     return result.ToArray();
   }
}
