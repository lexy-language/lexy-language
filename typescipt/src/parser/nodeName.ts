import {IParseLineContext} from "./ParseLineContext";

export class NodeName {
   public readonly name: string | null;
   public readonly keyword: string;

   constructor(keyword: string, name: string | null) {
     this.name = name;
     this.keyword = keyword;
   }

   public static parse(context: IParseLineContext): NodeName | null {
     let line = context.line;
     let tokens = line.tokens;
     if (tokens.length < 1 || tokens.length > 2) return null;

     let valid = context.validateTokens("NodeName")
       .keyword(0)
       .isValid;

     if (!valid) return null;

     let keyword = tokens.tokenValue(0);
     if (keyword == null) return null;
     if (tokens.length == 1) return new NodeName(keyword, null);

     valid = context.validateTokens("NodeName")
       .stringLiteral(1)
       .isValid;

     if (!valid) return null;

     let parameter = tokens.tokenValue(1);

     return new NodeName(keyword, parameter);
   }

   public toString(): string {
     return `${this.keyword} {this.name}`;
   }
}
