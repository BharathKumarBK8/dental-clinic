import React from "react";
import { HeaderModel, ProfileModel } from "../HeaderModel";
import "../header.css";

interface ProfileDropdownProps {
  config: HeaderModel;
  handleItemClick: (item: ProfileModel) => void;
  generateIcon: (text: string, itemId?: string) => JSX.Element | string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  config,
  handleItemClick,
  generateIcon,
}) => {
  return (
    <div className="profile-dropdown">
      {config?.profile?.map((section) => (
        <div key={section.id} className="profile-section-container">
          {section.id === "user_info"
            ? section.list.map((item) => (
                <div
                  key={item.id}
                  className="profile-dropdown-item"
                  onClick={() => handleItemClick(item)}
                >
                  <div className={`profile-text`}>
                    <span className="main-text">{item.text}</span>
                    {item.subText && (
                      <span className="sub-text">{item.subText}</span>
                    )}
                  </div>
                </div>
              ))
            : section.list.map((item) => (
                <div
                  key={item.id}
                  className="profile-dropdown-item"
                  onClick={() => handleItemClick(item)}
                >
                  {section.id === "store_list" && (
                    <>
                      {item.id === "all_store" ? (
                        generateIcon(item.text, item.id)
                      ) : (
                        <span className="profile-icon">
                          {generateIcon(item.text, item.id)}
                        </span>
                      )}
                    </>
                  )}
                  <div
                    className={`profile-text ${
                      section.id !== "store_list" ? "no-icon" : ""
                    }`}
                  >
                    <span className="main-text">{item.text}</span>
                    {item.subText && (
                      <span className="sub-text">{item.subText}</span>
                    )}
                  </div>
                </div>
              ))}
        </div>
      ))}
    </div>
  );
};

export default ProfileDropdown;
