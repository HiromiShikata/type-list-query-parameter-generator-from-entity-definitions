import fs from 'fs';
import path from 'path';

const isAtLeastVersion = (
  resolvedVersion: string,
  minimumVersion: string,
): boolean => {
  const [resolvedMajor, resolvedMinor, resolvedPatch] = resolvedVersion
    .split('.')
    .map((part) => parseInt(part, 10));
  const [minimumMajor, minimumMinor, minimumPatch] = minimumVersion
    .split('.')
    .map((part) => parseInt(part, 10));

  if (resolvedMajor !== minimumMajor) {
    return resolvedMajor > minimumMajor;
  }
  if (resolvedMinor !== minimumMinor) {
    return resolvedMinor > minimumMinor;
  }
  return resolvedPatch >= minimumPatch;
};

describe('npm bundled dependency version', () => {
  it('resolves an installed npm package whose version is at least 11.21.1', () => {
    const npmPackageJsonPath = require.resolve('npm/package.json');
    const npmPackageJson = JSON.parse(
      fs.readFileSync(npmPackageJsonPath, 'utf8'),
    );
    const resolvedVersion: string = npmPackageJson.version;

    expect(isAtLeastVersion(resolvedVersion, '11.21.1')).toBe(true);
  });

  const npmBundledDependencyMinimumVersions: {
    packageName: string;
    minimumVersion: string;
  }[] = [
    { packageName: 'brace-expansion', minimumVersion: '5.0.12' },
    { packageName: 'http-cache-semantics', minimumVersion: '4.3.0' },
    { packageName: 'ip-address', minimumVersion: '10.7.1' },
    { packageName: 'postcss-selector-parser', minimumVersion: '7.1.6' },
    { packageName: 'undici', minimumVersion: '6.28.1' },
  ];

  test.each(npmBundledDependencyMinimumVersions)(
    'npm-bundled "$packageName" package resolves to at least version $minimumVersion',
    ({ packageName, minimumVersion }) => {
      const npmPackageJsonPath = require.resolve('npm/package.json');
      const bundledDependencyPackageJsonPath = path.join(
        path.dirname(npmPackageJsonPath),
        'node_modules',
        packageName,
        'package.json',
      );
      const bundledDependencyPackageJson = JSON.parse(
        fs.readFileSync(bundledDependencyPackageJsonPath, 'utf8'),
      );
      const resolvedVersion: string = bundledDependencyPackageJson.version;

      expect(isAtLeastVersion(resolvedVersion, minimumVersion)).toBe(true);
    },
  );
});
