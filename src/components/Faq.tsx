import {
  HeartOutlined,
  SmileOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import type { PromptProps } from "@ant-design/x";

const Faq: PromptProps = {
  key: "2",
  label: "Frequently Asked Questions",
  children: [
    {
      key: "2-1",
      icon: <HeartOutlined />,
      label: "Benefits",
      description: "What are the benefits",
    },
    {
      key: "2-2",
      icon: <SmileOutlined />,
      label: "Holidays",
      description: "What's the leave policy",
    },
    {
      key: "2-3",
      icon: <CommentOutlined />,
      label: "Communication",
      description: "How can I apply for a business travel",
    },
  ],
};

export default Faq;
