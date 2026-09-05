import { execSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const CLI = 'npx tsx ./src/adapter/entry-points/cli/index.ts';

const makeTmpDir = (): string =>
  fs.mkdtempSync(path.join(os.tmpdir(), 'cli-test-'));

describe('CLI', () => {
  it('outputs help with new argument signature', () => {
    const output = execSync(`${CLI} -h`).toString();

    expect(output).toContain('entityDefinitionsPath');
    expect(output).toContain('outputPath');
    expect(output).toContain(
      'type-list-query-parameter-generator-from-entity-definitions',
    );
  });

  it('generates ListQuery files for each uppercase-stem entity in the input directory', () => {
    const entityDir = makeTmpDir();
    const outputDir = makeTmpDir();
    try {
      fs.writeFileSync(
        path.join(entityDir, 'Order.ts'),
        'export type Order = { id: string; };',
      );
      fs.writeFileSync(
        path.join(entityDir, 'Product.ts'),
        'export type Product = { id: string; name: string; };',
      );
      fs.writeFileSync(
        path.join(entityDir, 'index.ts'),
        'export * from "./Order";',
      );

      execSync(`${CLI} ${entityDir} ${outputDir}`);

      expect(fs.existsSync(path.join(outputDir, 'OrderListQuery.ts'))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(outputDir, 'ProductListQuery.ts'))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(outputDir, 'indexListQuery.ts'))).toBe(
        false,
      );

      const orderContent = fs.readFileSync(
        path.join(outputDir, 'OrderListQuery.ts'),
        'utf8',
      );
      expect(orderContent).toContain('export interface OrderListQuery');
      expect(orderContent).toContain('sortBy: keyof Order');
      expect(orderContent).toContain('field: keyof Order');
    } finally {
      fs.rmSync(entityDir, { recursive: true });
      fs.rmSync(outputDir, { recursive: true });
    }
  });

  it('creates output directory when it does not exist', () => {
    const entityDir = makeTmpDir();
    const outputDir = path.join(makeTmpDir(), 'nested', 'output');
    const rootTmp = path.dirname(path.dirname(outputDir));
    try {
      fs.writeFileSync(
        path.join(entityDir, 'Order.ts'),
        'export type Order = { id: string; };',
      );

      execSync(`${CLI} ${entityDir} ${outputDir}`);

      expect(fs.existsSync(path.join(outputDir, 'OrderListQuery.ts'))).toBe(
        true,
      );
    } finally {
      fs.rmSync(entityDir, { recursive: true });
      fs.rmSync(rootTmp, { recursive: true });
    }
  });
});
