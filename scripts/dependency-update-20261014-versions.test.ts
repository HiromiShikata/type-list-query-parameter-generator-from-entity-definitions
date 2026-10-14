import fs from 'fs';
import path from 'path';
import semver from 'semver';

describe('scheduled dependency update minimum installed versions', () => {
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const packageLockJsonPath = path.resolve(
    __dirname,
    '..',
    'package-lock.json',
  );
  const packageLockJson = JSON.parse(
    fs.readFileSync(packageLockJsonPath, 'utf8'),
  );

  const cases: {
    packageName: string;
    minimumVersion: string;
    packageJsonLocation: 'dependencies' | 'devDependencies' | 'overrides';
    packageJsonMinimumVersion: string;
  }[] = [
    {
      packageName: '@babel/eslint-parser',
      minimumVersion: '8.0.7',
      packageJsonLocation: 'devDependencies',
      packageJsonMinimumVersion: '8.0.7',
    },
    {
      packageName: '@semantic-release/npm',
      minimumVersion: '13.2.0',
      packageJsonLocation: 'devDependencies',
      packageJsonMinimumVersion: '13.1.0',
    },
    {
      packageName: '@swc/core',
      minimumVersion: '1.16.13',
      packageJsonLocation: 'devDependencies',
      packageJsonMinimumVersion: '1.16.13',
    },
    {
      packageName: 'conventional-changelog-conventionalcommits',
      minimumVersion: '10.4.1',
      packageJsonLocation: 'devDependencies',
      packageJsonMinimumVersion: '10.2.1',
    },
    {
      packageName: 'dotenv',
      minimumVersion: '18.0.6',
      packageJsonLocation: 'dependencies',
      packageJsonMinimumVersion: '18.0.0',
    },
    {
      packageName: 'eslint',
      minimumVersion: '10.12.0',
      packageJsonLocation: 'devDependencies',
      packageJsonMinimumVersion: '10.8.0',
    },
    {
      packageName: 'prettier',
      minimumVersion: '3.9.9',
      packageJsonLocation: 'devDependencies',
      packageJsonMinimumVersion: '3.2.5',
    },
    {
      packageName: 'brace-expansion',
      minimumVersion: '5.0.12',
      packageJsonLocation: 'overrides',
      packageJsonMinimumVersion: '5.0.12',
    },
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

  test.each(cases)(
    'package.json declared version of "$packageName" is at least "$packageJsonMinimumVersion"',
    ({ packageName, packageJsonLocation, packageJsonMinimumVersion }) => {
      const declaredVersion: string | undefined =
        packageJson[packageJsonLocation]?.[packageName];
      const bareVersion: string | undefined = declaredVersion?.replace(
        /^[\^~]/,
        '',
      );

      const isAtLeastMinimumVersion =
        bareVersion !== undefined &&
        semver.gte(bareVersion, packageJsonMinimumVersion);

      expect(isAtLeastMinimumVersion).toBe(true);
    },
  );
});
