import useStyle from "./style";
import ChatInterface from "./components/ChatInterface";

function App() {
  const { styles } = useStyle();

  return (
    <div className={styles.layout}>
      <ChatInterface />
    </div>
  );
}

export default App;
