import * as React from 'react';

const newlineRegExp = /(\n|\\n)/g;

export const newLineToBreakTag = (str: string) =>
  str
    .split(newlineRegExp)
    .map(s => (newlineRegExp.test(s) ? <br key={s} /> : s));
