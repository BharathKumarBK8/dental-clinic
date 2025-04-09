import { useEffect, useState } from "react";
import { getLeftMenuConfig } from "../../API/config";
import { MenuModel, Section } from "./LeftMenuModel";
import { Link } from "react-router-dom";
import "./LeftMenu.css";

function LeftMenu() {
  const [menuConfig, setMenuConfig] = useState<Section[] | null>(null);
  const [footerConfig, setFooterConfig] = useState<MenuModel[] | null>(null);

  useEffect(() => {
    const fetchMenuConfig = async () => {
      try {
        const config = await getLeftMenuConfig();
        setMenuConfig(config.section);
        setFooterConfig(config.footerdata);
      } catch (error) {
        console.error("Error fetching menu config: " + error);
      }
    };

    fetchMenuConfig();
  }, []);

  const updateMenuSelection = (
    menuList: MenuModel[],
    itemId: string
  ): MenuModel[] => {
    return menuList.map((item) => {
      const updatedChildren: MenuModel[] = item.children
        ? updateMenuSelection(item.children, itemId)
        : [];
      return {
        ...item,
        isSelected: item.id === itemId,
        children: updatedChildren,
      };
    });
  };

  const handleMenuClick = (itemId: string) => {
    if (menuConfig) {
      const updatedMenuData = menuConfig.map((section) => ({
        ...section,
        menuList: updateMenuSelection(section.menuList, itemId),
      }));
      setMenuConfig(updatedMenuData);
    }
  };

  const renderSection = (section: Section) => {
    let template = section.label ? (
      <div className="section-label">
        {section.label}
        <span className="arrow-icon">
          <i className="bi bi-chevron-right"></i>
        </span>
      </div>
    ) : null;

    const filteredMenuList = section.menuList;
    if (filteredMenuList.length === 0) {
      return null;
    }

    template = (
      <>
        {template}
        {section.menuList.map((menu) => renderMenu(menu, false))}
      </>
    );

    return <div key={section.id}>{template}</div>;
  };

  const renderMenu = (menu: MenuModel, isMenuSelected: boolean = false) => {
    const isAnyMenuSelected = menu.children?.some((m) => m.isSelected);
    return (
      <>
        <Link
          key={menu.id}
          to={menu.path}
          onClick={() => handleMenuClick(menu.id)}
          className={`s-m-fw ${
            menu.isSelected && !isAnyMenuSelected
              ? "selected-child"
              : isMenuSelected
              ? "line-child"
              : ""
          }`}
        >
          {menu.icon && <i className={menu.icon}></i>}
          {menu.label}
          {menu.count !== undefined && (
            <span className="count">{menu.count}</span>
          )}
        </Link>
        {menu.children && menu.children.length > 0 && (
          <div
            className={`children ${
              menu.isSelected || isAnyMenuSelected ? "slide-down" : ""
            }`}
          >
            {menu.children.map((childMenu) =>
              renderMenu(childMenu, isAnyMenuSelected)
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div id="left-menu">
      <div className="leftMenus">
        {menuConfig && menuConfig.length > 0 ? (
          menuConfig.map((section) => renderSection(section))
        ) : (
          /* TODO : Add Loader */
          <div>No Menu items available</div>
        )}

        <div className="footer">
          {footerConfig && footerConfig.length > 0 ? (
            footerConfig.map((item) => renderMenu(item))
          ) : (
            <div>No footer items available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeftMenu;
