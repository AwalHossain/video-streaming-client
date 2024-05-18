import { Box, LinearProgress, Typography } from "@mui/material";
import Draggable from "react-draggable";

function ProgressModal({ name, status, progress, fileName }) {
  return (
    <Draggable>
      <div style={{ cursor: "move" }}>
        <Box
          sx={{
            zIndex: 9999,
            backgroundColor: "#252525",
            width: "400px",
            height: "auto",
            padding: "10px",
            color: "white",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            fontSize={"12px"}
            component="p"
            color="text.secondary"
          >
            {`${name} is processing...`}
          </Typography>
          <Typography
            variant="subtitle2"
            component="p"
            fontSize={"10px"}
            color="text.secondary"
          >
            {`${fileName}`}
          </Typography>
          <Box sx={{ width: "100%", marginTop: "10px" }}>
            <LinearProgress variant="determinate" value={progress} key={name} />
          </Box>
          {progress ? (
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >
              {`${Math.round(progress)}%`}
            </Typography>
          ) : (
            <p>Data Transferring......</p>
          )}
        </Box>
      </div>
    </Draggable>
  );
}

export default ProgressModal;
