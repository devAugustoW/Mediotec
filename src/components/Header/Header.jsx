import React from "react";
import "./Header.css";
import { useAuth } from "../../authContext/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <div className="header">
      <div className="header-logo">Mediotec</div>
      <div className="header-user">
        <p>Bem-vindo, {user?.name || ""}</p>
        <p>{user?.email || ""}</p>
      </div>
    </div>
  );
};

export default Header;