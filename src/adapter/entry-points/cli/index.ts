#!/usr/bin/env node
import { Command } from 'commander';
import { FileSystemEntityDefinitionRepository } from '../../repositories/FileSystemEntityDefinitionRepository';
import { FileSystemListQueryTypeRepository } from '../../repositories/FileSystemListQueryTypeRepository';
import { ListQueryTypeGenerateUseCase } from '../../../domain/usecases/ListQueryTypeGenerateUseCase';

const program = new Command();
program
  .argument(
    '<entityDefinitionsPath>',
    'Path to directory containing entity TypeScript files',
  )
  .argument(
    '<outputPath>',
    'Path to directory where generated ListQuery files are written',
  )
  .name('type-list-query-parameter-generator-from-entity-definitions')
  .description(
    'Generate ListQuery TypeScript interfaces from entity definitions',
  )
  .action(async (entityDefinitionsPath: string, outputPath: string) => {
    const entityDefinitionRepository =
      new FileSystemEntityDefinitionRepository();
    const listQueryTypeRepository = new FileSystemListQueryTypeRepository();
    const useCase = new ListQueryTypeGenerateUseCase(
      entityDefinitionRepository,
      listQueryTypeRepository,
    );
    await useCase.run(entityDefinitionsPath, outputPath);
  });

if (process.argv) {
  program.parse(process.argv);
}
