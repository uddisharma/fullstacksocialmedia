import React, { useEffect, useState } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";
import axios from "axios";
const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);
  // console.log(data)
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const [postdata, setPostData] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/user/${data?.userId}`)
      .then((res) => {
        setPostData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };
  const handleCommnet = () => {
    setOpen(!open);
  };
  const handleSendComment = (id) => {
    if (msg === "") {
      return alert("please enter a comment");
    }
    axios
      .post(`http://localhost:5000/posts/comment/${data?._id}`, {
        username: user?.username,
        comment: msg,
      })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log(data?.comments);
  return (
    <div className="Post">
      <div style={{ display: "flex", gap: "10px" }}>
        <img
          src={
            postdata.profilePicture
              ? publicFolder + postdata.profilePicture
              : "http://localhost:5000/images/defaultProfile.png"
          }
          alt="profile"
          className="followerImage"
        />
        <div className="name">
          <span>{postdata.firstname + postdata.lastname}</span>
          <span>@{postdata.username}</span>
        </div>
      </div>
      <img
        src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
        alt=""
      />

      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img
          style={{ cursor: "pointer" }}
          onClick={handleCommnet}
          src={Comment}
          alt=""
        />
        <img src={Share} alt="" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
      <div className="detail">
        <span>
          <b>{data.name} </b>
        </span>
        <span>{data.desc}</span>
      </div>
      {data?.comments &&
        data.comments.map((e) => (
          <div className="name">
            <span>@{e?.username}</span>
            <span>{e?.comment}</span>
          </div>
        ))}

      {open ? (
        <div
          style={{ border: "2px solid gray", width: "250px" }}
          className="Search"
        >
          <input
            onChange={(e) => setMsg(e.target.value)}
            id="user"
            type="text"
            placeholder="write comment..."
          />
          <div
            // onClick={onSearch}
            style={{ cursor: "pointer", marginLeft: "50px" }}
            // className="s-icon"
          >
            {/* <UilSearch /> */}
            <img
              onClick={handleSendComment}
              style={{ color: "white" }}
              src={Share}
              alt=""
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Post;
