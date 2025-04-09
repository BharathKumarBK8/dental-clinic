export enum TABLE_COLUMN_TYPE {
  TEXT = "text",
  NUMBER = "number",
  DATETIME = "datetime",
  STATUS = "status",
  CURRENCY = "currency",
}

export interface TABLE_COLUMN {
  type: TABLE_COLUMN_TYPE;
  label: string;
  name: string;
  showSort?: boolean;
  showFilter?: boolean;
  filter?: TABLE_FILTER;
}

export interface TABLE_FILTER {
  showMenu: boolean;
  showDropdown: boolean;
  dropdownData: string[];
}

export interface TABLE_DATA {
  id: string;
  options?: {
    title?: {
      text?: string;
      icon?: string;
      click?: string;
    };
    columns: TABLE_COLUMN[];
  };
  data?: {
    result: TABLE_RESPONSE_MODEL[];
    url?: string;
  };
}

export type TABLE_RESPONSE_MODEL = Record<string, string | number | null>;
