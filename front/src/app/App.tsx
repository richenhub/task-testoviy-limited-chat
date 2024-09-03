import "./App.css";
import { ChatPage } from "../pages/chat";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <ChatPage />
            </div>
        </QueryClientProvider>
    );
}

export default App;
