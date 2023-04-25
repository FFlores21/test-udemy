/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Modulo {
  id_menu: number;
  label: string;
  icon: string;
  color: string;
  routerLink: string;
  url: string;
  target: string;
  nivel?: number;
  estado?: boolean;
  disabled?: boolean;
  items: MegaMenuItem[];
}

export interface MegaMenuItem {
  id_menu?: number;
  nivel?: number;
  estado?: boolean;
  label?: string;
  icon?: string;
  color?: string;
  command?: (event?: any) => void;
  url?: string;
  urlTool?: string;
  items?: MenuItem[][];
  expanded?: boolean;
  disabled?: boolean;
  visible?: boolean;
  target?: string;
  routerLinkActiveOptions?: any;
  separator?: boolean;
  badge?: string;
  badgeStyleClass?: string;
  style?: any;
  styleClass?: string;
  iconStyle?: any;
  title?: string;
  id?: string;
  automationId?: any;
  tabindex?: string;
  routerLink?: any;
  queryParams?: {
    [k: string]: any;
  };
  fragment?: string;
  preserveFragment?: boolean;
  skipLocationChange?: boolean;
  replaceUrl?: boolean;
  state?: {
    [k: string]: any;
  };
}

export interface MenuItem {
  id_menu?: number;
  nivel?: number;
  estado?: boolean;
  label?: string;
  icon?: string;
  color?: string;
  command?: (event?: any) => void;
  url?: string;
  urlTool?: string;
  items?: MenuItem[];
  expanded?: boolean;
  disabled?: boolean;
  visible?: boolean;
  target?: string;
  escape?: boolean;
  routerLinkActiveOptions?: any;
  separator?: boolean;
  badge?: string;
  tooltip?: string;
  tooltipPosition?: string;
  badgeStyleClass?: string;
  style?: any;
  styleClass?: string;
  title?: string;
  id?: string;
  automationId?: any;
  tabindex?: string;
  routerLink?: any;
  queryParams?: {
    [k: string]: any;
  };
  fragment?: string;
  preserveFragment?: boolean;
  skipLocationChange?: boolean;
  replaceUrl?: boolean;
  iconStyle?: any;
  iconClass?: string;
  state?: {
    [k: string]: any;
  };
  tooltipOptions?: {
    tooltipLabel?: string;
    tooltipPosition?: string;
    tooltipEvent?: string;
    appendTo?: any;
    positionStyle?: string;
    tooltipStyleClass?: string;
    tooltipZIndex?: string;
    escape?: boolean;
    disabled?: boolean;
    positionTop?: number;
    positionLeft?: number;
    showDelay?: number;
    hideDelay?: number;
    life?: number;
  };
}
