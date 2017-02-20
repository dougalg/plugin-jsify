const path = require('path');


function StylegudImportifyExports() {
    this.namesToKeys = {};
    this.filesToNames = {};
    this.originalExports = {};
}

StylegudImportifyExports.prototype.parseSection = function(section) {
    // If there is no export, we just stringify it
    if (!section.source.export) {
        return;
    }

    // "name" is the variable name of the imported component
    let name = this._getExportedComponentName(section.source);
    this._setExportedSectionName(section.source, name);

    // Add `source.exportedComponent` hook for esprimafying later
    section.source.exportedComponent = name;
};

StylegudImportifyExports.prototype.getHeaders = function() {
    return Object.keys(this.filesToNames)
        .map((absPath) => this._getHeader(absPath));
};

StylegudImportifyExports.prototype.updateNode = function(node) {
    if (node.type === 'Property' && node.key.value === 'exportedComponent') {
        node.value = {
            type: 'Identifier',
            name: node.value.value
        };
    }
};

StylegudImportifyExports.prototype._getExportedComponentName = function(source) {
    const absPath = path.join(source.path, source.filename);
    const nameKey = `${absPath}#${source.export}`;

    // By default let's try to use the export as the name
    let name = source.export;
    let existingKey = this.namesToKeys[name];

    // If the name is in use and it is a different export, create new name
    if (existingKey && existingKey !== nameKey) {
        name = getUniqueExportName(source.export);
    }
    return name;
};

StylegudImportifyExports.prototype._setExportedSectionName = function(source, name) {
    const absPath = path.join(source.path, source.filename);
    const nameKey = `${absPath}#${source.export}`;

    // Store the key to name
    this.namesToKeys[name] = nameKey;

    // Store the name keyed by path for writing imports later
    const nameArray = this.filesToNames[absPath] || [];
    nameArray.push(name);
    this.filesToNames[absPath] = nameArray;

    // Store the original export name if necessary to enable
    // import { originalExport as uniqueName } from ...
    if (source.export !== name) {
        this.originalExports[`${absPath}#${name}`] = source.export;
    }
};

StylegudImportifyExports.prototype._getHeader = function(absPath) {
    const imports = this.filesToNames[absPath].map((name) => {
        const originalName = this.originalExports[`${absPath}#${name}`];
        if (originalName) {
            return { name: originalName, as: name };
        }
        return { name };
    });
    return { imports, path: absPath };
};

let counter = 0;
function getUniqueExportName(val) {
    counter++;
    return `${val}_${counter}`;
}

module.exports = StylegudImportifyExports;
