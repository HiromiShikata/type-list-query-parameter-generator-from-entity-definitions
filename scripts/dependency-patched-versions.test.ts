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

const findPackageJsonPaths = (
  nodeModulesDirectory: string,
  packageName: string,
): string[] => {
  const packageJsonPaths: string[] = [];

  for (const entry of fs.readdirSync(nodeModulesDirectory, {
    withFileTypes: true,
  })) {
    const entryPath = path.join(nodeModulesDirectory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === packageName) {
        const packageJsonPath = path.join(entryPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf8'),
          );
          if (packageJson.name === packageName) {
            packageJsonPaths.push(packageJsonPath);
          }
        }
      }
      packageJsonPaths.push(...findPackageJsonPaths(entryPath, packageName));
    }
  }

  return packageJsonPaths;
};

const findNonBundledPackageJsonPaths = (packageName: string): string[] => {
  const nodeModulesDirectory = path.join(process.cwd(), 'node_modules');
  return findPackageJsonPaths(nodeModulesDirectory, packageName).filter(
    (packageJsonPath) =>
      !path
        .relative(nodeModulesDirectory, packageJsonPath)
        .startsWith(`npm${path.sep}`),
  );
};

const minimumVersionByPackageName: Record<string, string> = {
  undici: '6.29.1',
  glob: '14.0.2',
  minimatch: '11.0.1',
};

describe('patched dependency versions', () => {
  for (const [packageName, minimumVersion] of Object.entries(
    minimumVersionByPackageName,
  )) {
    it(`resolves every non-bundled installed ${packageName} package to at least version ${minimumVersion}`, () => {
      const packageJsonPaths = findNonBundledPackageJsonPaths(packageName);

      expect(packageJsonPaths.length).toBeGreaterThan(0);

      for (const packageJsonPath of packageJsonPaths) {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf8'),
        );
        const resolvedVersion: string = packageJson.version;

        expect({
          packageJsonPath,
          satisfiesMinimum: isAtLeastVersion(resolvedVersion, minimumVersion),
        }).toEqual({ packageJsonPath, satisfiesMinimum: true });
      }
    });
  }
});
