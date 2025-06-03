import { createStyles } from "antd-style";

const useStyle = createStyles(({ token, css, prefixCls }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      height: 100vh;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    `,
    /* sider styles*/
    sider: css`
      background: ${token.colorBgLayout}80;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    `,
    logo: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      gap: 6px;
      margin: 20px 0 32px 0;

      span {
        font-weight: 700;
        color: ${token.colorPrimary};
        font-size: 16px;
      }
    `,
    siderContent: css`
      flex: 1;
      overflow-y: auto;
      margin-top: 12px;
      padding: 0;
      width: 256;
    `,
    newChatButton: css`
      background: ${token["orange-1"]};
      border: 1px solid ${token["orange-3"]};
      height: 40px;
      &.${prefixCls}-btn-link {
        color: #ffa500;
      }

      &.${prefixCls}-btn-link:hover {
        color: #ffa500 !important;
      }
    `,
    siderFooter: css`
      border-top: 1px solid ${token.colorBorderSecondary};
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    mainSection: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,
    /* header */
    header: css`
      height: 60px;
      border-bottom: 1px solid ${token.colorBorderSecondary};
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 24px;
    `,
    appName: css`
      font-weight: 600;
      color: ${token.colorPrimary};
      font-size: 18px;
      border: 2px solid ${token["orange-4"]};
      border-radius: 4px;
      padding: 5px 10px;
      cursor: default;
    `,
    /* chat styles*/
    chatContainer: css`
      height: calc(100% - 60px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      gap: 16px;
      margin-right: 16px;
      margin-left: 16px;
    `,
    chatMessageList: css`
      flex: 1;
      overflow: auto;
      height: 100%;
      padding-inline: calc(calc(100% - 768px) / 2);
    `,
    chatMessage: css`
      padding-top: 20px;
      padding-bottom: 20px;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    welcomeCard: css`
      background: linear-gradient(160deg, #f9e7cc 0%, #f4cf9b 100%);

      .ant-welcome-icon {
        height: 65px;
      }
    `,
    chatPrompt: css`
      .ant-prompts-label {
        color: #000000e0 !important;
      }
      .ant-prompts-desc {
        color: #000000a6 !important;
        width: 100%;
      }
      .ant-prompts-icon {
        color: #000000a6 !important;
      }
    `,
    loadingMessage: css`
      background-image: linear-gradient(
        90deg,
        #ff6b23 0%,
        #af3cb8 31%,
        #53b6ff 89%
      );
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
    `,
    /* sender styles */
    sender: css`
      width: 100%;
      max-width: 768px;
      margin: 0 auto;
    `,
  };
});

export default useStyle;
