import test from 'ava';
import { ES6Formatter } from 'formatters';


test('should convert json to string as ES6 with default name', (t) => {
    t.plan(1);

    const ES6 = /^export const sections =/i;
    const data = { a: 'a' };

    const result = ES6Formatter.format(data, {}).match(ES6);

    t.truthy(result);
});

test('should use specified export name', (t) => {
    const exportNames = [
        '💩',
        'things'
    ];
    t.plan(exportNames.length);

    const data = { a: 'a' };

    exportNames.forEach((name) => {
        const ES6 = `^export const ${name} =`;
        const result = ES6Formatter.format(data, { export: name }).match(ES6);

        t.truthy(result);
    });
});
