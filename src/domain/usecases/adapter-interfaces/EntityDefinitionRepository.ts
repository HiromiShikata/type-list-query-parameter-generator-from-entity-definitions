import { EntityDefinition } from '../../entities/EntityDefinition';

export { EntityDefinition };

export interface EntityDefinitionRepository {
  getAll(entityDefinitionsPath: string): Promise<EntityDefinition[]>;
}
