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

const findFastUriPackageJsonPaths = (directory: string): string[] => {
  const packageJsonPaths: string[] = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'fast-uri') {
        const packageJsonPath = path.join(entryPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf8'),
          );
          if (packageJson.name === 'fast-uri') {
            packageJsonPaths.push(packageJsonPath);
          }
        }
      }
      packageJsonPaths.push(...findFastUriPackageJsonPaths(entryPath));
    }
  }

  return packageJsonPaths;
};

describe('fast-uri dependency version', () => {
  it('resolves every installed fast-uri package to at least version 3.1.9', () => {
    const packageJsonPaths = findFastUriPackageJsonPaths(
      path.join(process.cwd(), 'node_modules'),
    );

    expect(packageJsonPaths.length).toBeGreaterThan(0);

    for (const packageJsonPath of packageJsonPaths) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const resolvedVersion: string = packageJson.version;

      expect(isAtLeastVersion(resolvedVersion, '3.1.9')).toBe(true);
    }
  });
});
