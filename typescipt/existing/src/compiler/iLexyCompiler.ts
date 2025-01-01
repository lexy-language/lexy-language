


namespace Lexy.Compiler.Compiler;

public interface ILexyCompiler
{
   CompilerResult Compile(IEnumerable<IRootNode> nodes);
}
