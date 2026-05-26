import { useState, type FormEvent } from "react";
import { useChat, type DisplayOption } from "../../hooks/useChat";
import { inquiryService } from "../../services/inquiryService";
import { logService, type FeedbackFlag } from "../../services/logService";
import { MessageBubble } from "./MessageBubble";
import { OptionButton } from "./OptionButton";

type LocalMessage = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

type QuestionFormData = {
  nome: string;
  email: string;
  duvida: string;
};

type FeedbackType = "positivo" | "negativo" | null;

const initialQuestionForm: QuestionFormData = {
  nome: "",
  email: "",
  duvida: "",
};

function mapFeedback(type: FeedbackType): FeedbackFlag {
  return type === "positivo" ? "ATENDEU" : "NAO_ATENDEU";
}

export function ChatContainer() {
  const { messages, currentOptions, bottomRef, handleChoice, navigationFlow, sessionId } = useChat();

  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showFeedbackComment, setShowFeedbackComment] = useState(false);
  const [hasInteraction, setHasInteraction] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [formData, setFormData] = useState<QuestionFormData>(initialQuestionForm);

  const shouldShowFeedback =
    hasInteraction &&
    currentOptions.length === 1 &&
    currentOptions[0]?.slug === "__back" &&
    !showQuestionForm &&
    !showFeedbackComment &&
    !feedbackSubmitted;

  const pushLocalMessages = (...newMessages: LocalMessage[]) => {
    setLocalMessages((previousMessages) => [...previousMessages, ...newMessages]);
  };

  const openQuestionForm = () => {
    pushLocalMessages(
      {
        id: Date.now(),
        sender: "user",
        text: "Enviar pergunta",
      },
      {
        id: Date.now() + 1,
        sender: "bot",
        text: "Preencha o formulario abaixo para enviar sua duvida a secretaria.",
      },
    );

    setShowQuestionForm(true);
    setShowFeedbackComment(false);
    setFeedbackType(null);
    setFeedbackSubmitted(true);
  };

  const handleSubmitQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuestionLoading(true);

    try {
      const inquiry = await inquiryService.create({
        requester_name: formData.nome.trim(),
        requester_email: formData.email.trim(),
        question: formData.duvida.trim(),
      });

      await logService.create({
        sessionId,
        navigationFlow,
        inquiryIds: [inquiry.id],
      });

      pushLocalMessages(
        {
          id: Date.now(),
          sender: "user",
          text: `Nome: ${formData.nome}\nE-mail: ${formData.email}\nDuvida: ${formData.duvida}`,
        },
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Sua pergunta foi enviada com sucesso. A secretaria respondera em breve.",
        },
      );

      setFormData(initialQuestionForm);
      setShowQuestionForm(false);
      setShowFeedbackComment(false);
      setFeedbackType(null);
      setFeedbackSubmitted(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nao foi possivel enviar a pergunta.";
      pushLocalMessages({
        id: Date.now(),
        sender: "bot",
        text: errorMessage,
      });
    } finally {
      setQuestionLoading(false);
    }
  };

  const handleFeedback = (type: "positivo" | "negativo") => {
    setFeedbackType(type);
    pushLocalMessages({
      id: Date.now(),
      sender: "user",
      text: type === "positivo" ? "Sim, ajudou" : "Nao ajudou",
    });
    setShowFeedbackComment(true);
  };

  const submitFeedbackComment = async () => {
    if (!feedbackType) return;

    setFeedbackLoading(true);

    try {
      await logService.create({
        sessionId,
        navigationFlow,
        flag: mapFeedback(feedbackType),
        feedbackComment: feedbackComment.trim() || null,
      });

      pushLocalMessages(
        {
          id: Date.now(),
          sender: "user",
          text: feedbackComment.trim()
            ? `Comentario: ${feedbackComment}`
            : "Comentario: nao informado",
        },
        {
          id: Date.now() + 1,
          sender: "bot",
          text:
            feedbackType === "positivo"
              ? "Obrigado pelo feedback positivo!"
              : "Obrigado pelo feedback. Vamos utilizar isso para melhorar o atendimento.",
        },
      );

      setFeedbackComment("");
      setShowFeedbackComment(false);
      setFeedbackType(null);
      setFeedbackSubmitted(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nao foi possivel enviar o feedback.";
      pushLocalMessages({
        id: Date.now(),
        sender: "bot",
        text: errorMessage,
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleOptionClick = (option: DisplayOption) => {
    setHasInteraction(true);
    void handleChoice(option);
    setShowQuestionForm(false);
    setShowFeedbackComment(false);
    setFeedbackType(null);
    setFeedbackSubmitted(false);
  };

  return (
    <div className="sd-chat-body-wrapper">
      <header className="sd-chat-header">
        <div className="sd-chat-header-text">
          <h1>Secretaria Digital - Fatec Jacarei</h1>
          <p>Atendimento publico para alunos e interessados</p>
        </div>
      </header>

      <div className="sd-chat-body">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            sender={message.sender}
            html={message.html}
            evidence_source={message.evidence_source}
          >
            {message.text}
          </MessageBubble>
        ))}

        {localMessages.map((message) => (
          <MessageBubble key={message.id} sender={message.sender}>
            {message.text}
          </MessageBubble>
        ))}

        {shouldShowFeedback && (
          <div className="sd-feedback-box">
            <p>Essa resposta ajudou voce?</p>

            <div className="sd-feedback-buttons">
              <button className="sd-feedback-positive" onClick={() => handleFeedback("positivo")}>
                Sim
              </button>

              <button className="sd-feedback-negative" onClick={() => handleFeedback("negativo")}>
                Nao
              </button>

              <button className="sd-feedback-question" onClick={openQuestionForm}>
                Enviar pergunta
              </button>
            </div>
          </div>
        )}

        {showFeedbackComment && (
          <div className="sd-feedback-comment">
            <p className="sd-feedback-comment-title">
              {feedbackType === "positivo" ? "Deseja deixar algum comentario?" : "O que podemos melhorar?"}
            </p>

            <textarea
              placeholder="Digite seu comentario..."
              value={feedbackComment}
              onChange={(event) => setFeedbackComment(event.target.value)}
            />

            <button onClick={submitFeedbackComment} disabled={feedbackLoading}>
              {feedbackLoading ? "Enviando..." : "Enviar feedback"}
            </button>
          </div>
        )}

        {showQuestionForm && (
          <form className="sd-question-form" onSubmit={handleSubmitQuestion}>
            <input
              type="text"
              placeholder="Nome"
              value={formData.nome}
              onChange={(event) => setFormData({ ...formData, nome: event.target.value })}
              required
            />

            <input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              required
            />

            <textarea
              placeholder="Digite sua duvida"
              value={formData.duvida}
              onChange={(event) => setFormData({ ...formData, duvida: event.target.value })}
              required
            />

            <button type="submit" disabled={questionLoading}>
              {questionLoading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        )}

        <div className="sd-chip-row">
          {currentOptions.map((option) => (
            <OptionButton
              key={option.slug}
              label={option.title}
              onClick={() => handleOptionClick(option)}
            />
          ))}

          <OptionButton
            key="enviar-pergunta-secretaria"
            label="Enviar pergunta para secretaria"
            onClick={openQuestionForm}
          />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
