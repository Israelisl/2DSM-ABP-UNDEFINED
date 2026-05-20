import { useState } from 'react';
import { type PanelItem } from './panelTypes';

type PanelItemCardProps = {
  item: PanelItem;
  onUpdate: (changes: Partial<PanelItem>) => void;
  onRemove: () => void;
};

const DELETE_ANIMATION_MS = 280;

export function PanelItemCard({ item, onUpdate, onRemove }: PanelItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = () => {
    setIsDeleting(true);
    window.setTimeout(onRemove, DELETE_ANIMATION_MS);
  };

  return (
    <article className={`sd-content-card ${isEditing ? 'editing' : ''} ${isDeleting ? 'deleting' : ''}`}>
      {isEditing ? (
        <>
          <label className="sd-edit-field">
            <span>Identificação</span>
            <input
              value={item.eyebrow}
              onChange={event => onUpdate({ eyebrow: event.target.value })}
            />
          </label>
          <label className="sd-edit-field">
            <span>Conteúdo</span>
            <textarea
              value={item.title}
              onChange={event => onUpdate({ title: event.target.value })}
              rows={3}
            />
          </label>
          <label className="sd-edit-field">
            <span>Descrição</span>
            <textarea
              value={item.description ?? ''}
              onChange={event => onUpdate({ description: event.target.value })}
              rows={2}
            />
          </label>
          <div className="sd-card-actions">
            <button className="sd-finish-button" onClick={() => setIsEditing(false)} type="button">
              Concluir
            </button>
            <button className="sd-delete-button" onClick={handleRemove} type="button">
              Excluir
            </button>
          </div>
        </>
      ) : (
        <>
          <strong>{item.eyebrow}</strong>
          <h2>{item.title}</h2>
          {item.description && <p>{item.description}</p>}
          <div className="sd-card-actions">
            <button className="sd-modify-button" onClick={() => setIsEditing(true)} type="button">
              Modificar
            </button>
            <button className="sd-delete-button" onClick={handleRemove} type="button">
              Excluir
            </button>
          </div>
        </>
      )}
    </article>
  );
}
