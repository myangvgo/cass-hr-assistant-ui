import {
  HeartOutlined,
  SmileOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import type { PromptProps } from "@ant-design/x";

const FaqDe: PromptProps = {
  key: "2",
  label: "Häufig gestellte Fragen",
  children: [
    {
      key: "2-1",
      icon: <HeartOutlined />,
      label: "Leistungen",
      description: "Welche Vorteile gibt es?",
    },
    {
      key: "2-2",
      icon: <SmileOutlined />,
      label: "Urlaub",
      description: "Wie sieht die Urlaubsregelung aus?",
    },
    {
      key: "2-3",
      icon: <CommentOutlined />,
      label: "Kommunikation",
      description: "Wie kann ich eine Geschäftsreise beantragen?",
    },
  ],
};


const FaqEn: PromptProps = {
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

const FaqZh: PromptProps = {
  key: "2",
  label: "常见问题",
  children: [
    {
      key: "2-1",
      icon: <HeartOutlined />,
      label: "福利",
      description: "有哪些员工福利？",
    },
    {
      key: "2-2",
      icon: <SmileOutlined />,
      label: "假期",
      description: "请假政策是怎样的？",
    },
    {
      key: "2-3",
      icon: <CommentOutlined />,
      label: "沟通",
      description: "如何申请出差？",
    },
  ],
};

export { FaqDe, FaqEn, FaqZh }
