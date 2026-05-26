import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Pencil, Trash2, Link as LinkIcon, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function FaqTreeItem({ item, children, childCount, onEdit, onDelete, onAddChild, level = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = childCount > 0;

  return (
    <div className={`${level > 0 ? 'ml-5 border-l border-border' : ''}`}>
      <div className="group flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
            hasChildren ? 'hover:bg-muted text-muted-foreground' : 'text-transparent'
          }`}
          disabled={!hasChildren}
        >
          {hasChildren && (expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{item.question_text}</span>
            {hasChildren && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                {childCount}
              </Badge>
            )}
            {item.external_link && (
              <LinkIcon className="w-3 h-3 text-primary shrink-0" />
            )}
          </div>
          {item.answer_text && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{item.answer_text}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAddChild(item.id)}>
            <Plus className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(item)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(item)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {expanded && hasChildren && <div className="pb-1">{children}</div>}
    </div>
  );
}