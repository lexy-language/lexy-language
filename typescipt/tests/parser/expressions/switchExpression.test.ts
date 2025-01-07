import {parseNodes} from "../../parseFunctions";
import {validateOfType} from "../../validateOfType";
import {asSwitchExpression, SwitchExpression} from "../../../src/language/expressions/switchExpression";

describe('SwitchExpressionTests', () => {
  it('checkSwitchStatement', async () => {
    const code = `Function: NumberSwitch
  Parameters
    number Evil
  Results
    number Number
  Code
    number temp = 555
    switch Evil
      case 6
        temp = 666
      case 7
        temp = 777
      default
        temp = 888
    Number = temp`;

    const {nodes, logger} = parseNodes(code);

    logger.assertNoErrors();

    const functionNode = nodes.getFunction("NumberSwitch");
    expect(functionNode).not.toBeNull();
    expect(functionNode?.code.expressions.length).toBe(3);
    validateOfType<SwitchExpression>(asSwitchExpression, functionNode?.code.expressions[1], expression => {
      expect(expression.cases.length).toBe(3);

      expect(expression.cases[0].value?.toString()).toBe("6");
      expect(expression.cases[0].expressions.length).toBe(1);
      expect(expression.cases[0].expressions[0].toString()).toBe("temp=666");

      expect(expression.cases[1].value?.toString()).toBe("7");
      expect(expression.cases[1].expressions.length).toBe(1);
      expect(expression.cases[1].expressions[0].toString()).toBe("temp=777");

      expect(expression.cases[2].value).toBeNull();
      expect(expression.cases[2].expressions.length).toBe(1);
      expect(expression.cases[2].expressions[0].toString()).toBe("temp=888");
    });
  });
});