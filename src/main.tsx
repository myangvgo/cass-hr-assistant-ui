import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import ContiTheme from './theme.ts'
import './i18n.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={ContiTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
