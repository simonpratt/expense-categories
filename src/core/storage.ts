const storage = window.localStorage;

export default {
  setItem(key: string, value: string | number | Record<string, any>) {
    const stringified = JSON.stringify(value);
    storage.setItem(key, stringified);
  },
  getItem(key: string): string | number | Record<string, any> {
    const stringified = storage.getItem(key);
    return stringified ? JSON.parse(stringified) : undefined;
  },
};
