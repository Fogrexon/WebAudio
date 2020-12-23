// eslint-disable-next-line import/prefer-default-export
export const range = (start: number, end: number) => Array.from(
  { length: (end - start + 1) },
  (v, k) => k + start,
);
