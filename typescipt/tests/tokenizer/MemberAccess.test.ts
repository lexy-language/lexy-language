import {tokenize} from "./tokenize";
import {MemberAccessLiteral} from "../../src/parser/tokens/memberAccessLiteral";

describe('MemberAccessTests', () => {
    it('TestTableHeader', async () => {
        tokenize("    Source.Member")
          .count(1)
            .type<MemberAccessLiteral>(0, MemberAccessLiteral)
            .memberAccess(0, "Source.Member")
            .assert();
    });
});