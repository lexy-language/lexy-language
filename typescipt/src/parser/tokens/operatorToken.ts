import {ParsableToken} from "./parsableToken";
import {OperatorType} from "./operatorType";
import {TokenValues} from "./tokenValues";
import {TokenCharacter} from "./tokenCharacter";
import {newParseTokenFinishedResult, ParseTokenResult} from "./parseTokenResult";
import {TableSeparatorToken} from "./tableSeparatorToken";
import {Character} from "./character";
import {isDigitOrLetter} from "./character";

export class OperatorCombinations {
  public firstChar: Character;
  public secondChar: Character | null;
  public type: OperatorType;

  constructor(firstChar: Character, secondChar: Character | null, type: OperatorType) {
    this.firstChar = firstChar;
    this.secondChar = secondChar;
    this.type = type;
  }
}

export class OperatorToken extends ParsableToken {

  public tokenIsLiteral = false;
  public tokenType = 'OperatorToken';
  public type: OperatorType = OperatorType.NotSet;

  private static readonly terminatorValues = [
    TokenValues.Space,
    TokenValues.ArgumentSeparator,
    TokenValues.Subtraction,
    TokenValues.OpenParentheses,
    TokenValues.OpenBrackets,
    TokenValues.CloseParentheses,
    TokenValues.CloseBrackets
  ];

  private static readonly operatorCombinations = [
    new OperatorCombinations(TokenValues.Assignment, null, OperatorType.Assignment),
    new OperatorCombinations(TokenValues.Addition, null, OperatorType.Addition),
    new OperatorCombinations(TokenValues.Subtraction, null, OperatorType.Subtraction),
    new OperatorCombinations(TokenValues.Multiplication, null, OperatorType.Multiplication),
    new OperatorCombinations(TokenValues.Division, null, OperatorType.Division),
    new OperatorCombinations(TokenValues.Modulus, null, OperatorType.Modulus),
    new OperatorCombinations(TokenValues.OpenParentheses, null, OperatorType.OpenParentheses),
    new OperatorCombinations(TokenValues.CloseParentheses, null, OperatorType.CloseParentheses),
    new OperatorCombinations(TokenValues.OpenBrackets, null, OperatorType.OpenBrackets),
    new OperatorCombinations(TokenValues.CloseBrackets, null, OperatorType.CloseBrackets),
    new OperatorCombinations(TokenValues.GreaterThan, null, OperatorType.GreaterThan),
    new OperatorCombinations(TokenValues.LessThan, null, OperatorType.LessThan),
    new OperatorCombinations(TokenValues.ArgumentSeparator, null, OperatorType.ArgumentSeparator),
    new OperatorCombinations(TokenValues.GreaterThan, TokenValues.Assignment, OperatorType.GreaterThanOrEqual),
    new OperatorCombinations(TokenValues.LessThan, TokenValues.Assignment, OperatorType.LessThanOrEqual),
    new OperatorCombinations(TokenValues.Assignment, TokenValues.Assignment, OperatorType.equals),
    new OperatorCombinations(TokenValues.NotEqualStart, TokenValues.Assignment, OperatorType.NotEqual),
    new OperatorCombinations(TokenValues.And, TokenValues.And, OperatorType.And),
    new OperatorCombinations(TokenValues.Or, TokenValues.Or, OperatorType.Or)
  ];

  constructor(character: TokenCharacter) {
    super(character);
    let operatorValue = character.value;
    OperatorToken.operatorCombinations.forEach(combination => {
      if (!combination.secondChar && combination.firstChar == operatorValue)
        this.type = combination.type;
    });
  }

  private terminatorValuescontains(value: number) {
    return OperatorToken.terminatorValues.findIndex(terminator => terminator == value) >= 0;
  }

  public parse(character: TokenCharacter): ParseTokenResult {
    let value = character.value;
    if (this.value.length == 1) {

      for (let index = 0; index < OperatorToken.operatorCombinations.length; index++) {
        let combination = OperatorToken.operatorCombinations[index];
        if (combination.secondChar
          && combination.secondChar == value
          && combination.firstChar == this.value.charCodeAt(0)) {
          this.type = combination.type;
          return newParseTokenFinishedResult(true);
        }
      }
    }

    if (isDigitOrLetter(value) || this.terminatorValuescontains(value)) {
      if (this.value.length == 1 && this.value.charCodeAt(0) == TokenValues.TableSeparator) {
        return {state: 'finished', charProcessed: false, newToken: new TableSeparatorToken(this.firstCharacter)};
      }
    }
    return {state: 'finished', charProcessed: false, newToken: null};
  }

  public finalize(): ParseTokenResult {
    if (this.value.length == 1 && this.value.charCodeAt(0) == TokenValues.TableSeparator) {
      return {state: 'finished', charProcessed: false, newToken: new TableSeparatorToken(this.firstCharacter)};
    }

    return {state: 'finished', charProcessed: false, newToken: null};
  }
}