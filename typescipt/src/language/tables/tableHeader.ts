import {INode, Node} from "../node";
import {ColumnHeader} from "./columnHeader";
import {SourceReference} from "../../parser/sourceReference";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {TableSeparatorToken} from "../../parser/tokens/tableSeparatorToken";
import {StringLiteralToken} from "../../parser/tokens/stringLiteralToken";
import {IValidationContext} from "../../parser/validationContext";
import {MemberAccessLiteral} from "../../parser/tokens/memberAccessLiteral";
import {firstOrDefault} from "../../infrastructure/enumerableExtensions";

export class TableHeader extends Node {

  private readonly columnsValue: Array<ColumnHeader>;

  public readonly nodeType = "TableHeader";

   public get columns(): ReadonlyArray<ColumnHeader> {
     return this.columnsValue;
   }

   constructor(columns: ColumnHeader[], reference: SourceReference) {
     super(reference);
     this.columnsValue = columns;
   }

   public static parse(context: IParseLineContext): TableHeader | null {
     let index = 0;
     let validator = context.validateTokens("TableHeader");

     if (!validator.type<TableSeparatorToken>(index, TableSeparatorToken).isValid) return null;

     let headers = new Array<ColumnHeader>();
     let tokens = context.line.tokens;
     while (++index < tokens.length) {
       if (!validator
           .type<StringLiteralToken>(index, StringLiteralToken)
           .type<StringLiteralToken>(index + 1, StringLiteralToken)
           .type<TableSeparatorToken>(index + 2, TableSeparatorToken)
           .isValid)
         return null;

       let typeName = tokens.tokenValue(index)
       let name = tokens.tokenValue(++index);
       let reference = context.line.tokenReference(index);

       if (typeName == null || name == null) return null;

       let header = ColumnHeader.parse(name, typeName, reference);
       headers.push(header);

       ++index;
     }

     return new TableHeader(headers, context.line.lineStartReference());
   }

   public override getChildren(): Array<INode> {
     return [...this.columnsValue];
   }

   protected override validate(context: IValidationContext): void {
   }

   public get(memberAccess: MemberAccessLiteral): ColumnHeader | null {
     let parts = memberAccess.parts;
     if (parts.length < 2) return null;
     let name = parts[1];

     return firstOrDefault(this.columnsValue, value => value.name == name);
   }
}
