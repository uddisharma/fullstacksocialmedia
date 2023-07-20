import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser } from "../../actions/UserAction";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const User = ({ person }) => {
  const navigate = useNavigate();
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();

  const [following, setFollowing] = useState(
    person.followers.includes(user._id)
  );
  const handleFollow = () => {
    following
      ? dispatch(unfollowUser(person._id, user))
      : dispatch(followUser(person._id, user));
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
      <div className="follower">
        <div>
          <img
            src={
              person.profilePicture
                ? publicFolder + person.profilePicture
                : "http://localhost:5000/images/defaultProfile.png"
            }
            alt="profile"
            className="followerImage"
          />
          <div className="name">
            <span>{person.firstname}</span>
            <span>@{person.username}</span>
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
            following ? "button fc-button UnfollowButton" : "button fc-button"
          }
          onClick={handleFollow}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
        <button
          onClick={() => {
            handleMessage(person._id);
          }}
          className={"button fc-button"}
          // onClick={handleFollow}
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default User;
