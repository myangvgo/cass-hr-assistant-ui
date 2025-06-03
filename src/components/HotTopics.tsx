import type { PromptProps } from "@ant-design/x";

const HotTopics : PromptProps = {
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

export default HotTopics;
