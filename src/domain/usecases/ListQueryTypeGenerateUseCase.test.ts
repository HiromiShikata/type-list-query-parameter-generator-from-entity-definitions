import * as path from 'path';
import { EntityDefinition } from '../entities/EntityDefinition';
import { ListQueryType } from '../entities/ListQueryType';
import { ListQueryTypeGenerateUseCase } from './ListQueryTypeGenerateUseCase';

describe('ListQueryTypeGenerateUseCase', () => {
  it('generates one ListQueryType per entity and saves it', async () => {
    const entities = [
      new EntityDefinition('Order', '/project/entities/Order.ts'),
      new EntityDefinition('Product', '/project/entities/Product.ts'),
    ];
    const saved: Array<{
      entityName: string;
      entityFilePath: string;
      outputFilePath: string;
    }> = [];
    const entityRepo = { getAll: async (_p: string) => entities };
    const listQueryRepo = {
      save: async (lqt: {
        entityName: string;
        entityFilePath: string;
        outputFilePath: string;
      }) => {
        saved.push(lqt);
      },
    };

    const useCase = new ListQueryTypeGenerateUseCase(entityRepo, listQueryRepo);
    await useCase.run('/project/entities', '/project/output');

    expect(saved).toHaveLength(2);
    expect(saved[0]).toEqual(
      new ListQueryType(
        'Order',
        '/project/entities/Order.ts',
        path.join('/project/output', 'OrderListQuery.ts'),
      ),
    );
    expect(saved[1]).toEqual(
      new ListQueryType(
        'Product',
        '/project/entities/Product.ts',
        path.join('/project/output', 'ProductListQuery.ts'),
      ),
    );
  });

  it('passes entityDefinitionsPath to the repository', async () => {
    let receivedPath: string | null = null;
    const entityRepo = {
      getAll: async (p: string) => {
        receivedPath = p;
        return [];
      },
    };
    const listQueryRepo = {
      save: async (_lqt: {
        entityName: string;
        entityFilePath: string;
        outputFilePath: string;
      }) => {},
    };

    const useCase = new ListQueryTypeGenerateUseCase(entityRepo, listQueryRepo);
    await useCase.run('/some/entities/dir', '/some/output/dir');

    expect(receivedPath).toBe('/some/entities/dir');
  });

  it('saves nothing when no entities are found', async () => {
    const entityRepo = { getAll: async (_p: string) => [] };
    const saved: Array<{
      entityName: string;
      entityFilePath: string;
      outputFilePath: string;
    }> = [];
    const listQueryRepo = {
      save: async (lqt: {
        entityName: string;
        entityFilePath: string;
        outputFilePath: string;
      }) => {
        saved.push(lqt);
      },
    };

    const useCase = new ListQueryTypeGenerateUseCase(entityRepo, listQueryRepo);
    await useCase.run('/empty/dir', '/output/dir');

    expect(saved).toHaveLength(0);
  });
});
