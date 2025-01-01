import {SourceFile} from "../../parser/sourceFile";
import {Line} from "../../parser/line";
import {TokenList} from "../../parser/tokens/tokenList";
import {SourceReference} from "../../parser/sourceReference";

export class ExpressionSource {
   public file: SourceFile;
   public line: Line;
   public tokens: TokenList;

   constructor(line: Line, tokens: TokenList) {
     this.line = line;
     this.file = line.file;
     this.tokens = tokens;
   }

   public createReference(tokenIndex: number = 0): SourceReference {
     let token = this.tokens[tokenIndex];

     return new SourceReference(
       this.file,
       this.line.index + 1,
       token.firstCharacter.position + 1);
   }
}
