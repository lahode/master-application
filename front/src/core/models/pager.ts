import { Range } from './range';

export interface Pager {
  items: any[];
  total: number;
  filter: {
    field: string;
    value: string;
  };
  range: Range;
  sort: {
    active: string;
    direction: string;
  };
}
