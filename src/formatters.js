/**
 * @enum {String}
 */
const FORMAT = {
    CJS: 'cjs',
    ES6: 'es6'
};

/**
 * Finds and returns an object with a format method
 *
 * @param {String} format The name of the format we want to produce
 * @throws {NotImplementedError} Throws if invalid format is passed
 * @returns {Object} An object with a format() method
 */
function getFormatter(format) { // eslint-disable-line consistent-return
    switch (format) {
        case FORMAT.CJS:
            return CommonJSFormatter;
        case FORMAT.ES6:
            return ES6Formatter;
        default:
            throw Error(`Formatter of type ${format} not implemented`);
    }
}

const ES6Formatter = {
    /**
     * Creates a javascript file string which exports an object
     *
     * @param {Object} json The data to stringify
     * @param {Object} options All options passed by a user for the es6 output format
     * @param {String} [options.export=sections] The variable name to export from the JS module
     * @returns {String} A string of a JS file with es module export synax
     */
    format(json, options) {
        const exportName = options.export || 'sections';
        return `export const ${exportName} = ${JSON.stringify(json)};`;
    }
};

const CommonJSFormatter = {
    /**
     * Creates a javascript file string which exports an object
     *
     * @param {Object} json The data to stringify
     * @returns {String} A string of a JS file with cjs module export synax
     */
    format(json) { return `module.exports = ${JSON.stringify(json)};`; }
};

module.exports = {
    getFormatter,
    FORMAT,
    ES6Formatter,
    CommonJSFormatter
};
