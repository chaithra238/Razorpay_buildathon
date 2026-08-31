import { Bell, CircleUserRound } from "lucide-react";

import "../../css/header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1>RecoverAI</h1>
        <p>AI-Powered Revenue Recovery</p>
      </div>

      <div className="header-right">
        <button className="notification-button">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <CircleUserRound size={28} />

          <div>
            <span className="user-name">Merchant</span>
            <span className="user-role">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
