import * as path from 'path';
import { ListQueryType } from '../entities/ListQueryType';

export class ListQueryTypeGenerateUseCase {
  private readonly entityDefinitionRepository: {
    getAll(
      entityDefinitionsPath: string,
    ): Promise<{ name: string; filePath: string }[]>;
  };
  private readonly listQueryTypeRepository: {
    save(listQueryType: ListQueryType): Promise<void>;
  };

  constructor(
    entityDefinitionRepository: {
      getAll(
        entityDefinitionsPath: string,
      ): Promise<{ name: string; filePath: string }[]>;
    },
    listQueryTypeRepository: {
      save(listQueryType: ListQueryType): Promise<void>;
    },
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
