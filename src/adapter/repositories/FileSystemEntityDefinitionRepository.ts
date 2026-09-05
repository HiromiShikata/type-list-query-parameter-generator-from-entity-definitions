import * as fs from 'fs';
import * as path from 'path';
import { EntityDefinition } from '../../domain/entities/EntityDefinition';

export class FileSystemEntityDefinitionRepository {
  async getAll(entityDefinitionsPath: string): Promise<EntityDefinition[]> {
    const entries = fs.readdirSync(entityDefinitionsPath, {
      withFileTypes: true,
    });

    const entityDefinitions: EntityDefinition[] = [];
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith('.ts')) continue;
      const stem = entry.name.slice(0, -'.ts'.length);
      if (!/^[A-Z]/.test(stem)) continue;

      entityDefinitions.push(
        new EntityDefinition(
          stem,
          path.resolve(entityDefinitionsPath, entry.name),
        ),
      );
    }

    return entityDefinitions;
  }
}
