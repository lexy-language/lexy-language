import {TokenFactory} from "./tokenFactory";
import {TokenList} from "../../src/parser/tokens/tokenList";
import {validateStringLiteralToken} from "./tokenTestExtensions";

describe('TokensListTests', () => {
  it('tokensFrom', async () => {
    let list = new TokenList([
      TokenFactory.string(`123`),
      TokenFactory.string(`456`),
      TokenFactory.string(`789`)
    ]);

    let result = list.tokensFrom(1);
    expect(result.length).toBe(2);
    validateStringLiteralToken(result.get(0), `456`);
    validateStringLiteralToken(result.get(1), `789`);
  });

  it('tokensStart', async () => {
    let list = new TokenList([
      TokenFactory.string(`123`),
      TokenFactory.string(`456`),
      TokenFactory.string(`789`)
    ]);

    let result = list.tokensFromStart(2);
    expect(result.length).toBe(2);
    validateStringLiteralToken(result.get(0), `123`);
    validateStringLiteralToken(result.get(1), `456`);
  });

  it('tokensRange', async () => {
    let list = new TokenList([
      TokenFactory.string(`1111`),
      TokenFactory.string(`2222`),
      TokenFactory.string(`3333`),
      TokenFactory.string(`4444`),
      TokenFactory.string(`5555`)
    ]);

    let result = list.tokensRange(1, 3);
    expect(result.length).toBe(3);
    validateStringLiteralToken(result.get(0), `2222`);
    validateStringLiteralToken(result.get(1), `3333`);
    validateStringLiteralToken(result.get(2), `4444`);
  });
});
