import {SourceFile} from "./sourceFile";
import {IParserLogger} from "./IParserLogger";
import {SourceReference} from "./sourceReference";
import {TokenizeResult} from "./tokens/tokenizeResult";
import {ITokenizer} from "./tokens/tokenizer";
import {TokenList} from "./tokens/tokenList";

export class Line {

  public tokensValues: TokenList | null = null;

  public index: number;
  public content: string;
  public file: SourceFile;

  public get tokens(): TokenList {
    if (!this.tokensValues) {
      throw new Error("Tokens not set");
    }
    return this.tokensValues;
  }

  constructor(index: number, content: string, file: SourceFile) {
    this.index = index;
    this.content = content;
    this.file = file;
  }

  public indent(logger: IParserLogger): number | null {
    let spaces: number = 0;
    let tabs = 0;

    let index = 0;

    for (; index < this.content.length; index++) {
      let value = this.content[index];
      if (value == ' ') {
        spaces++;
      } else if (value == '\t') {
        tabs++;
      } else {
        break;
      }
    }

    if (spaces > 0 && tabs > 0) {
      logger.fail(this.lineReference(index),
        `Don't mix spaces and tabs for indentations. Use 2 spaces or tabs.`);
      return null;
    }

    if (spaces % 2 != 0) {
      logger.fail(this.lineReference(index),
        `Wrong number of indent spaces {spaces}. Should be multiplication of 2. (line: ${this.index} line: ${this.content})`);
      return null;
    }

    return tabs > 0 ? tabs : spaces / 2;
  }

  public toString(): string {
    return `${this.index + 1}: ${this.content}`;
  }

  public isEmpty(): boolean {
    return this.tokens != null && this.tokens.length == 0;
  }

  public firstCharacter(): number {

    for (let index = 0; index < this.content.length; index++) {
      if (this.content[index] != ' ' && this.content[index] != '\\') {
        return index;
      }
    }

    return 0;
  }

  public tokenReference(tokenIndex: number): SourceReference {
    return new SourceReference(
      this.file,
      this.index + 1,
      this.tokens != null
        ? (this.tokens.characterPosition(tokenIndex) ?? 0) + 1
        : 1);
  }

  public lineEndReference(): SourceReference {
    return new SourceReference(
      this.file,
      this.index + 1,
      this.content.length);
  }

  public lineStartReference(): SourceReference {
    let lineStart = this.firstCharacter();
    return new SourceReference(
      this.file,
      this.index + 1,
      lineStart + 1);
  }

  public lineReference(characterIndex: number): SourceReference {
    return new SourceReference(
      this.file ?? new SourceFile('runtime'),
      this.index + 1,
      characterIndex + 1);
  }

  public tokenize(tokenizer: ITokenizer): TokenizeResult {
    let tokenizeResult = tokenizer.tokenize(this);
    if (tokenizeResult.state == 'success') {
      this.tokensValues = tokenizeResult.result;
    }
    return tokenizeResult;
  }
}