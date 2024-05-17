import { ThumbUp } from "@mui/icons-material";
import { Typography } from "@mui/material";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "1rem",
        }}
      >
        <button
          style={{
            backgroundColor: "blue",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Subscribe
        </button>
        <div>
          <ThumbUp />
          Like
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
