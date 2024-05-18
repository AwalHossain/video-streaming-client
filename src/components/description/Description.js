import { ThumbUpOffAltOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import "./description.css";

export default function Description({ video }) {
  const { title, description, date } = video;
  return (
    <div>
      <Typography
        variant="h4"
        style={{
          fontWeight: "bold",
          letterSpacing: "tight",
          color: "#2d3748",
          paddingBottom: "1rem",
        }}
      >
        {title}
      </Typography>
      <div className="subs-container">
        <button className="subs-btn">Subscribe</button>
        <div>
          <ThumbUpOffAltOutlined />
          {/* <Typography style={{ marginLeft: "0.5rem" }}>10K likes</Typography> */}
        </div>
      </div>
      <div
        style={{
          paddingBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {description ? description : "No description"}
      </div>
    </div>
  );
}
