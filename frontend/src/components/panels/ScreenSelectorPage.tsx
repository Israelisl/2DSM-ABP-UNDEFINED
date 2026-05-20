import { useState } from 'react';
import { PanelContent } from './PanelContent';
import { PanelSidebar } from './PanelSidebar';
import { panels as initialPanels } from './panelData';
import { type PanelItem, type PanelKey } from './panelTypes';

export function ScreenSelectorPage() {
  const [panels, setPanels] = useState(initialPanels);
  const [activePanelKey, setActivePanelKey] = useState<PanelKey>('duvidas');
  const activePanel = panels.find(panel => panel.key === activePanelKey) ?? panels[0];

  const updatePanelItem = (itemId: string, changes: Partial<PanelItem>) => {
    setPanels(currentPanels =>
      currentPanels.map(panel =>
        panel.key === activePanelKey
          ? {
              ...panel,
              items: panel.items.map(item =>
                item.id === itemId ? { ...item, ...changes } : item
              )
            }
          : panel
      )
    );
  };

  const removePanelItem = (itemId: string) => {
    setPanels(currentPanels =>
      currentPanels.map(panel =>
        panel.key === activePanelKey
          ? {
              ...panel,
              items: panel.items.filter(item => item.id !== itemId)
            }
          : panel
      )
    );
  };

  return (
    <main className="sd-panel-shell">
      <PanelSidebar
        panels={panels}
        activePanelKey={activePanelKey}
        onSelectPanel={setActivePanelKey}
      />
      <PanelContent
        panel={activePanel}
        onUpdateItem={updatePanelItem}
        onRemoveItem={removePanelItem}
      />
    </main>
  );
}
