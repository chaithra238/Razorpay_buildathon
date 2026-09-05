import { Bell, CircleUserRound, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import "../../css/header.css";

type HeaderProps = {
  onMenuClick: () => void;
};

function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const pageName = location.pathname.split("/")[1] || "dashboard";

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick} aria-label="Open navigation">
          <Menu size={21} />
        </button>
        <div>
          <span className="eyebrow">Merchant workspace</span>
          <h1>{pageName.replaceAll("-", " ")}</h1>
        </div>
      </div>

      <div className="header-right">
        <button className="notification-button" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            <CircleUserRound size={32} />
          </div>

          <div>
            <span className="user-name">Merchant</span>
            <span className="user-role">Merchant</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
