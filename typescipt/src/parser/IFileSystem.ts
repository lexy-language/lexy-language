export interface IFileSystem {

  readAllLines(fileName: string): Array<string>;

  getFileName(fullFileName: string): string;
  getDirectoryName(parentFullFileName: string): string;
  getFullPath(directName: string): string;

  combine(fullPath: string, fileName: string): string;

  fileExists(fullFinName: string): boolean;
  directoryExists(absoluteFolder: string): boolean;

  isPathRooted(folder: string): boolean;

  getDirectoryFiles(folder: string, filter: string): Array<string>;
  getDirectories(folder: string): Array<string>;
}