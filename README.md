# type-list-query-parameter-generator-from-entity-definitions

[![Test](https://github.com/HiromiShikata/type-list-query-parameter-generator-from-entity-definitions/actions/workflows/test.yml/badge.svg)](https://github.com/HiromiShikata/type-list-query-parameter-generator-from-entity-definitions/actions/workflows/test.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Generate `{EntityName}ListQuery` TypeScript interfaces from a flat directory of entity definition files. Sort and filter fields are typed as `keyof {EntityName}` via a computed relative import.

## Usage

```
type-list-query-parameter-generator-from-entity-definitions <entityDefinitionsPath> <outputPath>
```

Arguments:

- `entityDefinitionsPath` — directory containing entity TypeScript files (direct files only, no recursion); files whose stem starts with an uppercase letter are treated as entities
- `outputPath` — directory where generated `{EntityName}ListQuery.ts` files are written; created if absent

## Example

Given `src/domain/entities/Order.ts`:

```typescript
export type Order = {
  id: string;
  status: 'pending' | 'shipped' | 'delivered';
  total: number;
};
```

Running:

```
npx type-list-query-parameter-generator-from-entity-definitions src/domain/entities src/generated/list-queries
```

Generates `src/generated/list-queries/OrderListQuery.ts`:

```typescript
import type { Order } from '../../domain/entities/Order';

export interface OrderListQuery {
  pagination: {
    limit: number;
    offset: number;
  };
  sort: {
    sortBy: keyof Order;
    order: 'asc' | 'desc';
  };
  filters: ReadonlyArray<{
    field: keyof Order;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';
    value: string | number | boolean | ReadonlyArray<string | number>;
  }>;
}
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT
