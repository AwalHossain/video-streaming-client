import { Box, CircularProgress, LinearProgress, Typography, useMediaQuery } from "@mui/material";
import Draggable from "react-draggable";

function ProgressModal({ name, status, progress, fileName }) {
  const isMobileOrTablet = useMediaQuery('(max-width:768px)');
  return (
    <Draggable>
      <div style={{ cursor: "move" }}>
        <Box
          sx={{
            zIndex: 9999,
            backgroundColor: "#252525",
            width: isMobileOrTablet ? '60vw' : '400px',
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
            sx={{
              display: isMobileOrTablet ? "none" : "block"
            }}
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
            {isMobileOrTablet ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
  
                }}
              >
                <CircularProgress variant="determinate" value={progress} />
                <Typography
                  variant="subtitle2"
                  component="div"
                  color="text.secondary"
                >
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            ) : (
              <>
                <LinearProgress variant="determinate" value={progress} key={name} />
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  sx={{ marginTop: "5px" }}
                >
                  {`${Math.round(progress)}%`}
                </Typography>
              </>
            )}
          </Box>
          {!progress && <p>Data Transferring......</p>}
        </Box>
      </div>
    </Draggable>
  );
}

export default ProgressModal;
