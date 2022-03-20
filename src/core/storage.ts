const storage = window.localStorage;

export default {
  setItem<T = any>(key: string, value: T) {
    const stringified = JSON.stringify(value);
    storage.setItem(key, stringified);
  },
  getItem<T = any>(key: string): T {
    const stringified = storage.getItem(key);
    return stringified ? JSON.parse(stringified) : undefined;
  },
  removeItem(key: string) {
    storage.removeItem(key);
  },
};
