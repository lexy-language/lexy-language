import {SourceReference} from "./sourceReference";
import {IRootNode} from "../language/rootNode";

export interface IParserLogger {

  logInfo(message: string): void;
  log(reference: SourceReference, message: string): void;
  fail(reference: SourceReference, message: string): void;

  /*
  fail(node: INode, reference: SourceReference, message: string);

  logNodes(IEnumerable<INode> nodes);

*/

  hasErrors(): boolean;

  /*
  bool HasRootErrors();

*/

  hasErrorMessage(expectedError: string): boolean;

  formatMessages(): string;

  /*
    bool NodeHasErrors(IRootNode node);

    string[] ErrorMessages();
    string[] ErrorRootMessages();
    string[] ErrorNodeMessages(IRootNode node);

    void AssertNoErrors();
*/

    setCurrentNode(node: IRootNode): void;
    reset(): void;
}