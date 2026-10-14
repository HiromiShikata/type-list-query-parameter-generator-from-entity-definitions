import fs from 'fs';
import path from 'path';
import semver from 'semver';

describe('scheduled dependency update minimum installed versions', () => {
  const packageLockJsonPath = path.resolve(
    __dirname,
    '..',
    'package-lock.json',
  );
  const packageLockJson = JSON.parse(
    fs.readFileSync(packageLockJsonPath, 'utf8'),
  );

  const cases: { packageName: string; minimumVersion: string }[] = [
    { packageName: '@babel/eslint-parser', minimumVersion: '8.0.7' },
    { packageName: '@semantic-release/npm', minimumVersion: '13.2.0' },
    { packageName: '@swc/core', minimumVersion: '1.16.13' },
    {
      packageName: 'conventional-changelog-conventionalcommits',
      minimumVersion: '10.4.1',
    },
    { packageName: 'dotenv', minimumVersion: '18.0.6' },
    { packageName: 'eslint', minimumVersion: '10.12.0' },
    { packageName: 'prettier', minimumVersion: '3.9.9' },
  ];

  test.each(cases)(
    'installed version of "$packageName" is at least "$minimumVersion"',
    ({ packageName, minimumVersion }) => {
      const lockEntry =
        packageLockJson.packages?.[`node_modules/${packageName}`];
      const installedVersion: string | undefined = lockEntry?.version;

      const isAtLeastMinimumVersion =
        installedVersion !== undefined &&
        semver.gte(installedVersion, minimumVersion);

      expect(isAtLeastMinimumVersion).toBe(true);
    },
  );
});
