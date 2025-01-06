import {isDigitOrLetter} from "../../parser/tokens/character";
import {LexyCodeConstants} from "../lexyCodeConstants";

const underscore =  '_'.charCodeAt(0);

export function functionClassName(functionName: string): string {
  return normalize(functionName, LexyCodeConstants.functionClassPrefix);
}

export function tableClassName(tableTypeName: string): string {
  return normalize(tableTypeName, LexyCodeConstants.tableClassPrefix);
}

export function enumClassName(enumName: string): string {
  return normalize(enumName, LexyCodeConstants.enumClassPrefix);
}

export function typeClassName(enumName: string): string {
  return normalize(enumName, LexyCodeConstants.typeClassPrefix);
}

export function normalize(functionName: string, functionClassPrefix: string | null = null): string {
  let nameBuilder: Array<string> = functionClassPrefix != null ? [functionClassPrefix] : [];
  for (let index = 0 ; index < functionName.length ; index ++) {
    const value = functionName.charCodeAt(index);
    if (validCharacter(value)) {
      nameBuilder.push(String.fromCharCode(value));
    }
  }

  return nameBuilder.join("");
}

function validCharacter(value: number): boolean {
  return isDigitOrLetter(value) || value == underscore;
}