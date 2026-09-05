import { EntityDefinition } from '../../entities/EntityDefinition';

export { EntityDefinition };

export class EntityDefinitionRepository {
  getAll(_entityDefinitionsPath: string): Promise<EntityDefinition[]> {
    throw new Error('Not implemented');
  }
}
