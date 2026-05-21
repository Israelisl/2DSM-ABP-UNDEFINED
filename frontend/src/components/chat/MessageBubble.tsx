import { type ReactNode } from 'react';

export function MessageBubble({ 
  children, 
  sender, 
  html, 
  evidence_source 
}: { 
  children: ReactNode; 
  sender: 'bot' | 'user'; 
  html?: boolean; 
  evidence_source?: string | null; 
}) {
  
  // 1. CORREÇÃO: Removemos o console.log(path) que vazava ruído técnico
  const getFileName = (path: string) => {
    return path.split('/').pop() || 'Arquivo';
  };

  return (
    <div className={`sd-message-row ${sender === 'user' ? 'user-row' : ''}`}>
      <div className={`sd-bubble ${sender === 'user' ? 'sd-bubble-user' : 'sd-bubble-bot'}`}>
        
        {html && typeof children === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: children }} />
        ) : (
          children
        )}

        {/* 2. CORREÇÃO: Substituímos o inline style gigante por classNames limpas */}
        {evidence_source && (
          <div className="sd-evidence-container">
            <a
              href={evidence_source}
              target="_blank"
              rel="noopener noreferrer"
              className="sd-evidence-link"
            >
              <span className="sd-evidence-icon">📄</span>
              <span className="sd-evidence-text">{getFileName(evidence_source)}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}