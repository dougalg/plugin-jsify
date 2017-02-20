# Stylegud Plugin JSify

Converts stylegud JSON into a JavaScript file suitable for importing in a stylegud
styleguide.

## Installation

```
yarn add dev stylegud-plugin-jsify
```

## Usage

In your stylegud config data:

```
{
    plugins: [
        plugin: 'stylegud-plugin-jsify',
        format: 'es6',
        export: 'sections',
        importify: [
            'renderers',
            'exports'
        ]
    ]
}
```

## Named export

This plugin adds a named export (of your choice using the `export` option) to the JavaScript file generated.

```
[
    {
        "some data": "wooo"
    },
    ...
]
```

becomes

```
export const myName = [
    {
        "some data": "wooo"
    },
    ...
];
```

## Importifying

This plugin can also parse the JS so you can optionally convert renderers
and exported components to actual imported variables within the file. These
are imported within the file using absolute paths.

Importifying is required when using the default stylegud-styleguide to create
a styleguide.

### Exports

If you want to automatically load your JavaScript components in the styleguide,
this is probably the easiest way to do it. It will search for components with an
`exports` field and convert them to imports.

```
export const sections = [
    {
        'header': 'aTest',
        'description': 'a component'
        'source': {
            'filename': 'a_test.js',
            'path': '/Users/stylegud/Documents/someproject/beta/src/components/test',
            'export': 'aTest'
        }
    },
    ....
```

becomes

```
import { aTest } from '/Users/stylegud/Documents/someproject/beta/src/components/test/a_test.js';
export const sections = [
    {
        'header': 'aTest',
        'description': 'a component'
        'source': {
            'filename': 'a_test.js',
            'path': '/Users/stylegud/Documents/someproject/beta/src/components/test',
            'export': 'aTest',
            'exportedComponent': aTest
        }
    },
    ....
```

### Renderers

If the `renderers` key is specified in the importify list then renderers will
be imported:

```
export const sections = [
    {
        // non-relevant keys omitted here
        'header': 'Components',
        'description': 'My CSS component',
        'source': {
            'filename': 'defaults.scss',
            'path': '/Users/stylegud/Documents/someproject/beta/assets/css/base',
            'line': 1
        },
        'renderer': 'styleguide-renderer-css'
    },
    ...
```

becomes

```
import { getRenderers as renderer_1 } from 'styleguide-renderer-css';
export const sections = [
    {
        // non-relevant keys omitted here
        'header': 'Components',
        'description': 'My CSS component',
        'source': {
            'filename': '_vf_defaults.scss',
            'path': '/Users/dgraham/Documents/Viafoura-Front/beta/assets/css/base',
            'line': 1
        },
        'renderer': 'styleguide-renderer-css',
        'getRenderers': renderer_1
    },
    ...
```
