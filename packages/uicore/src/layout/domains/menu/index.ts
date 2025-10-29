/**
 * Menu domain exports
 * MenuItem type is exported from menuSlice (vertical slice approach)
 */

export { Menu, type MenuProps } from './Menu';
export { toggleMenu, setMenuCollapsed, setMenuItems, setMenuVisible, setMenuConfig, type MenuItem } from './menuSlice';
export { default as menuReducer } from './menuSlice';
