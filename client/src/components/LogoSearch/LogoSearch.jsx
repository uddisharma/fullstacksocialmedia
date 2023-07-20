import React, { useState } from "react";
import Logo from "../../img/logo.png";
import "./LogoSearch.css";
import { UilSearch } from "@iconscout/react-unicons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../../api/UserRequests";

const LogoSearch = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const [data, setData] = useState([]);
  const onSearch = () => {
    var user = document.getElementById("user").value;
    if (user === "") {
      return alert("Please enter a username");
    }
    axios
      .get(`http://localhost:5000/user/username/${user}`)
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [following, setFollowing] = useState(false);
  setTimeout(() => {
    setFollowing(data.followers.includes(user._id));
  }, 100);

  const handleFollow = () => {
    following
      ? dispatch(unfollowUser(data?._id, user))
      : dispatch(followUser(data?._id, user));
    setFollowing((prev) => !prev);
  };
  const handleMessage = (id) => {
    axios
      .post(`http://localhost:5000/chat`, {
        senderId: user?._id,
        receiverId: id,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/chat");
      })
      .catch((err) => {
        console.log(err);
        navigate("/chat");
      });
  };
  return (
    <div>
      <div className="LogoSearch">
        {/* <Link to="/">
          <img src={Logo} alt="" />
        </Link> */}
        <div style={{ border: "2px solid gray", width:'250px' }} className="Search">
          <input id="user" type="text" placeholder="#Search Users" />
          <div
            onClick={onSearch}
            style={{ cursor: "pointer", marginLeft: "50px"}}
            className="s-icon"
          >
            <UilSearch />
          </div>
        </div>
      </div>
      {data?.username ? (
        <div style={{ marginTop: "10px" }}>
          <div className="follower">
            <div>
              <img
                src={
                  data.profilePicture
                    ? publicFolder + data.profilePicture
                    : "http://localhost:5000/images/defaultProfile.png"
                }
                alt="profile"
                className="followerImage"
              />
              <div className="name">
                <span>{data.firstname + " " + data.lastname}</span>
                <span>@{data.username}</span>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <button
              className={
                true ? "button fc-button UnfollowButton" : "button fc-button"
              }
              onClick={() => {
                handleFollow();
                setFollowing(!following);
              }}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
            <button
              onClick={() => {
                handleMessage(data?._id);
              }}
              className={"button fc-button"}
              // onClick={handleFollow}
            >
              Message
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LogoSearch;
