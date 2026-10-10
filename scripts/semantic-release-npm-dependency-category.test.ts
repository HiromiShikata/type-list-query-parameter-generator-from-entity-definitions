import fs from 'fs';
import path from 'path';

describe('@semantic-release/npm dependency category in package.json', () => {
  const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencyKey = '@semantic-release/npm';

  const cases: {
    sectionName: 'dependencies' | 'devDependencies';
    section: Record<string, string> | undefined;
    expectedKeyPresence: boolean;
  }[] = [
    {
      sectionName: 'dependencies',
      section: packageJson.dependencies,
      expectedKeyPresence: false,
    },
    {
      sectionName: 'devDependencies',
      section: packageJson.devDependencies,
      expectedKeyPresence: true,
    },
  ];

  test.each(cases)(
    'package.json "$sectionName" has "@semantic-release/npm" key: $expectedKeyPresence',
    ({ section, expectedKeyPresence }) => {
      const hasDependencyKey = Object.prototype.hasOwnProperty.call(
        section ?? {},
        dependencyKey,
      );

      expect(hasDependencyKey).toBe(expectedKeyPresence);
    },
  );
});
