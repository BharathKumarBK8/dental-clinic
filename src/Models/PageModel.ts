import { PIE_DATA } from "../Common/Components/Pie";
import { TABLE_DATA } from "../Common/Components/Table/Model";
import { TEXTBOX_DATA } from "../Common/Components/Fromcontrols/Components/TextBox";
import { FORM_DROPDOWN_DATA } from "../Common/Components/Fromcontrols/Components/DropDown";
import { RADIO_BUTTON_DATA } from "../Common/Components/Fromcontrols/Components/Radiobutton";
import { CHECK_BOX_DATA } from "../Common/Components/Fromcontrols/Components/CheckBox";
import { BUTTON_DATA } from "../Common/Components/Fromcontrols/Components/Buttons";

export interface PageModel {
  title: string;
  buttons: BUTTON_MODEL[];
  columns: COLUMNS[];
}

export interface BUTTON_MODEL {
  id: string;
  name?: string;
  type: BUTTON_TYPE;
  text?: string;
  icon?: string;
  theme: BUTTON_THEME;
  data?: DROPDOWN_DATA[];
  path?: string;
  onClick?: () => void;
}

enum BUTTON_TYPE {
  BUTTON = "button",
  DROPDOWN = "dropdown",
}

interface BUTTON_THEME {
  black: "btn_black";
  grey: "btn_grey";
}

interface DROPDOWN_DATA {
  text?: string;
  icon?: string;
}

interface COLUMNS {
  size: {
    xl: number;
    lg: number;
    md: number;
    sm: number;
  };
  type: DATA_DISPLAY_TYPE;
  name: string;
  content:
    | TEXTBOX_DATA
    | TABLE_DATA
    | LINE_DATA
    | BAR_DATA
    | PIE_DATA
    | CARD_WITH_LINE_DATA
    | CARD_DATA
    | FORM_DATA
    | FORM_DROPDOWN_DATA
    | RADIO_BUTTON_DATA
    | CHECK_BOX_DATA
    | BUTTON_DATA;
}

export enum DATA_DISPLAY_TYPE {
  TABLE = "table",
  PIE = "pie",
  LINE = "line",
  BAR = "bar",
  CARD_WITH_LINE = "card_with_line",
  CARD = "card",
  FORM = "form",
  TEXTBOX_DATA = "textbox",
  FORM_DROPDOWN_DATA = "dropdown",
  RADIO_BUTTON_DATA = "radiobutton",
  CHECK_BOX_DATA = "checkbox",
  SEARCH_DATA = "search",
  BUTTON_DATA = "buttons",
}

export interface FORM_DATA {
  fields: Array<{
    type: string;
    content: any;
    size: {
      xl: number;
      lg: number;
      md: number;
      sm: number;
    };
  }>;
  formApi: {
    getUrl?: string;
    postUrl?: string;
    updateUrl?: string;
  };
}

export interface LINE_DATA {
  title: string;
  columns: string[];
}

export interface BAR_DATA {
  title: {
    text: string;
    icon?: string;
    click: string;
  };
  columns: string[];
}

export interface CARD_WITH_LINE_DATA {
  id: string;
  options?: {
    title: {
      text: string;
      icon?: string;
      click: string;
    };
    chart: {
      displayLegend: boolean;
    };
  };
  data?: {
    apiUrl?: string;
    chart: CWL_API_RESPONSE_MODEL;
  };
}

export interface CWL_API_RESPONSE_MODEL {
  value?: string;
  percentage?: string;
  data: number[];
  bgcolor: string[];
}

export interface CARD_DATA {
  title: {
    text: string;
    icon?: string;
    click: string;
  };
  text?: string;
}

export const ValidationType = {
  required: "required",
  type_check: "type_check",
  reg_exp: "reg_exp",
};

export enum InputType {
  TEXT = "text",
  NUMBER = "number",
  EMAIL = "email",
  PASSWORD = "password",
  TEL = "tel",
  URL = "url",
}

export enum PositionType {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}
export enum Errposition {
  BELOW = "below",
  RIGHT = "right",
}

export interface ErrorModel {
  message: {
    required?: string;
    type_check?: string;
    reg_exp?: string;
  };
  position: Errposition;
}
