import fs from 'fs';

describe('handlebars dependency version', () => {
  it('resolves an installed handlebars package whose version is at least 4.7.10', () => {
    const handlebarsPackageJsonPath =
      require.resolve('handlebars/package.json');
    const handlebarsPackageJson = JSON.parse(
      fs.readFileSync(handlebarsPackageJsonPath, 'utf8'),
    );
    const resolvedVersion: string = handlebarsPackageJson.version;
    const [major, minor, patch] = resolvedVersion
      .split('.')
      .map((part) => parseInt(part, 10));

    const isAtLeastPatchedVersion =
      major > 4 ||
      (major === 4 && minor > 7) ||
      (major === 4 && minor === 7 && patch >= 10);

    expect(isAtLeastPatchedVersion).toBe(true);
  });
});
