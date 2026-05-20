import { type Panel, type PanelKey } from './panelTypes';

type PanelSidebarProps = {
  panels: Panel[];
  activePanelKey: PanelKey;
  onSelectPanel: (panelKey: PanelKey) => void;
};

export function PanelSidebar({ panels, activePanelKey, onSelectPanel }: PanelSidebarProps) {
  return (
    <aside className="sd-panel-nav" aria-label="Seleção de telas">
      {panels.map(panel => (
        <button
          key={panel.key}
          className={`sd-panel-nav-button ${panel.key === activePanelKey ? 'active' : ''}`}
          onClick={() => onSelectPanel(panel.key)}
          type="button"
        >
          {panel.label}
        </button>
      ))}
    </aside>
  );
}
