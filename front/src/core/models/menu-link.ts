export interface MenuLink {
  path: string;
  label: string;
  active?: boolean;
  click?: string;
  attributes?: any;
  permissions?: string[];
}
