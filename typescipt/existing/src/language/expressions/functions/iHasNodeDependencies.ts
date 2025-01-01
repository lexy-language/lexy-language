

namespace Lexy.Compiler.Language.Expressions.Functions;

internal interface IHasNodeDependencies
{
   IEnumerable<IRootNode> GetDependencies(RootNodeList rootNodeList);
}
