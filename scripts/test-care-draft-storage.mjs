import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync('src/shared/storage/secure-storage.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function loadStore(platform) {
  const contents = new Map();
  let writes = 0;
  const secure = {
    getItemAsync: async (key) => contents.get(key) ?? null,
    setItemAsync: async (key, value) => {
      if (value.length > 2048) throw new Error('SecureStore payload oversized');
      writes++;
      contents.set(key, value);
    },
    deleteItemAsync: async (key) => {
      contents.delete(key);
    },
  };
  const module = { exports: {} };
  const window = {
    localStorage: {
      getItem: (key) => contents.get(key) ?? null,
      setItem: (key, value) => contents.set(key, value),
      removeItem: (key) => contents.delete(key),
    },
  };
  const wrapper = runInNewContext('(function(require, module, exports) {\n' + compiled + '\n})', {
    Map,
    Promise,
    window,
    JSON,
    Error,
    Object,
    Array,
  });
  wrapper(
    (name) =>
      name === 'expo-secure-store'
        ? secure
        : name === 'react-native'
          ? { Platform: { OS: platform } }
          : assert.fail('Unexpected import ' + name),
    module,
    module.exports,
  );
  return { storage: module.exports.secureStorage, contents, countWrites: () => writes };
}

const ownRealm = (value) => JSON.parse(JSON.stringify(value));

for (const platform of ['ios', 'android', 'web']) {
  const { storage, contents, countWrites } = loadStore(platform);
  assert.deepEqual(ownRealm(await storage.getCareDrafts()), [], platform + ' starts empty');
  const first = {
    id: 'booking-provider1-service1',
    kind: 'booking',
    route: '/booking/slots',
    title: 'تنظيف',
    detail: 'اختيار موعد',
    updatedAt: 10,
    params: { providerId: 'provider1', serviceCode: 'service1' },
  };
  await storage.setCareDrafts([first]);
  assert.deepEqual(
    ownRealm(await storage.getCareDrafts()),
    [first],
    platform + ' must persist and restore',
  );
  const second = {
    ...first,
    route: '/booking/review',
    updatedAt: 11,
    booking: {
      providerId: 'provider1',
      serviceCode: 'service1',
      dateKey: '2026-10-25',
      note: 'ملاحظة جديدة',
      shareVisitSummary: false,
    },
  };
  await storage.setCareDrafts([second]);
  assert.deepEqual(
    ownRealm(await storage.getCareDrafts()),
    [second],
    platform + ' updates last step',
  );
  const another = { ...first, id: 'booking-provider2-service2' };
  await storage.setCareDrafts([second, another]);
  assert.equal((await storage.getCareDrafts()).length, 2, platform + ' handles multiple drafts');
  await storage.setCareDrafts([another]);
  assert.deepEqual(
    ownRealm(await storage.getCareDrafts()),
    [another],
    platform + ' deletes only targeted draft',
  );
  const before = countWrites();
  await storage.setCareDrafts([another]);
  assert.equal(countWrites(), before, platform + ' avoids redundant secure writes');
  await storage.clearCareDrafts();
  assert.deepEqual(
    ownRealm(await storage.getCareDrafts()),
    [],
    platform + ' clears drafts on logout',
  );
  assert.equal(
    [...contents.keys()].filter((k) => k.includes('care-drafts')).length,
    0,
    platform + ' removes sensitive storage keys',
  );
}
process.stdout.write('Booking draft secure-storage roundtrip passed on iOS, Android, and web mocks.\n');