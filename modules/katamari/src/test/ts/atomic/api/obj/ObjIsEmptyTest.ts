import { Assert, UnitTest } from '@ephox/bedrock-client';
import fc from 'fast-check';
import * as Obj from 'ephox/katamari/api/Obj';

UnitTest.test('Obj.isEmpty: unit tests', () => {
  Assert.eq('eq', true, Obj.isEmpty({}));
  Assert.eq('eq', false, Obj.isEmpty({ cat: 'dog' }));
});

UnitTest.test('Obj.isEmpty: single key/value', () => {
  fc.assert(fc.property(
    fc.string(),
    fc.json(),
    (k: string, v: any) => {
      const o = { [k]: v };
      Assert.eq('eq', false, Obj.isEmpty(o));
    }
  ));
});
