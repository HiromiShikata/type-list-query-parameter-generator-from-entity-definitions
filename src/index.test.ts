import {
  ListQueryTypeGenerateUseCase,
  EntityDefinition,
  ListQueryType,
} from './index';

describe('public API', () => {
  it('exports ListQueryTypeGenerateUseCase as a class', () => {
    expect(typeof ListQueryTypeGenerateUseCase).toBe('function');
  });

  it('exports EntityDefinition as a class that can be instantiated', () => {
    const entity = new EntityDefinition('Order', '/path/Order.ts');
    expect(entity.name).toBe('Order');
    expect(entity.filePath).toBe('/path/Order.ts');
  });

  it('exports ListQueryType as a class that can be instantiated', () => {
    const lqt = new ListQueryType(
      'Order',
      '/path/Order.ts',
      '/output/OrderListQuery.ts',
    );
    expect(lqt.entityName).toBe('Order');
    expect(lqt.entityFilePath).toBe('/path/Order.ts');
    expect(lqt.outputFilePath).toBe('/output/OrderListQuery.ts');
  });

  it('ListQueryTypeGenerateUseCase generates ListQuery types from entity definitions', async () => {
    const entityRepo = {
      getAll: async (_path: string) => [
        new EntityDefinition('Order', '/project/entities/Order.ts'),
      ],
    };
    const saved: ListQueryType[] = [];
    const listQueryRepo = {
      save: async (lqt: ListQueryType) => {
        saved.push(lqt);
      },
    };

    const useCase = new ListQueryTypeGenerateUseCase(entityRepo, listQueryRepo);
    await useCase.run('/project/entities', '/project/output');

    expect(saved).toHaveLength(1);
    expect(saved[0].entityName).toBe('Order');
  });
});
