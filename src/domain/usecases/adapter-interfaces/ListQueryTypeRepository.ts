import { ListQueryType } from '../../entities/ListQueryType';

export { ListQueryType };

export interface ListQueryTypeRepository {
  save(listQueryType: ListQueryType): Promise<void>;
}
