// frontend/src/components/chat/ChatContainer.tsx
import { useEffect, useState } from "react";
import { useChat } from "../../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { OptionButton } from "./OptionButton";

type LocalMessage = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

type FormData = {
  nome: string;
  email: string;
  duvida: string;
};

type FeedbackType = "positivo" | "negativo" | null;

export function ChatContainer() {
  const { messages, currentOptions, bottomRef, handleChoice } = useChat();

  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showFeedbackComment, setShowFeedbackComment] = useState(false);
  const [hasInteraction, setHasInteraction] = useState(false);

  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [feedbackComment, setFeedbackComment] = useState("");

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    duvida: "",
  });

  useEffect(() => {
    const isFinalAnswer =
      hasInteraction &&
      currentOptions.length === 1 &&
      currentOptions[0]?.slug === "__back";

    setShowFeedback(
      isFinalAnswer && !showQuestionForm && !showFeedbackComment
    );
  }, [currentOptions, hasInteraction, showQuestionForm, showFeedbackComment]);

  const openQuestionForm = () => {
    setLocalMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: "📩 Enviar pergunta",
      },
      {
        id: Date.now() + 1,
        sender: "bot",
        text: "Preencha o formulário abaixo para enviar sua dúvida à secretaria.",
      },
    ]);

    setShowQuestionForm(true);
    setShowFeedback(false);
    setShowFeedbackComment(false);
    setFeedbackType(null);
  };

  const handleSubmitQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLocalMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: `Nome: ${formData.nome}\nE-mail: ${formData.email}\nDúvida: ${formData.duvida}`,
      },
      {
        id: Date.now() + 1,
        sender: "bot",
        text: "Sua pergunta foi enviada com sucesso. A secretaria responderá em breve.",
      },
    ]);

    setFormData({
      nome: "",
      email: "",
      duvida: "",
    });

    setShowQuestionForm(false);
    setShowFeedback(false);
    setShowFeedbackComment(false);
    setFeedbackType(null);
  };

  const handleFeedback = (type: "positivo" | "negativo") => {
    setFeedbackType(type);

    setLocalMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: type === "positivo" ? "👍 Sim, ajudou" : "👎 Não ajudou",
      },
    ]);

    setShowFeedback(false);
    setShowFeedbackComment(true);
  };

  const submitFeedbackComment = () => {
    setLocalMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: feedbackComment.trim()
          ? `Comentário: ${feedbackComment}`
          : "Comentário: não informado",
      },
      {
        id: Date.now() + 1,
        sender: "bot",
        text:
          feedbackType === "positivo"
            ? "Obrigado pelo feedback positivo!"
            : "Obrigado pelo feedback. Vamos utilizar isso para melhorar o atendimento.",
      },
    ]);

    setFeedbackComment("");
    setShowFeedback(false);
    setShowFeedbackComment(false);
    setFeedbackType(null);
  };

  const handleOptionClick = (opt: { slug: string; title: string }) => {
    setHasInteraction(true);

    handleChoice(opt);

    setShowQuestionForm(false);
    setShowFeedback(false);
    setShowFeedbackComment(false);
    setFeedbackType(null);
  };

  return (
    <div className="sd-chat-body-wrapper">
      <header className="sd-chat-header">
        <div className="sd-chat-header-text">
          <h1>Secretaria Digital - Fatec Jacareí</h1>
          <p>Atendimento público para alunos e interessados</p>
        </div>
      </header>

      <div className="sd-chat-body">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            sender={msg.sender}
            html={msg.html}
            evidence_source={msg.evidence_source}
          >
            {msg.text}
          </MessageBubble>
        ))}

        {localMessages.map((msg) => (
          <MessageBubble key={msg.id} sender={msg.sender}>
            {msg.text}
          </MessageBubble>
        ))}

        {showFeedback && (
          <div className="sd-feedback-box">
            <p>Essa resposta ajudou você?</p>

            <div className="sd-feedback-buttons">
              <button
                className="sd-feedback-positive"
                onClick={() => handleFeedback("positivo")}
              >
                👍 Sim
              </button>

              <button
                className="sd-feedback-negative"
                onClick={() => handleFeedback("negativo")}
              >
                👎 Não
              </button>

              <button
                className="sd-feedback-question"
                onClick={openQuestionForm}
              >
                📩 Enviar pergunta
              </button>
            </div>
          </div>
        )}

        {showFeedbackComment && (
          <div className="sd-feedback-comment">
            <p className="sd-feedback-comment-title">
              {feedbackType === "positivo"
                ? "Deseja deixar algum comentário positivo?"
                : "O que podemos melhorar?"}
            </p>

            <textarea
              placeholder={
                feedbackType === "positivo"
                  ? "Digite seu comentário..."
                  : "Descreva o que podemos melhorar..."
              }
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
            />

            <button onClick={submitFeedbackComment}>Enviar Feedback</button>
          </div>
        )}

        {showQuestionForm && (
          <form className="sd-question-form" onSubmit={handleSubmitQuestion}>
            <input
              type="text"
              placeholder="Nome"
              value={formData.nome}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nome: e.target.value,
                })
              }
              required
            />

            <input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              required
            />

            <textarea
              placeholder="Digite sua dúvida"
              value={formData.duvida}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duvida: e.target.value,
                })
              }
              required
            />

            <button type="submit">Enviar</button>
          </form>
        )}

        <div className="sd-chip-row">
          {currentOptions.map((opt) => (
            <OptionButton
              key={opt.slug}
              label={opt.title}
              onClick={() => handleOptionClick(opt)}
            />
          ))}

          <OptionButton
            key="enviar-pergunta-secretaria"
            label="Enviar Pergunta para Secretaria"
            onClick={openQuestionForm}
          />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}