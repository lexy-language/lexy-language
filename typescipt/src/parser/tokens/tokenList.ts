import {ILiteralToken} from "./ILiteralToken";
import {OperatorType} from "./operatorType";
import {Token} from "./token";
import {OperatorToken} from "./operatorToken";
import {CommentToken} from "./commentToken";

export class TokenList {
  private readonly values: Array<Token>;

  public get(index: number): Token {
    return this.values[index];
  }

  public get length(): number {
    return this.values.length;
  }

  constructor(values: Array<Token>) {
    this.values = values;
  }

  public isComment(): boolean {
    return this.values.length == 1 && this.values[0] instanceof CommentToken;
  }

  public tokenValue(index: number): string | null {
    return index >= 0 && index <= this.values.length - 1 ? this.values[index].value : null;
  }

  public tokensFrom(index: number): TokenList {
    this.checkValidTokenIndex(index);
    return this.tokensRange(0, this.values.length - 1);
  }

  public tokensFromStart(count: number): TokenList {
    return this.tokensRange(0, count - 1);
  }

  public tokensRange(start: number, last: number): TokenList {
    let range = this.values.slice(start, last + 1)

    return new TokenList(range);
  }

  public isTokenType<T>(index: number, type: any): boolean {
    return index >= 0 && index <= this.values.length - 1 && this.values[index] instanceof type;
  }

  public token<T extends Token>(index: number, type: Function): T | null {
    this.checkValidTokenIndex(index);

    return this.values[index].tokenType == type.name ? this.values[index] as T : null;
  }

  public literalToken(index: number): ILiteralToken | null {
    this.checkValidTokenIndex(index);

    return index >= 0
    && index <= this.values.length - 1
    && this.values[index].tokenIsLiteral
      ? this.values[index] as unknown as ILiteralToken
      : null;
  }

  public isLiteralToken(index: number): boolean {
    return index >= 0 && index <= this.values.length - 1 && this.values[index].tokenIsLiteral;
  }

  public isQuotedString(index: number): boolean {
    return index >= 0 && index <= this.values.length - 1 && this.values[index].tokenType == 'QuotedLiteralToken';
  }

  public isKeyword(index: number, keyword: string): boolean {
    return index >= 0
      && index <= this.values.length - 1
      && this.values[index].tokenType == 'KeywordToken'
      && this.values[index]?.value == keyword;
  }

  public isOperatorToken(index: number, type: OperatorType): boolean {
    return index >= 0
      && index <= this.values.length - 1
      && this.values[index].tokenType == 'OperatorToken'
      && (this.values[index] as OperatorToken).type == type;
  }

  public operatorToken(index: number): OperatorToken | null {
    return index >= 0
    && index <= this.values.length - 1
    && this.values[index].tokenType == 'OperatorToken'
      ? this.values[index] as OperatorToken
      : null;
  }

  public toString(): string {
    let builder = new Array<string>();
    this.values.map(value => {
      builder.push(`${value.tokenType}('${value.value}') `);
    })
    return builder.join('');
  }

  private checkValidTokenIndex(index: number) {
    if (index < 0 || index >= this.values.length)
      throw new Error(`Invalid token index ${index} (length: ${this.values.length})`);
  }

  public characterPosition(tokenIndex: number): number | null {
    if (tokenIndex < 0 || tokenIndex >= this.values.length) return null;

    return this.values[tokenIndex].firstCharacter.position;
  }

  public find<T extends Token>(func: ((where: T) => boolean), constr: Function): number {
    for (let index = 0; index < this.values.length; index++) {
      let value = this.values[index];
      if (value.tokenType == constr.name && func(value as T)) {
        return index;
      }
    }

    return -1;
  }
}