import { NotificationAdd, ThumbUpOffAltOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useState } from "react";
import "./description.css";

export default function Description({ video }) {
  const [toggleSub, setToggleSub] = useState(false);
  const { title, description, date } = video;

  const handleSubscribe = () => {
    setToggleSub(!toggleSub);
  };
  return (
    <div>
      <Typography variant="h4" className="title">
        {title}
      </Typography>
      <div className="subs-container">
        <button className="subs-btn">
          {toggleSub ? (
            <>
              <span>Subscribed</span>
              <span className="bell">
                <NotificationAdd />
              </span>
            </>
          ) : (
            <span className="sub" onClick={handleSubscribe}>
              Subscribe
            </span>
          )}
        </button>
        <div>
          <ThumbUpOffAltOutlined />
          {/* <Typography style={{ marginLeft: "0.5rem" }}>10K likes</Typography> */}
        </div>
      </div>
      <div className="description">
        {description ? description : "No description"}
      </div>
    </div>
  );
}
