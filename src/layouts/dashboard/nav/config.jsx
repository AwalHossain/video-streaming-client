// component
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = (user) => {
  let config = [
    {
      title: "dashboard",
      path: "/dashboard/app",
      icon: icon("dashboard"),
    },
    {
      title: "Content",
      path: "/dashboard/content",
      icon: icon("videos"),
    },
    {
      title: "Video upload",
      path: "/dashboard/video-upload",
      icon: icon("video-upload-fill"),
    },
    {
      title: "login",
      path: "/login",
      icon: icon("ic_lock"),
    },
    {
      title: "Not found",
      path: "/404",
      icon: icon("ic_disabled"),
    },
  ];

  if (user) {
    config = config.filter(item => item.title !== "login");
  }

  return config;
};

export default navConfig;