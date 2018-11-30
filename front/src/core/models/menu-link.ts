export interface MenuLink {
  path: string;
  label: string;
  icon?: string;
  active?: boolean;
  click?: string;
  attributes?: any;
  permissions?: string[];
}
