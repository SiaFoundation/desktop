"use strict";
// from: https://gist.github.com/robin-hartmann/ad6ffc19091c9e661542fbf178647047
// issue: https://github.com/electron/forge/issues/2306
// A bundler for locating local packages from workspaces, because Electron Forge does not support NPM workspaces out of the box
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundle = void 0;
const fs = require('fs/promises');
const path = require('path');
const { findRoot } = require('@manypkg/find-root');
const arborist = require('@npmcli/arborist');
const resolveLink = (node) => {
    return node.isLink ? resolveLink(node.target) : node;
};
const getWorkspaceByPath = (node, realPath) => {
    return [...node.edgesOut.values()]
        .filter((depEdge) => depEdge.workspace)
        .map((depEdge) => resolveLink(depEdge.to))
        .find((depNode) => depNode.realpath === realPath);
};
const collectProdDeps = (node) => {
    return [...node.edgesOut.values()]
        .filter((depEdge) => depEdge.type === 'prod')
        .map((depEdge) => resolveLink(depEdge.to))
        .flatMap((depNode) => [depNode, ...collectProdDeps(depNode)]);
};
const bundle = async (source, destination) => {
    const root = await findRoot(source);
    const rootNode = await new arborist({ path: root.rootDir }).loadActual();
    const sourceNode = getWorkspaceByPath(rootNode, source);
    if (!sourceNode) {
        throw new Error(`Couldn't find source node. [Debug Info] source: ${source} `);
    }
    const prodDeps = collectProdDeps(sourceNode);
    for (const dep of prodDeps) {
        const dest = dep.isWorkspace
            ? path.join(destination, 'node_modules', dep.packageName)
            : path.join(destination, dep.location);
        await fs.cp(dep.realpath, dest, {
            recursive: true,
            errorOnExist: false,
            dereference: true,
        });
    }
};
exports.bundle = bundle;
