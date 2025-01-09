import {asNumberLiteralToken, NumberLiteralToken} from "../../parser/tokens/numberLiteralToken";
import {SourceReference} from "../../parser/sourceReference";
import {INode, Node} from "../node";
import {IParseLineContext} from "../../parser/ParseLineContext";
import {OperatorType} from "../../parser/tokens/operatorType";
import {IValidationContext} from "../../parser/validationContext";
import {isValidIdentifier} from "../../parser/tokens/character";
import {NodeType} from "../nodeType";

export class EnumMember extends Node {

  public nodeType = NodeType.EnumMember;
  public name: string;
  public valueLiteral: NumberLiteralToken | null;
  public numberValue: number;

  constructor(name: string, reference: SourceReference, valueLiteral: NumberLiteralToken | null, value: number) {
     super(reference);
     this.numberValue = value;
     this.name = name;
     this.valueLiteral = valueLiteral;
   }

   public static parse(context: IParseLineContext, lastIndex: number): EnumMember | null {
     let valid = context.validateTokens("EnumMember")
       .countMinimum(1)
       .stringLiteral(0)
       .isValid;

     if (!valid) return null;

     let line = context.line;
     let tokens = line.tokens;
     let name = tokens.tokenValue(0);
     if (!name) return null;

     let reference = line.lineStartReference();

     if (tokens.length == 1) return new EnumMember(name, reference, null, lastIndex + 1);

     if (tokens.length != 3) {
       context.logger.fail(line.lineEndReference(), `Invalid number of tokens: ${tokens.length}. Should be 1 or 3.`);
       return null;
     }

     valid = context.validateTokens("EnumMember")
       .operator(1, OperatorType.Assignment)
       .numberLiteral(2)
       .isValid;
     if (!valid) return null;

     let value = tokens.token<NumberLiteralToken>(2, asNumberLiteralToken);
     if (value == null )return null;

     return new EnumMember(name, reference, value, value.numberValue);
   }

   public override getChildren(): Array<INode> {
     return [];
   }

   protected override validate(context: IValidationContext): void {
     this.validateMemberName(context);
     this.validateMemberValues(context);
   }

   private validateMemberName(context: IValidationContext): void {
     if (this.name == null || this.name =='') {
       context.logger.fail(this.reference, `Enum member name should not be null or empty.`);
     } else if (!isValidIdentifier(this.name)) {
       context.logger.fail(this.reference, `Invalid enum member name: ${this.name}.`);
     }
   }

   private validateMemberValues(context: IValidationContext): void {
     if (this.valueLiteral == null) return;

     if (this.valueLiteral.numberValue < 0) {
       context.logger.fail(this.reference, `Enum member value should not be < 0: ${this.valueLiteral}`);
     }

     if (this.valueLiteral.isDecimal()) {
       context.logger.fail(this.reference, `Enum member value should not be decimal: ${this.valueLiteral}`);
     }
   }
}
