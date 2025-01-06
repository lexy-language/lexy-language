import {isNullOrEmpty} from "../parser/tokens/character";

export class VariableReference {

  public readonly path: string[];

  public get parentIdentifier(): string {
    return this.path[0];
  }

  public get hasChildIdentifiers(): boolean {
    return this.path.length > 1;
  }

  public get parts(): number {
    return this.path.length;
  }

  constructor(variablePath: string[]) {
    this.path = variablePath;
  }

  public toString(): string {
    const builder: string[] = [];
    for (const value of this.path) {
      if (builder.length > 0) builder.push('.');
      builder.push(value);
    }

    return builder.join('');
  }

  public childrenReference(): VariableReference {
    const parts = this.path.slice(1);
    return new VariableReference(parts);
  }

  static parse(key: string): VariableReference {
    if (isNullOrEmpty(key)) throw new Error("Invalid empty variable reference.")
    const parts = key.split(".");
    return new VariableReference(parts);
  }
}
