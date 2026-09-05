import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { FileSystemListQueryTypeRepository } from './FileSystemListQueryTypeRepository';

const makeTmpDir = (): string =>
  fs.mkdtempSync(path.join(os.tmpdir(), 'list-query-repo-test-'));

describe('FileSystemListQueryTypeRepository', () => {
  let tmpDir: string;
  const repo = new FileSystemListQueryTypeRepository();

  beforeEach(() => {
    tmpDir = makeTmpDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('writes a valid ListQuery file with correct relative import', async () => {
    const entityFilePath = path.join(tmpDir, 'entities', 'Order.ts');
    const outputFilePath = path.join(tmpDir, 'output', 'OrderListQuery.ts');

    await repo.save({
      entityName: 'Order',
      entityFilePath,
      outputFilePath,
    });

    expect(fs.existsSync(outputFilePath)).toBe(true);
    const content = fs.readFileSync(outputFilePath, 'utf8');
    expect(content).toContain("import type { Order } from '../entities/Order'");
    expect(content).toContain('export interface OrderListQuery');
    expect(content).toContain('sortBy: keyof Order');
    expect(content).toContain('field: keyof Order');
    expect(content).toContain('pagination');
    expect(content).toContain('sort');
    expect(content).toContain('filters');
  });

  it('creates output directory when it does not exist', async () => {
    const outputDir = path.join(tmpDir, 'nested', 'output');
    const outputFilePath = path.join(outputDir, 'OrderListQuery.ts');
    const entityFilePath = path.join(tmpDir, 'Order.ts');

    await repo.save({
      entityName: 'Order',
      entityFilePath,
      outputFilePath,
    });

    expect(fs.existsSync(outputFilePath)).toBe(true);
  });

  it('produces byte-identical output on repeated runs', async () => {
    const entityFilePath = path.join(tmpDir, 'entities', 'Product.ts');
    const outputFilePath = path.join(tmpDir, 'output', 'ProductListQuery.ts');
    const listQueryType = {
      entityName: 'Product',
      entityFilePath,
      outputFilePath,
    };

    await repo.save(listQueryType);
    const first = fs.readFileSync(outputFilePath);

    await repo.save(listQueryType);
    const second = fs.readFileSync(outputFilePath);

    expect(first.equals(second)).toBe(true);
  });

  it('uses ./ prefix when entity is in the same directory as output', async () => {
    const entityFilePath = path.join(tmpDir, 'Order.ts');
    const outputFilePath = path.join(tmpDir, 'OrderListQuery.ts');

    await repo.save({ entityName: 'Order', entityFilePath, outputFilePath });

    const content = fs.readFileSync(outputFilePath, 'utf8');
    expect(content).toContain("from './Order'");
  });

  it('generates no any and no type assertions in the output', async () => {
    const entityFilePath = path.join(tmpDir, 'Order.ts');
    const outputFilePath = path.join(tmpDir, 'OrderListQuery.ts');

    await repo.save({ entityName: 'Order', entityFilePath, outputFilePath });

    const content = fs.readFileSync(outputFilePath, 'utf8');
    expect(content).not.toContain(' any');
    expect(content).not.toContain(' as ');
  });
});
