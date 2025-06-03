import {
  ArrowDownOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Bubble,
  Prompts,
  Sender,
  ThoughtChain,
  useXAgent,
  useXChat,
  Welcome,
  type BubbleProps,
} from "@ant-design/x";
import type { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";
import {
  Avatar,
  Button,
  Card,
  Flex,
  FloatButton,
  message,
  Space,
  Tooltip,
  Typography,
  type GetProp,
} from "antd";
import { useEffect, useRef, useState } from "react";
import ContiIcon from "../assets/continental-icon.png";
import Logo from "../assets/continental.svg";
import useStyle from "../style";
import Faq from "./Faq";
import HotTopics from "./HotTopics";
import { BubbleLoadingIcon, NewChatIcon, SidebarIcon } from "../icons/chat-icons";
import MarkdownRenderer from "./MarkdownRenderer";
import { useScrollToBottom } from "../hooks/useScrollToBottom";

const extractThinkContent = (input: string): string => {
  const regex = /<think>(.*?)<\/think>/gs;
  const match = input.match(regex);
  return match ? match[0] : '';
};

const extractNormalContent = (input: string): string => {
  const regex = /<think>(.*?)<\/think>/gs;
  return input.replace(regex, '');
};

const renderAssistantContentAsMarkdown: BubbleProps["messageRender"] = (text) => {
  const content = text || '';
  const hasThinking = content.includes('<think>');
  const isThinking = content.includes('<think>') && !content.includes('</think>');
  const thinkingText = (isThinking ? content.replace('<think>', '') : extractThinkContent(content)) || '';
  const normalText = (isThinking ? '' : extractNormalContent(content)) || '';

  return (
    <>
      {hasThinking && (
        <ThoughtChain items={[{
          key: '1',
          title: 'Thought of Chain',
          icon: isThinking ? <LoadingOutlined /> : <CheckCircleOutlined />,
          content: <MarkdownRenderer content={thinkingText} />,
          status: isThinking ? 'pending' : 'success',
        }]} />
      )}

      {(!hasThinking || !isThinking) && (<>
        <br />
        <MarkdownRenderer content={normalText} />
      </>)}
    </>

  );
};

const renderUserContentAsMarkdown: BubbleProps["messageRender"] = (content) => {
  return (
    <MarkdownRenderer content={content} />
  );
};

const roles: GetProp<typeof Bubble.List, "roles"> = {
  assistant: {
    variant: "borderless",
  },
  user: {
    placement: "end",
    shape: "round",
  },
};

const ChatInterface = () => {
  const { styles } = useStyle();
  const abortController = useRef<AbortController>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ==================== State ====================

  const [inputValue, setInputValue] = useState("");
  const [sidebarVisiable, setSidebarVisiable] = useState(true);
  // const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const { showScrollToBottom, onScroll } = useScrollToBottom();

  // ==================== Runtime ====================

  // Agent for request
  const [agent] = useXAgent<BubbleDataType>({
    baseURL: import.meta.env.VITE_BASE_MODEL_URL,
    model: import.meta.env.VITE_MODEL,
  });

  const loading = agent.isRequesting();

  // Chat messages
  const { onRequest, messages, setMessages } = useXChat({
    agent,
    requestFallback: (_, { error }) => {
      if (error.name === "AbortError") {
        return {
          content: "Request is aborted",
          role: "assistant",
        };
      }
      return {
        content: "Request failed, please try again!",
        role: "assistant",
      };
    },
    requestPlaceholder: () => {
      return {
        content: BubbleLoadingIcon(),
        role: "assistant",
      };
    },
    resolveAbortController: (controller) => {
      abortController.current = controller;
    },
    transformMessage: (info) => {
      const { originMessage, chunk, status } = info || {};
      let currentText = "";

      // Handle Event Stream Data
      if (chunk?.data && status === "loading") {
        try {
          currentText = JSON.parse(chunk?.data || `""`);
        } catch (error) {
          console.error(error)
        }
      }

      // currentText = currentText
      //   .trim()
      //   .replace(/^"|"$/g, "")
      //   .replace(/\\n/g, "\n");

      const content = `${originMessage?.content || ""}${currentText}`;

      if (status === 'success' && content.includes('<think>') && !content.includes('</think')) {
        return {
          content: `${content}</think>`,
          role: "assistant",
        };
      }

      return {
        content: content,
        role: "assistant",
      };
    },
  });

  // ==================== Event ====================
  const onMessageSubmit = (val: string) => {
    if (!val.trim()) return;

    if (loading) {
      message.error(
        "Request is in progress, please wait for the request to complete."
      );
      return;
    }

    onRequest({
      half_query: val,
      message: { role: "user", content: val },
      stream: true,
    });
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {/* Sidebar */}
      <div
        className={styles.sider}
        style={{
          width: sidebarVisiable ? "280px" : "0",
          transition: "0.3s cubic-bezier(.36, -0.01, 0, .77)",
          padding: sidebarVisiable ? "0 12px" : "0",
          overflow: "hidden",
        }}
      >
        {sidebarVisiable && (
          <>
            {/* 🌟 Logo & Name */}
            <div className={styles.logo}>
              <img src={Logo} alt="logo" />
              <span>CAS Shanghai</span>
            </div>
            <Button
              type="link"
              className={styles.newChatButton}
              icon={<PlusOutlined />}
              onClick={() => {
                setMessages([]);
              }}
            >
              New Chat
            </Button>
            {/* 🌟 Sider Content */}
            <div className={styles.siderContent}></div>
            <div className={styles.siderFooter}>
              <Tooltip title="Sign in (WIP)">
                <Avatar icon={<UserOutlined />} size={28} />
              </Tooltip>
              <Tooltip title="Show help">
                <Button
                  type="text"
                  size="large"
                  icon={<QuestionCircleOutlined />}
                />
              </Tooltip>
            </div>
          </>
        )}
      </div>

      <div className={styles.mainSection}>
        {/* Header */}
        <div className={styles.header}>
          <Flex gap={4}>
            <Tooltip
              title={
                sidebarVisiable ? "Collapse side panel" : "Expand side panel"
              }
            >
              <SidebarIcon
                onClick={() => setSidebarVisiable(!sidebarVisiable)}
                style={{ color: "#ffa500" }}
              />
            </Tooltip>
            <Tooltip title="Start a new chat">
              <NewChatIcon
                onClick={() => {
                  setMessages([]);
                }}
                style={{ color: "#ffa500" }}
              />
            </Tooltip>
          </Flex>
          <span className={styles.appName}>HR AI ASSISTANT</span>
        </div>

        <div className={styles.chatContainer}>
          {/* Chat Section */}
          <div className={styles.chatMessageList}
            ref={containerRef}
            onScroll={onScroll}
            style={{
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {/* Messages */}
            {messages?.length > 0 ? (
              <Bubble.List
                items={messages?.map((messageItem) => {
                  return {
                    ...messageItem.message,
                    classNames: {
                      content:
                        messageItem.status === "loading"
                          ? styles.loadingMessage
                          : "",
                    },
                    content: messageItem.message.content,
                    messageRender: messageItem.message.role === 'user' ? renderUserContentAsMarkdown : renderAssistantContentAsMarkdown,
                  };
                })}
                roles={roles}
              />
            ) : (
              <Space
                direction="vertical"
                size={16}
                style={{ paddingInline: "calc(calc(100% - 768px) / 2)" }}
                className={styles.placeholder}
              >
                {/* Welcome */}
                <Card className={styles.welcomeCard}>
                  <Welcome
                    variant="borderless"
                    icon={<img src={ContiIcon} alt="HR Assistant Icon" />}
                    title="Hello, I'm your HR AI Assistant"
                    description="Powered by DeepSeek-R1 to provide an all-in-one experience with HR"
                  />
                </Card>

                {/* Prompts */}
                <Typography.Title level={5} style={{ margin: 0 }}>
                  I can assist you with:
                </Typography.Title>
                <Flex gap={16}>
                  <Prompts
                    items={[HotTopics]}
                    styles={{
                      list: { height: "100%" },
                      item: {
                        flex: 1,
                        backgroundImage:
                          "linear-gradient(120deg, #f4cf9b 0%, #f9e7cc 100%)",
                        borderRadius: 12,
                        border: "none",
                      },
                      subItem: { padding: 0, background: "transparent" },
                    }}
                    onItemClick={(info) => {
                      onMessageSubmit(info.data.description as string);
                    }}
                    className={styles.chatPrompt}
                  />
                  <Prompts
                    items={[Faq]}
                    styles={{
                      item: {
                        flex: 1,
                        backgroundImage:
                          "linear-gradient(120deg, #f4cf9b 0%, #f9e7cc 100%)",
                        borderRadius: 12,
                        border: "none",
                      },
                      subItem: { background: "#ffffffa6" },
                    }}
                    onItemClick={(info) => {
                      onMessageSubmit(info.data.description as string);
                    }}
                    className={styles.chatPrompt}
                  />
                </Flex>
              </Space>
            )}
          </div>

          {/* Message Input Box */}
          <Sender
            className={styles.sender}
            placeholder="Ask a question..."
            loading={loading}
            value={inputValue}
            onSubmit={(nextContent) => {
              onMessageSubmit(nextContent);
              setInputValue("");
            }}
            onChange={setInputValue}
            onCancel={() => {
              abortController.current?.abort();
            }}
            actions={(_, info) => {
              const { SendButton, LoadingButton } = info.components;
              return (
                <>
                  {loading ? (
                    <LoadingButton type="default" />
                  ) : (
                    <SendButton type="primary" />
                  )}
                </>
              );
            }}
          />
        </div>

        {/* Scroll to bottom */}
        {showScrollToBottom && (
          <FloatButton
            icon={<ArrowDownOutlined />}
            onClick={() => {
              containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
            }}
            style={{
              position: 'absolute',
              left: sidebarVisiable ? `calc(50% + 140px)` : '50%',
              transform: 'translateX(-50%)',
              transition: "0.3s cubic-bezier(.36, -0.01, 0, .77)",

              bottom: 96,
            }}
            tooltip={<span>Scroll to bottom</span>}
          />
        )}
      </div>
    </>
  );
};

export default ChatInterface;
