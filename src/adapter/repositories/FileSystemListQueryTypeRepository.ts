import * as fs from 'fs';
import * as path from 'path';

export class FileSystemListQueryTypeRepository {
  async save(listQueryType: {
    entityName: string;
    entityFilePath: string;
    outputFilePath: string;
  }): Promise<void> {
    const outputDir = path.dirname(listQueryType.outputFilePath);
    fs.mkdirSync(outputDir, { recursive: true });

    const relativeImport = this.computeRelativeImport(
      listQueryType.outputFilePath,
      listQueryType.entityFilePath,
    );

    const content = this.generateFileContent(
      listQueryType.entityName,
      relativeImport,
    );

    fs.writeFileSync(listQueryType.outputFilePath, content, 'utf8');
  }

  private computeRelativeImport(
    outputFilePath: string,
    entityFilePath: string,
  ): string {
    const outputDir = path.dirname(outputFilePath);
    const entityPathWithoutExt = entityFilePath.replace(/\.ts$/, '');
    let rel = path.relative(outputDir, entityPathWithoutExt);
    if (!rel.startsWith('.')) {
      rel = './' + rel;
    }
    return rel;
  }

  private generateFileContent(
    entityName: string,
    relativeImport: string,
  ): string {
    return (
      `import type { ${entityName} } from '${relativeImport}';\n` +
      `\n` +
      `export interface ${entityName}ListQuery {\n` +
      `  pagination: {\n` +
      `    limit: number;\n` +
      `    offset: number;\n` +
      `  };\n` +
      `  sort: {\n` +
      `    sortBy: keyof ${entityName};\n` +
      `    order: 'asc' | 'desc';\n` +
      `  };\n` +
      `  filters: ReadonlyArray<{\n` +
      `    field: keyof ${entityName};\n` +
      `    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';\n` +
      `    value: string | number | boolean | ReadonlyArray<string | number>;\n` +
      `  }>;\n` +
      `}\n`
    );
  }
}
