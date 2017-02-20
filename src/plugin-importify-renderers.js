function StylegudImportifyRenderers() {
    this.headers = [];
    this.importAs = {};
};

StylegudImportifyRenderers.prototype.parseSection = function(section) {
    // If there is no export, we just stringify it
    if (!section.renderer) {
        return;
    }

    // Add `rendererComponent` hook for esprimafying later
    section.getRenderers = section.renderer;

    if (!this.importAs[section.renderer]) {
        // "name" is the variable name of the imported component
        this.headers.push(section.renderer);
        this.importAs[section.renderer] = getUniqueImportName('renderer');
    }
};

StylegudImportifyRenderers.prototype.getHeaders = function() {
    return this.headers.map((header) => ({
        imports: [ { name: 'getRenderers', as: this.importAs[header] } ],
        path: header
    }));
};

StylegudImportifyRenderers.prototype.updateNode = function(node) {
    if (node.type === 'Property' && node.key.value === 'getRenderers') {
        node.value = {
            type: 'Identifier',
            name: this.importAs[node.value.value]
        };
    }
};

let counter = 0;
function getUniqueImportName(val) {
    counter++;
    return `${val}_${counter}`;
}

module.exports = StylegudImportifyRenderers;
