import * as path from 'path';
import { EntityDefinitionRepository } from './adapter-interfaces/EntityDefinitionRepository';
import { ListQueryTypeRepository } from './adapter-interfaces/ListQueryTypeRepository';
import { ListQueryType } from '../entities/ListQueryType';

export { EntityDefinitionRepository, ListQueryTypeRepository };

export class ListQueryTypeGenerateUseCase {
  private readonly entityDefinitionRepository: EntityDefinitionRepository;
  private readonly listQueryTypeRepository: ListQueryTypeRepository;

  constructor(
    entityDefinitionRepository: EntityDefinitionRepository,
    listQueryTypeRepository: ListQueryTypeRepository,
  ) {
    this.entityDefinitionRepository = entityDefinitionRepository;
    this.listQueryTypeRepository = listQueryTypeRepository;
  }

  async run(entityDefinitionsPath: string, outputPath: string): Promise<void> {
    const entityDefinitions = await this.entityDefinitionRepository.getAll(
      entityDefinitionsPath,
    );

    for (const entityDefinition of entityDefinitions) {
      await this.listQueryTypeRepository.save(
        new ListQueryType(
          entityDefinition.name,
          entityDefinition.filePath,
          path.join(outputPath, `${entityDefinition.name}ListQuery.ts`),
        ),
      );
    }
  }
}
