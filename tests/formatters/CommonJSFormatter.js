import test from 'ava';
import { CommonJSFormatter } from 'formatters';


const COMMON_JS = /^module\.exports/;

test('should convert json to string as CJS', (t) => {
    t.plan(1);

    const data = { a: 'a' };

    const result = CommonJSFormatter.format(data).match(COMMON_JS);

    t.truthy(result);
});
