// @ts-check

/** @type {import('lint-staged').Configuration} */
module.exports = {
  '*.{ts,html}': (files) => {
    const quote = (list) => list.map((f) => JSON.stringify(f)).join(' ');
    const tsFiles = files.filter((f) => f.endsWith('.ts'));

    return [
      `prettier --write ${quote(files)}`,
      ...(tsFiles.length ? [`eslint ${quote(tsFiles)}`] : []),
      // Type checks cover the whole project, since a change in one file can break another.
      // ngc also checks component templates; tsc covers the spec files.
      'ngc -p tsconfig.app.json --noEmit',
      'tsc -p tsconfig.spec.json --noEmit',
    ];
  },
  '*.{scss,css,json,md}': 'prettier --write',
};
