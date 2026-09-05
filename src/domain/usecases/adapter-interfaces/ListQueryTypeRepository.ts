import { ListQueryType } from '../../entities/ListQueryType';

export { ListQueryType };

export class ListQueryTypeRepository {
  save(_listQueryType: ListQueryType): Promise<void> {
    throw new Error('Not implemented');
  }
}
