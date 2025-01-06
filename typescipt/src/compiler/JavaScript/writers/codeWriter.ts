export class CodeWriter {
  private builder: Array<string> = [];
  private indent = 0;

  startLine(value: string | null = null) {
    if (value != null) {
      this.builder.push(this.indentString() + value);
    } else {
      this.builder.push(this.indentString());
    }
  }

  endLine(value: string | null = null) {
    if (value != null) {
      this.builder.push(value + "\n");
    } else {
      this.builder.push("\n");
    }
  }

  writeLine(value: string) {
    this.builder.push(' '.repeat(this.indent * 2) + value + "\n");
  }

  write(value: string) {
    this.builder.push(value);
  }

  openScope(name: string) {
    this.writeLine(name + " {")
    this.indent++
  }

  closeScope(suffix: string | null = null) {
    this.indent--;
    if (suffix != null) {
      this.writeLine("}" + suffix)
    } else {
      this.writeLine("}")
    }
  }

  public toString(): string {
    return this.builder.join("")
  }

  private indentString() {
    return ' '.repeat(this.indent * 2);
  }
}