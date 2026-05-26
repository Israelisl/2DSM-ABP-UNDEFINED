import { PanelItemCard } from './PanelItemCard';
import { type Panel, type PanelItem } from './panelTypes';

type PanelContentProps = {
  panel: Panel;
  onUpdateItem: (itemId: string, changes: Partial<PanelItem>) => void;
  onRemoveItem: (itemId: string) => void;
};

export function PanelContent({
  panel,
  onUpdateItem,
  onRemoveItem
}: PanelContentProps) {
  return (
    <section className="sd-content-panel" aria-labelledby="panel-title">
      <div className="sd-content-panel-header">
        <h1 id="panel-title">{panel.title}</h1>
      </div>
      <div className="sd-content-list">
        {panel.items.map(item => (
          <PanelItemCard
            key={item.id}
            item={item}
            onUpdate={changes => onUpdateItem(item.id, changes)}
            onRemove={() => onRemoveItem(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
