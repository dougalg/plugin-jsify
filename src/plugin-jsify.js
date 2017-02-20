const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

function PluginJSIfy(options = {}) {
    this.options = Object.assign({}, {
        format: 'es6',
        importify: [
            'renderers',
            'exports'
        ]
    }, options);
    this.initParsers();
};

PluginJSIfy.prototype.run = function(sections) {
    this.sections = sections;

    this.js = '';

    this.parseSections();
    this.writeJs();
    return this.js;
};

PluginJSIfy.prototype.initParsers = function() {
    this.parsers = this.options.importify
        .map((parser) => {
            const Parser = require(`./plugin-importify-${parser}`);
            return new Parser();
        });
};

PluginJSIfy.prototype.parseSections = function() {
    this.parsers.forEach((parser) => {
        this.sections.forEach((section) => parser.parseSection(section));
    });
};

PluginJSIfy.prototype.writeJs = function() {
    const headers = this.getHeaderStrings().join('\n');
    const base = `export const sections = ${JSON.stringify(this.sections)};`;

    this.js = this.rewriteJSON(`${headers}\n\n${base}\n`);
};

PluginJSIfy.prototype.getHeaderStrings = function() {
    return [].concat.apply([], this.parsers.map((parser) => parser.getHeaders()))
        .map(this.stringifyHeader);
};

PluginJSIfy.prototype.rewriteJSON = function(jsonString) {
    const ast = esprima.parse(jsonString, { sourceType: 'module' });
    const parsers = this.parsers;
    estraverse.traverse(ast, {
        enter(node) {
            parsers.forEach((parser) => parser.updateNode(node));
        }
    });
    return escodegen.generate(ast);
};

PluginJSIfy.prototype.stringifyHeader = function(header) {
    const imports = header.imports.map((imprt) => {
        if (imprt.as) {
            return `${imprt.name} as ${imprt.as}`;
        }
        return imprt.name;
    });
    return `import {\n\t${imports.join(',\n\t')}\n} from '${header.path}';`;
};

module.exports = PluginJSIfy;
