import "../../Header.css";

export function Header() {
  return (
    <header className="sd-topbar">
      <div className="sd-brand">
        <div className="sd-logo-card">
          <img src="/src/assets/fatec_jacarei-removebg-preview.png" alt="Logo Fatec Jacareí" />
        </div>
      </div>

      <div className="sd-searchbar">
        <input type="text" placeholder="O que deseja localizar?" />
        <button aria-label="Buscar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.42 1.4-1.4-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
