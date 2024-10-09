import React from "react";
import "./Header.css";

const getUserInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user
    ? { name: user.name, email: user.email }
    : { name: "", email: "" };
};

const { name, email } = getUserInfo();

const Header = () => {
  return (
    <div className="header">
      <div className="header-logo">Mediotec</div>
      <div className="header-user">
        <p>Bem-vindo, {name}</p>
        <p>{email}</p>
      </div>
    </div>
  );
};

export default Header;
