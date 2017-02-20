import test from 'ava';
import {
    FORMAT,
    getFormatter,
    CommonJSFormatter,
    ES6Formatter
} from 'formatters';

test('all FORMATs should return something', (t) => {
    t.plan(Object.keys(FORMAT).length);

    Object.keys(FORMAT)
        .map((k) => FORMAT[k])
        .forEach((f) => {
            getFormatter(f);
            t.pass();
        });
});

test('all FORMATs should provide a format method which is a function', (t) => {
    t.plan(Object.keys(FORMAT).length);

    Object.keys(FORMAT)
        .map((k) => FORMAT[k])
        .map((f) => getFormatter(f))
        .forEach((f) => {
            t.is(typeof f.format, 'function');
        });
});

test('should throw on bad key', (t) => {
    t.plan(1);

    t.throws(() => getFormatter('💩'));
});

test('should return CommonJSFormatter', (t) => {
    t.plan(1);

    t.is(getFormatter('cjs'), CommonJSFormatter);
});

test('should return ES6Formatter', (t) => {
    t.plan(1);

    t.is(getFormatter('es6'), ES6Formatter);
});
