import { useState } from "react";
import { Login } from "./components/admin/Login";
import { ChatContainer } from "./components/chat/ChatContainer";
import { ScreenSelectorPage } from "./components/panels/ScreenSelectorPage";
import { authService, type AuthUser } from "./services/authService";
import "./App.css";
import "./Footer.css";
import logoFatec from "./assets/fatec_jacarei-removebg-preview.png";

type AppScreen = "chat" | "login" | "admin";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() =>
    authService.getStoredToken() ? "admin" : "chat",
  );
  const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser());

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentScreen("chat");
  };

  return (
    <div className="sd-app-container">
      <header className="sd-header">
        <img src={logoFatec} className="logoFatec" height={50} alt="Fatec Jacarei" />
        <div className="sd-header-title">
          <h1>Secretaria Digital - Fatec Jacarei</h1>
        </div>

        <nav className="sd-nav">
          {currentScreen !== "chat" && (
            <button className="sd-nav-btn" onClick={() => setCurrentScreen("chat")}>
              Voltar para o chat
            </button>
          )}
          {currentScreen === "chat" && (
            <button className="sd-nav-btn sd-btn-admin" onClick={() => setCurrentScreen("login")}>
              Area admin
            </button>
          )}
          {currentScreen === "admin" && (
            <button className="sd-nav-btn" onClick={handleLogout}>
              Sair
            </button>
          )}
        </nav>
      </header>

      <main className="sd-main-content">
        {currentScreen === "chat" && <ChatContainer />}
        {currentScreen === "login" && (
          <Login
            onLoginSuccess={(authenticatedUser) => {
              setUser(authenticatedUser);
              setCurrentScreen("admin");
            }}
          />
        )}
        {currentScreen === "admin" && <ScreenSelectorPage user={user} />}
      </main>

      <footer>
        <div className="footer">
          <span>Fatec Jacarei</span>
        </div>
      </footer>
    </div>
  );
}
