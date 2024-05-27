import {
  NotificationsActive,
  ThumbUp,
  ThumbUpOffAltOutlined,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useState } from "react";
import "./description.css";

export default function Description({ video }) {
  const [toggleSub, setToggleSub] = useState(false);
  const [toggleLike, setToogleLike] = useState(false);
  const { title, description, date } = video;

  const handleSubscribe = () => {
    setToggleSub(!toggleSub);
  };

  const handleLike = () => {
    setToogleLike(!toggleLike);
  };

  return (
    <div>
      <Typography variant="h4" className="title">
        {title}
      </Typography>
      <div className="subs-container">
        <button className="subs-btn">
          {toggleSub ? (
            <div onClick={handleSubscribe} className="notification">
              <span>Subscribed</span>
              <span className="bell">
                <NotificationsActive />
              </span>
            </div>
          ) : (
            <span className="sub" onClick={handleSubscribe}>
              Subscribe
            </span>
          )}
        </button>
        <div>
          {toggleLike ? (
            <span className="like" onClick={handleLike}>
              <ThumbUp />
            </span>
          ) : (
            <span className="like" onClick={handleLike}>
              <ThumbUpOffAltOutlined />
            </span>
          )}

          {/* <Typography style={{ marginLeft: "0.5rem" }}>10K likes</Typography> */}
        </div>
      </div>
      <div className="description">
        {description ? description : "No description"}
      </div>
    </div>
  );
}
