// frontend/src/App.tsx
import { useState } from 'react';
import { ChatContainer } from './components/chat/ChatContainer';
import { Login } from './components/admin/Login';
import './App.css';
import './Footer.css'
import logoFatec from './assets/fatec_jacarei-removebg-preview.png';

export default function App() {
  // Esse estado controla qual tela está ativa: 'chat' ou 'login' ou 'admin_dashboard'
  const [currentScreen, setCurrentScreen] = useState<'chat' | 'login' | 'admin'>('chat');

  return (
    <div className="sd-app-container">
      {/* Header Padrão do Sistema */}
      <header className="sd-header">
         <img src={logoFatec} className='logoFatec' height={50} alt="" />
        <div className="sd-header-title">
          
          <h1>Secretaria Digital - Fatec Jacareí</h1>
        </div>
        
        {/* Botões de navegação no topo da tela */}
        <nav className="sd-nav">
          {currentScreen !== 'chat' && (
            <button className="sd-nav-btn" onClick={() => setCurrentScreen('chat')}>
              Voltar para o Chat
            </button>
          )}
          {currentScreen === 'chat' && (
            <button className="sd-nav-btn sd-btn-admin" onClick={() => setCurrentScreen('login')}>
              Área Admin
            </button>
          )}
        </nav>
      </header>

      

      {/* Conteúdo Dinâmico com base na tela selecionada */}
      <main className="sd-main-content">
        {currentScreen === 'chat' && <ChatContainer />}
        
        {currentScreen === 'login' && (
          <Login 
            onLoginSuccess={() => {
              alert('Login feito com sucesso! Token armazenado.');
              setCurrentScreen('admin'); // Leva para a tela restrita após logar
            }} 
          />
        )}

        {currentScreen === 'admin' && (
          <div className="sd-admin-dashboard">
            <h2>Bem-vindo, Secretaria Acadêmica!</h2>
            <p>Esta é a área protegida pelo requisito RF09.</p>
            <button 
              className="sd-btn-primary" 
              onClick={() => {
                localStorage.removeItem('token'); // Faz o logout limpando o token
                setCurrentScreen('chat');
              }}
            >
              Sair (Logout)
            </button>
          </div>
        )}
      </main>
      <footer>
        <div className="footer">
          <span>Fatec Jacareí</span>
        </div>
      </footer>
    </div>
  );
}
