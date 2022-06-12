import { notification } from "antd";
const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message,
  });
};

export default openNotificationWithIcon;
