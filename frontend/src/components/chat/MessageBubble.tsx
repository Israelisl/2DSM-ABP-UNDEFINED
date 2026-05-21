import { type ReactNode } from "react";

type MessageBubbleProps = {
  children: ReactNode;
  sender: "bot" | "user";
  html?: boolean;
  evidence_source?: string | null;
};

export function MessageBubble({ children, sender, html, evidence_source }: MessageBubbleProps) {
  const getFileName = (path: string) => path.split("/").pop() || "Arquivo";

  return (
    <div className={`sd-message-row ${sender === "user" ? "user-row" : ""}`}>
      <div className={`sd-bubble ${sender === "user" ? "sd-bubble-user" : "sd-bubble-bot"}`}>
        {html && typeof children === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: children }} />
        ) : (
          children
        )}

        {evidence_source && (
          <div className="sd-evidence-container">
            <a
              href={evidence_source}
              target="_blank"
              rel="noopener noreferrer"
              className="sd-evidence-link"
            >
              <span className="sd-evidence-text">{getFileName(evidence_source)}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
