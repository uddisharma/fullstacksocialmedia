import React from "react";

import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";

const NavIcons = () => {
  return (
    <div
      // style={{ width: "100%" }}
      style={{ display: "flex", justifyContent: "space-between" }}
      className="navIcons"
    >
      <Link to="/">
        <button
          style={{
            backgroundColor: "#143069",
            borderRadius: "10px",
            color: "white",
            textDecoration: "none",
            cursor: "pointer",
          }}
          className={" fc-button"}
          // onClick={handleFollow}
        >
          Home
        </button>
      </Link>
      <Link to="../chat">
        <button
          style={{
            backgroundColor: "#143069",
            borderRadius: "10px",
            color: "white",
            textDecoration: "none",
            cursor: "pointer",
          }}
          className={" fc-button"}
          // onClick={handleFollow}
        >
          Chat
        </button>
      </Link>
      {/* <Link to="../home">
        <img style={{}} src={Home} alt="" />
      </Link>
      <UilSetting />

      <UilSetting />
      <img src={Noti} alt="" />
      <Link to="../chat">
        <img src={Comment} alt="" />
      </Link> */}
    </div>
  );
};

export default NavIcons;
