import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileSystemEntityDefinitionRepository } from './FileSystemEntityDefinitionRepository';

const makeTmpDir = (): string =>
  fs.mkdtempSync(path.join(os.tmpdir(), 'entity-def-test-'));

describe('FileSystemEntityDefinitionRepository', () => {
  let tmpDir: string;
  const repo = new FileSystemEntityDefinitionRepository();

  beforeEach(() => {
    tmpDir = makeTmpDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('returns entity definitions for uppercase-stem .ts files', async () => {
    fs.writeFileSync(path.join(tmpDir, 'Order.ts'), '');
    fs.writeFileSync(path.join(tmpDir, 'Product.ts'), '');

    const result = await repo.getAll(tmpDir);

    const names = result.map((e) => e.name).sort();
    expect(names).toEqual(['Order', 'Product']);
  });

  it('excludes lowercase-stem .ts files', async () => {
    fs.writeFileSync(path.join(tmpDir, 'index.ts'), '');
    fs.writeFileSync(path.join(tmpDir, 'utils.ts'), '');
    fs.writeFileSync(path.join(tmpDir, 'Order.ts'), '');

    const result = await repo.getAll(tmpDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Order');
  });

  it('excludes non-.ts files', async () => {
    fs.writeFileSync(path.join(tmpDir, 'Order.js'), '');
    fs.writeFileSync(path.join(tmpDir, 'Order.tsx'), '');
    fs.writeFileSync(path.join(tmpDir, 'Order.ts'), '');

    const result = await repo.getAll(tmpDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Order');
  });

  it('excludes subdirectories', async () => {
    const subDir = path.join(tmpDir, 'SubDir');
    fs.mkdirSync(subDir);
    fs.writeFileSync(path.join(subDir, 'Order.ts'), '');
    fs.writeFileSync(path.join(tmpDir, 'Product.ts'), '');

    const result = await repo.getAll(tmpDir);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Product');
  });

  it('returns absolute filePaths', async () => {
    fs.writeFileSync(path.join(tmpDir, 'Order.ts'), '');

    const result = await repo.getAll(tmpDir);

    expect(path.isAbsolute(result[0].filePath)).toBe(true);
    expect(result[0].filePath).toBe(path.join(tmpDir, 'Order.ts'));
  });

  it('returns empty array when directory has no matching files', async () => {
    const result = await repo.getAll(tmpDir);
    expect(result).toEqual([]);
  });

  it('throws when directory does not exist', async () => {
    await expect(
      repo.getAll('/nonexistent/path/that/does/not/exist'),
    ).rejects.toThrow();
  });
});
