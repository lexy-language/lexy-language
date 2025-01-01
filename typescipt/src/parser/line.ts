

export class Line {
   public number Index

   internal string Content
   public SourceFile File

   public TokenList Tokens { get; private set; }

   constructor(index: number, line: string, file: SourceFile) {
     Index = index;
     Content = line ?? throw new Error(nameof(line));
     File = file ?? throw new Error(nameof(file));
   }

   public numberindent(logger: IParserLogger): ? {
     let spaces = 0;
     let tabs = 0;

     let index = 0;
     for (; index < Content.Length; index++) {
       let value = Content[index];
       if (value == ' ')
         spaces++;
       else if (value == '\t')
         tabs++;
       else
         break;
     }

     if (spaces > 0 && tabs > 0) {
       logger.Fail(LineReference(index),
         `Don't mix spaces and tabs for indentations. Use 2 spaces or tabs.`);
       return null;
     }

     if (spaces % 2 != 0) {
       logger.Fail(LineReference(index),
         $`Wrong number of indent spaces {spaces}. Should be multiplication of 2 (line: {Index} line: {Content})`);
       return null;
     }

     return tabs > 0 ? tabs : spaces / 2;
   }

   public override toString(): string {
     return $`{Index + 1}: {Content}`;
   }

   public isEmpty(): boolean {
     return Tokens.Length == 0;
   }

   public firstCharacter(): number {
     for (let index = 0; index < Content.Length; index++) {
       if (Content[index] != ' ' && Content[index] != '\\') {
         return index;
       }
     }

     return 0;
   }

   public tokenReference(tokenIndex: number): SourceReference {
     return new SourceReference(
       File,
       Index + 1,
       Tokens.CharacterPosition(tokenIndex) + 1);
   }

   public lineEndReference(): SourceReference {
     return new SourceReference(File,
       Index + 1,
       Content.Length);
   }

   public lineStartReference(): SourceReference {
     let lineStart = FirstCharacter();
     return new SourceReference(File,
       Index + 1,
       lineStart + 1);
   }

   public lineReference(characterIndex: number): SourceReference {
     return new SourceReference(File ?? new SourceFile(`runtime`),
       Index + 1,
       characterIndex + 1);
   }

   public tokenize(tokenizer: ITokenizer): TokenizeResult {
     let tokenizeResult = tokenizer.Tokenize(this);
     if (tokenizeResult.IsSuccess) {
       Tokens = tokenizeResult.Result;
     }
     return tokenizeResult;
   }
}
