import type { PromptProps } from "@ant-design/x";

const HotTopicsDe: PromptProps = {
  key: "1",
  label: "Aktuelle Themen",
  children: [
    {
      key: "1-1",
      description: "Was ist der HR KI-Assistent?",
      icon: <span style={{ color: "#f93a4a", fontWeight: 700 }}>1</span>,
    },
    {
      key: "1-2",
      description: "Wie kann KI die Arbeitseffizienz verbessern?",
      icon: <span style={{ color: "#ff6565", fontWeight: 700 }}>2</span>,
    },
    {
      key: "1-3",
      description: "Welche Highlights bietet der HR KI-Assistent?",
      icon: <span style={{ color: "#ff8f1f", fontWeight: 700 }}>3</span>,
    },
    {
      key: "1-4",
      description: "Wie beantragt man Homeoffice (Remote-Arbeit)?",
      icon: <span style={{ color: "#00000040", fontWeight: 700 }}>4</span>,
    },
    {
      key: "1-5",
      description: "Welche Richtlinien unterstützen das berufliche Wachstum der Mitarbeitenden?",
      icon: <span style={{ color: "#00000040", fontWeight: 700 }}>5</span>,
    },
  ],
};

const HotTopicsEn: PromptProps = {
  key: "1",
  label: "Hot Topics",
  children: [
    {
      key: "1-1",
      description: "What is HR AI Assistant?",
      icon: <span style={{ color: "#f93a4a", fontWeight: 700 }}>1</span>,
    },
    {
      key: "1-2",
      description: "How to use AI to improve work efficiency?",
      icon: <span style={{ color: "#ff6565", fontWeight: 700 }}>2</span>,
    },
    {
      key: "1-3",
      description: "Highlights in HR AI Assistant?",
      icon: <span style={{ color: "#ff8f1f", fontWeight: 700 }}>3</span>,
    },
    {
      key: "1-4",
      description: "How to apply work from home (remote working).",
      icon: <span style={{ color: "#00000040", fontWeight: 700 }}>4</span>,
    },
    {
      key: "1-5",
      description: "Introduce the policies to support employee career growth?",
      icon: <span style={{ color: "#00000040", fontWeight: 700 }}>5</span>,
    },
  ],
};

const HotTopicsZh: PromptProps = {
  key: "1",
  label: "热门话题",
  children: [
    {
      key: "1-1",
      description: "什么是人力资源 AI 助手？",
      icon: <span style={{ color: "#f93a4a", fontWeight: 700 }}>1</span>,
    },
    {
      key: "1-2",
      description: "如何使用 AI 提高工作效率？",
      icon: <span style={{ color: "#ff6565", fontWeight: 700 }}>2</span>,
    },
    {
      key: "1-3",
      description: "人力资源 AI 助手的亮点有哪些？",
      icon: <span style={{ color: "#ff8f1f", fontWeight: 700 }}>3</span>,
    },
    {
      key: "1-4",
      description: "如何申请远程办公？",
      icon: <span style={{ color: "#00000040", fontWeight: 700 }}>4</span>,
    },
    {
      key: "1-5",
      description: "介绍支持员工职业发展的相关政策？",
      icon: <span style={{ color: "#00000040", fontWeight: 700 }}>5</span>,
    },
  ]
  ,
};

export { HotTopicsDe, HotTopicsEn, HotTopicsZh, };
