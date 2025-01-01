import {SourceFile} from "./sourceFile";

export class SourceReference {
  private readonly characterNumber: number | null;
  private readonly lineNumber: number | null;

  public readonly file: SourceFile;

  constructor(file: SourceFile, lineNumber: number, characterNumber: number) {
    this.file = file;
    this.lineNumber = lineNumber;
    this.characterNumber = characterNumber;
  }

  public toString(): string {
    return `${this.file.fileName}(${this.lineNumber}, ${this.characterNumber})`;
  }
}