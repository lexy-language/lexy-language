export class CodeWriter {
  private readonly builder: Array<string> = [];
  private readonly namespace;
  private indent = 0;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

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
    this.builder.push(this.indentString() + value + "\n");
  }

  write(value: string) {
    this.builder.push(value);
  }

  writeNamespace() {
    this.builder.push(this.namespace);
  }

  openScope(name: string) {
    this.writeLine(name + " {")
    this.indent++
  }

  openInlineScope(value: string) {
    this.endLine(value + " {")
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

  openBrackets(name: string) {
    this.writeLine(name + " [")
    this.indent++
  }

  closeBrackets(suffix: string | null = null) {
    this.indent--;
    if (suffix != null) {
      this.writeLine("]" + suffix)
    } else {
      this.writeLine("]")
    }
  }

  public toString(): string {
    return this.builder.join("")
  }

  private indentString() {
    return ' '.repeat(this.indent * 2);
  }
}