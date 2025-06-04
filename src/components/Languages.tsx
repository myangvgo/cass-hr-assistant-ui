import type { MenuProps } from "antd";
import FlagCn from "../assets/flag-cn.svg";
import FlagDe from "../assets/flag-de.svg";
import FlagUs from "../assets/flag-us.svg";

const Languages: MenuProps["items"] = [
  {
    key: 'en',
    label: 'English',
    icon: <img src={FlagUs} alt="English" width={16} height={16} />,
  },
  {
    key: 'zh',
    label: '中文',
    icon: <img src={FlagCn} alt="中文" width={16} height={16} />,
  },
  {
    key: 'de',
    label: 'Deutsch',
    icon: <img src={FlagDe} alt="Deutsch" width={16} height={16} />,
  },
];

export default Languages;