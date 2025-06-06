import {
  ArrowDownOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  TranslationOutlined,
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
  Dropdown,
  Flex,
  FloatButton,
  message,
  Space,
  Switch,
  Tooltip,
  Typography,
  type GetProp,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ContiIcon from "../assets/continental-icon.png";
import Logo from "../assets/continental.svg";
import { useScrollToBottom } from "../hooks/useScrollToBottom";
import { BubbleLoadingIcon, NewChatIcon, SidebarIcon, ThoughtChainIcon } from "../icons/chat-icons";
import useStyle from "../style";
import { extractNormalContent, extractThinkContent, extractUserContent } from "../utils/string-util";
import { FaqDe, FaqEn, FaqZh } from "./Faq";
import { HotTopicsDe, HotTopicsEn, HotTopicsZh } from "./HotTopics";
import Languages from "./Languages";
import MarkdownRenderer from "./MarkdownRenderer";

const getHotTopics = (language: string) => {
  switch (language) {
    case 'en':
      return HotTopicsEn;
    case 'de':
      return HotTopicsDe;
    case 'zh':
      return HotTopicsZh;
    default:
      return HotTopicsEn;
  }
}

const getFaq = (language: string) => {
  switch (language) {
    case 'en':
      return FaqEn;
    case 'de':
      return FaqDe;
    case 'zh':
      return FaqZh;
    default:
      return FaqEn;
  }
}

const roles: GetProp<typeof Bubble.List, "roles"> = {
  assistant: {
    variant: "borderless",
    avatar: { icon: <img src={ContiIcon} />, style: { backgroundColor: "transparent", width: '48px', height: '48px' } },
  },
  user: {
    placement: "end",
    shape: "round",
  },
};

const ChatInterface = () => {
  // ==================== Global ====================

  const { styles } = useStyle();
  const { t, i18n } = useTranslation();

  // ==================== Refs ====================

  const abortController = useRef<AbortController>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ==================== State ====================

  const [inputValue, setInputValue] = useState("");
  const [answerLanguageMode, setAnswerLanguageMode] = useState(false);
  const [sidebarVisiable, setSidebarVisiable] = useState(true);
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
          content: t("requestAborted"),
          role: "assistant",
        };
      }
      return {
        content: t("requestFallback"),
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

  // Markdown renderers for user and assistant messages
  const renderAssistantContentAsMarkdown: BubbleProps["messageRender"] = (text) => {
    const content = text || '';
    const hasThinking = content.includes('<think>');
    const isThinking = content.includes('<think>') && !content.includes('</think>');
    const thinkingText = (isThinking ? content.replace('<think>', '') : extractThinkContent(content)) || '';
    const normalText = (isThinking ? '' : extractNormalContent(content)) || '';
    const isValidThinkingText = thinkingText.trim().length > 0;

    return (
      <>
        {hasThinking && isValidThinkingText && (
          <ThoughtChain size='small' items={[{
            key: '1',
            title: (
              <Flex gap={4}>
                <ThoughtChainIcon /> {t('thoughtOfChain')}
              </Flex>
            ),
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
    const userContent = extractUserContent(content || '');
    return (
      <MarkdownRenderer content={userContent} />
    );
  };

  // ==================== Event ====================
  const onMessageSubmit = (val: string) => {
    if (!val.trim()) return;

    if (loading) {
      message.error(t("requestInProgress"));
      return;
    }

    const answerInLocale = () => {
      switch (i18n.language) {
        case 'en':
          return ' Please answer in English';
        case 'de':
          return ' Bitte antworten Sie auf Deutsch';
        case 'zh':
          return ' 请用中文回答';
        default:
          return ' Please answer in English';
      }
    }

    onRequest({
      half_query: answerLanguageMode ? `${val} ${answerInLocale()}` : val,
      message: { role: "user", content: answerLanguageMode ? `${val}<locale_rule>${answerInLocale()}</locale_rule>` : val },
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
              {t('newChat')}
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
          <Flex gap={8}>
            <Flex gap={4}>
              <Tooltip
                title={
                  sidebarVisiable ? t('collapseSidePanel') : t('expandSidePanel')
                }
              >
                <SidebarIcon
                  onClick={() => setSidebarVisiable(!sidebarVisiable)}
                  style={{ color: "#ffa500" }}
                />
              </Tooltip>
              <Tooltip title={t('newChat')}>
                <NewChatIcon
                  onClick={() => {
                    setMessages([]);
                  }}
                  style={{ color: "#ffa500" }}
                />
              </Tooltip>
            </Flex>
            <span className={styles.appName}>{t('appName')}</span>
          </Flex>
          <Dropdown menu={{
            items: Languages,
            onClick: ({ key }) => i18n.changeLanguage(key),
            selectable: true,
            selectedKeys: [i18n.language || 'en'],
          }}>
            <Button type="text" shape="circle" icon={<TranslationOutlined style={{ color: '#ffa500', fontSize: '1.1rem' }} />} />
          </Dropdown>
        </div>

        <div className={styles.chatContainer}>
          {/* Chat Section */}
          <div className={styles.chatMessageList}
            ref={containerRef}
            onScroll={onScroll}
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
                className={styles.welcomeContainer}
              >
                {/* Welcome */}
                <Card className={styles.welcomeCard}>
                  <Welcome
                    variant="borderless"
                    icon={<img src={ContiIcon} alt="HR Assistant Icon" />}
                    title={t("welcomeTitle")}
                    description={t("welcomeDescription")}
                  />
                </Card>

                {/* Prompts */}
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {t("iCanHelpYou")}
                </Typography.Title>
                <Flex gap={16} >
                  <Prompts
                    items={[getHotTopics(i18n.language)]}
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
                    items={[getFaq(i18n.language)]}
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
            placeholder={t("senderPlaceholder")}
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
            actions={false}
            footer={({ components }) => {
              const { SendButton, LoadingButton } = components;
              return (
                <Flex justify="space-between" align="center">
                  <Tooltip title={t('answerLanguageTooltip')}>
                    <Flex gap={8} align="center">
                      <Typography>
                        {t('answerLanguage')}
                      </Typography>
                      <Switch size="small" checked={answerLanguageMode} onClick={() => setAnswerLanguageMode(!answerLanguageMode)}></Switch>
                    </Flex>
                  </Tooltip>
                  {loading ? (
                    <Tooltip title={t("stopAnswering")}>
                      <LoadingButton type="default" />
                    </Tooltip>
                  ) : (
                    <Tooltip title={inputValue?.trim().length > 0 ? t('send') : t("emptyMessage")}>
                      <SendButton type="primary" />
                    </Tooltip>
                  )}
                </Flex>
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
            tooltip={<span>{t('scrollToBottom')}</span>}
          />
        )}
      </div>
    </>
  );
};

export default ChatInterface;
