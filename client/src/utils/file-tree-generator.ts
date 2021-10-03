import { FileData } from '../data/model/model';

import TreeNode from './file-tree-node';

export default class FileTreeGenerator {
  private static nodeTracker: Map<string, TreeNode> = new Map();

  /**
   * Split a relative path into its parts
   * eg: takes 'src/path/index.ts' and return {parts:['src/path', 'src'], full:'src/path/index.ts', baseName: 'index.ts'}
   */
  private static generatePathParts(path: string): {
    parts: { path: string; index: number }[];
    full: string;
    baseName: string;
  } {
    const parts = [];
    const sepRegex = /\//g;
    const matches = path.matchAll(sepRegex);

    const lastSepIdx = path.lastIndexOf('/');
    const baseName = path.slice(lastSepIdx + 1);

    const pathLen = path.length;

    let match = matches.next();

    while (!match.done) {
      const part = {
        path: path.slice(0, match.value.index),
        index:
          lastSepIdx === (match.value.index as number)
            ? pathLen
            : 1 + -(lastSepIdx - (match.value.index as number)),
      };
      parts.unshift(part);
      match = matches.next();
    }

    return { parts, full: path, baseName };
  }

  private static createNodesFrom(
    parent: TreeNode,
    path: string,
    id: string
  ): void {
    const pathParts = path.split('/');
    const partsLen = pathParts.length;

    let currentNode = parent;
    let currentPath = currentNode.path;

    pathParts.forEach((name, index) => {
      currentPath += `/${name}`;
      const url = index === partsLen - 1 ? id : '';
      const newNode = new TreeNode(
        currentNode,
        name,
        url,
        currentNode.depth + 1,
        currentPath
      );
      FileTreeGenerator.nodeTracker.set(currentPath, newNode);
      currentNode.addChild(newNode);
      currentNode = newNode;
    });
  }

  static generateFileTree(rootFolderName: string, files: FileData[]): TreeNode {
    const treeRoot = new TreeNode(null, rootFolderName, '', 0, rootFolderName);
    FileTreeGenerator.nodeTracker.set(rootFolderName, treeRoot);

    files.forEach(({ name: path, id }) => {
      const pathParts = FileTreeGenerator.generatePathParts(path);
      let createFrom;
      let partIdx = 0;
      const partsLen = pathParts.parts.length;
      let part;

      while (partIdx < partsLen) {
        part = pathParts.parts[partIdx];
        if (FileTreeGenerator.nodeTracker.has(part.path)) {
          createFrom = FileTreeGenerator.nodeTracker.get(part.path);
          break;
        }
        partIdx += 1;
      }

      const basePath = `${pathParts.parts[0].path.slice(part?.index)}`;

      FileTreeGenerator.createNodesFrom(
        createFrom as TreeNode,
        basePath ? `${basePath}/${pathParts.baseName}` : pathParts.baseName,
        id
      );
    });
    // reset node tracker
    FileTreeGenerator.nodeTracker.clear();

    return treeRoot;
  }
}
