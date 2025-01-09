import {IFileSystem} from "../src/parser/IFileSystem";
import path from "path";
import fs from "fs";

export class NodeFileSystem implements IFileSystem {
  combine(fullPath: string, fileName: string): string {
    return path.join(fullPath, fileName);
  }

  fileExists(fullFinName: string): boolean {
    return fs.existsSync(fullFinName);
  }

  getDirectoryName(fileName: string): string {
    return path.dirname(fileName);
  }

  getFileName(fileName: string): string {
    return path.basename(fileName);
  }

  getFullPath(fileName: string): string {
    return path.resolve(fileName);
  }

  readAllLines(fileName: string): Array<string> {
    return fs.readFileSync(fileName)
      .toString('utf8')
      .split('\n');
  }

  directoryExists(absoluteFolder: string): boolean {
    return fs.existsSync(absoluteFolder);
  }

  getDirectories(folder: string): Array<string> {
    return fs.readdirSync(folder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
  }

  getDirectoryFiles(folder: string, extension: string): Array<string> {
    return fs.readdirSync(folder, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith(extension))
      .map(dirent => dirent.name);
  }

  isPathRooted(folder: string): boolean {
    return path.isAbsolute(folder);
  }

  currentFolder() {
    return __dirname
  }
}