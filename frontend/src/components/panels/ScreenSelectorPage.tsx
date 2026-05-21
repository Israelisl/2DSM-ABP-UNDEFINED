import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { AuthUser } from "../../services/authService";
import { inquiryService, type Inquiry } from "../../services/inquiryService";
import { logService, type InteractionLog } from "../../services/logService";
import {
  navigationAdminService,
  type AdminNavigationNode,
  type NavigationNodePayload,
} from "../../services/navigationAdminService";

type AdminTab = "perguntas" | "duvidas" | "logs";

type ScreenSelectorPageProps = {
  user: AuthUser | null;
};

type QuestionFormState = {
  parent_id: string;
  title: string;
  slug: string;
  prompt: string;
  answer_summary: string;
  evidence_excerpt: string;
  evidence_source: string;
  display_order: string;
  is_active: boolean;
};

const emptyQuestionForm: QuestionFormState = {
  parent_id: "",
  title: "",
  slug: "",
  prompt: "",
  answer_summary: "",
  evidence_excerpt: "",
  evidence_source: "",
  display_order: "0",
  is_active: true,
};

const tabs: Array<{ key: AdminTab; label: string }> = [
  { key: "perguntas", label: "Perguntas" },
  { key: "duvidas", label: "Duvidas" },
  { key: "logs", label: "Logs" },
];

function toNullableText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function formatDate(value?: string) {
  if (!value) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildQuestionForm(node: AdminNavigationNode): QuestionFormState {
  return {
    parent_id: node.parent_id ? String(node.parent_id) : "",
    title: node.title,
    slug: node.slug,
    prompt: node.prompt ?? "",
    answer_summary: node.answer_summary ?? "",
    evidence_excerpt: node.evidence_excerpt ?? "",
    evidence_source: node.evidence_source ?? "",
    display_order: String(node.display_order),
    is_active: node.is_active,
  };
}

function buildQuestionPayload(form: QuestionFormState): NavigationNodePayload {
  return {
    parent_id: form.parent_id ? Number(form.parent_id) : null,
    title: form.title.trim(),
    slug: form.slug.trim(),
    prompt: toNullableText(form.prompt),
    answer_summary: toNullableText(form.answer_summary),
    evidence_excerpt: toNullableText(form.evidence_excerpt),
    evidence_source: toNullableText(form.evidence_source),
    display_order: Number(form.display_order || 0),
    is_active: form.is_active,
  };
}

async function fetchAdminData(isAdmin: boolean) {
  const [questionData, inquiryData, logData] = await Promise.all([
    navigationAdminService.list(),
    inquiryService.list(),
    isAdmin ? logService.list() : Promise.resolve<InteractionLog[]>([]),
  ]);

  return { questionData, inquiryData, logData };
}

export function ScreenSelectorPage({ user }: ScreenSelectorPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("duvidas");
  const [questions, setQuestions] = useState<AdminNavigationNode[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [logs, setLogs] = useState<InteractionLog[]>([]);
  const [questionForm, setQuestionForm] = useState<QuestionFormState>(emptyQuestionForm);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const canManageQuestions = user?.role === "ADMIN";

  const parentOptions = useMemo(
    () => questions.filter((question) => question.id !== editingQuestionId && question.is_active),
    [editingQuestionId, questions],
  );

  const loadAdminData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { questionData, inquiryData, logData } = await fetchAdminData(canManageQuestions);
      setQuestions(questionData);
      setInquiries(inquiryData);
      setLogs(logData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nao foi possivel carregar o painel.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    async function loadInitialData() {
      try {
        const { questionData, inquiryData, logData } = await fetchAdminData(user?.role === "ADMIN");

        if (!isActive) return;

        setQuestions(questionData);
        setInquiries(inquiryData);
        setLogs(logData);
      } catch (error) {
        if (!isActive) return;

        const errorMessage = error instanceof Error ? error.message : "Nao foi possivel carregar o painel.";
        setMessage(errorMessage);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      isActive = false;
    };
  }, [user?.role]);

  const resetQuestionForm = () => {
    setQuestionForm(emptyQuestionForm);
    setEditingQuestionId(null);
  };

  const handleQuestionSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingQuestion(true);
    setMessage(null);

    try {
      const payload = buildQuestionPayload(questionForm);

      if (editingQuestionId) {
        await navigationAdminService.update(editingQuestionId, payload);
        setMessage("Pergunta atualizada com sucesso.");
      } else {
        await navigationAdminService.create(payload);
        setMessage("Pergunta cadastrada com sucesso.");
      }

      resetQuestionForm();
      await loadAdminData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nao foi possivel salvar a pergunta.";
      setMessage(errorMessage);
    } finally {
      setSavingQuestion(false);
    }
  };

  const startEditingQuestion = (node: AdminNavigationNode) => {
    setEditingQuestionId(node.id);
    setQuestionForm(buildQuestionForm(node));
    setActiveTab("perguntas");
  };

  const deactivateQuestion = async (id: number) => {
    setMessage(null);

    try {
      await navigationAdminService.deactivate(id);
      setMessage("Pergunta desativada.");
      await loadAdminData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nao foi possivel desativar a pergunta.";
      setMessage(errorMessage);
    }
  };

  const toggleInquiryStatus = async (inquiry: Inquiry) => {
    const nextStatus = inquiry.status === "ABERTA" ? "RESPONDIDA" : "ABERTA";
    setMessage(null);

    try {
      const updatedInquiry = await inquiryService.updateStatus(inquiry.id, nextStatus);
      setInquiries((currentInquiries) =>
        currentInquiries.map((currentInquiry) =>
          currentInquiry.id === inquiry.id ? updatedInquiry : currentInquiry,
        ),
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nao foi possivel atualizar a duvida.";
      setMessage(errorMessage);
    }
  };

  return (
    <main className="sd-admin-shell">
      <aside className="sd-admin-tabs" aria-label="Telas administrativas">
        {tabs
          .filter((tab) => tab.key !== "logs" || user?.role === "ADMIN")
          .map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`sd-admin-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
      </aside>

      <section className="sd-admin-panel">
        <div className="sd-admin-panel-header">
          <div>
            <h1>Painel administrativo</h1>
            <p>{user ? `${user.name} - ${user.role}` : "Usuario autenticado"}</p>
          </div>
          <button className="sd-secondary-button" onClick={() => void loadAdminData()} type="button">
            Atualizar
          </button>
        </div>

        {message && <div className="sd-admin-message">{message}</div>}
        {loading && <div className="sd-admin-message">Carregando dados...</div>}

        {!loading && activeTab === "perguntas" && (
          <div className="sd-admin-grid">
            <section className="sd-admin-section">
              <h2>{editingQuestionId ? "Editar pergunta" : "Cadastrar pergunta"}</h2>

              {canManageQuestions ? (
                <form className="sd-admin-form" onSubmit={handleQuestionSubmit}>
                  <label>
                    Pergunta exibida
                    <input
                      value={questionForm.title}
                      onChange={(event) => setQuestionForm({ ...questionForm, title: event.target.value })}
                      required
                    />
                  </label>

                  <label>
                    Slug
                    <input
                      value={questionForm.slug}
                      onChange={(event) => setQuestionForm({ ...questionForm, slug: event.target.value })}
                      required
                    />
                  </label>

                  <label>
                    Pergunta pai
                    <select
                      value={questionForm.parent_id}
                      onChange={(event) => setQuestionForm({ ...questionForm, parent_id: event.target.value })}
                    >
                      <option value="">Menu inicial</option>
                      {parentOptions.map((question) => (
                        <option key={question.id} value={question.id}>
                          {question.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Texto de orientacao
                    <input
                      value={questionForm.prompt}
                      onChange={(event) => setQuestionForm({ ...questionForm, prompt: event.target.value })}
                    />
                  </label>

                  <label>
                    Resposta
                    <textarea
                      value={questionForm.answer_summary}
                      onChange={(event) => setQuestionForm({ ...questionForm, answer_summary: event.target.value })}
                      rows={5}
                    />
                  </label>

                  <label>
                    Evidencia ou observacao
                    <textarea
                      value={questionForm.evidence_excerpt}
                      onChange={(event) => setQuestionForm({ ...questionForm, evidence_excerpt: event.target.value })}
                      rows={3}
                    />
                  </label>

                  <label>
                    Link ou arquivo de apoio
                    <input
                      value={questionForm.evidence_source}
                      onChange={(event) => setQuestionForm({ ...questionForm, evidence_source: event.target.value })}
                    />
                  </label>

                  <div className="sd-admin-form-row">
                    <label>
                      Ordem
                      <input
                        type="number"
                        min="0"
                        value={questionForm.display_order}
                        onChange={(event) => setQuestionForm({ ...questionForm, display_order: event.target.value })}
                      />
                    </label>

                    <label className="sd-checkbox-label">
                      <input
                        type="checkbox"
                        checked={questionForm.is_active}
                        onChange={(event) => setQuestionForm({ ...questionForm, is_active: event.target.checked })}
                      />
                      Ativa
                    </label>
                  </div>

                  <div className="sd-admin-actions">
                    <button className="sd-btn-primary" type="submit" disabled={savingQuestion}>
                      {savingQuestion ? "Salvando..." : editingQuestionId ? "Salvar alteracoes" : "Cadastrar"}
                    </button>
                    {editingQuestionId && (
                      <button className="sd-secondary-button" type="button" onClick={resetQuestionForm}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <p>Somente administradores podem cadastrar ou alterar perguntas.</p>
              )}
            </section>

            <section className="sd-admin-section">
              <h2>Perguntas cadastradas</h2>
              <div className="sd-admin-list">
                {questions.map((question) => (
                  <article className="sd-admin-card" key={question.id}>
                    <div className="sd-admin-card-top">
                      <strong>{question.parent_title ?? "Menu inicial"}</strong>
                      <span className={question.is_active ? "sd-status-open" : "sd-status-closed"}>
                        {question.is_active ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                    <h3>{question.title}</h3>
                    <p>{question.answer_summary || question.prompt || "Sem resposta cadastrada."}</p>
                    <small>/{question.slug}</small>
                    {canManageQuestions && (
                      <div className="sd-admin-actions">
                        <button type="button" className="sd-secondary-button" onClick={() => startEditingQuestion(question)}>
                          Editar
                        </button>
                        {question.is_active && (
                          <button type="button" className="sd-danger-button" onClick={() => void deactivateQuestion(question.id)}>
                            Desativar
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {!loading && activeTab === "duvidas" && (
          <section className="sd-admin-section">
            <h2>Duvidas enviadas pelos usuarios</h2>
            <div className="sd-admin-list">
              {inquiries.map((inquiry) => (
                <article className="sd-admin-card" key={inquiry.id}>
                  <div className="sd-admin-card-top">
                    <strong>{inquiry.requester_name}</strong>
                    <span className={inquiry.status === "ABERTA" ? "sd-status-open" : "sd-status-closed"}>
                      {inquiry.status}
                    </span>
                  </div>
                  <h3>{inquiry.question}</h3>
                  <p>{inquiry.requester_email}</p>
                  <small>
                    Enviada em {formatDate(inquiry.created_at)}
                    {inquiry.answered_by_name ? ` - Respondida por ${inquiry.answered_by_name}` : ""}
                  </small>
                  <div className="sd-admin-actions">
                    <button type="button" className="sd-secondary-button" onClick={() => void toggleInquiryStatus(inquiry)}>
                      Marcar como {inquiry.status === "ABERTA" ? "respondida" : "aberta"}
                    </button>
                  </div>
                </article>
              ))}
              {inquiries.length === 0 && <p>Nenhuma duvida enviada ate o momento.</p>}
            </div>
          </section>
        )}

        {!loading && activeTab === "logs" && user?.role === "ADMIN" && (
          <section className="sd-admin-section">
            <h2>Feedbacks e registros</h2>
            <div className="sd-admin-list">
              {logs.map((log) => (
                <article className="sd-admin-card" key={log.id}>
                  <div className="sd-admin-card-top">
                    <strong>{log.flag ?? "Registro de atendimento"}</strong>
                    <span>{formatDate(log.created_at)}</span>
                  </div>
                  {log.feedback_comment && <p>{log.feedback_comment}</p>}
                  <small>Sessao: {log.session_id}</small>
                  <small>
                    Fluxo: {log.navigation_flow.map((entry) => entry.title).join(" > ") || "Sem navegacao"}
                  </small>
                  {log.inquiry_ids.length > 0 && <small>Duvidas: {log.inquiry_ids.join(", ")}</small>}
                </article>
              ))}
              {logs.length === 0 && <p>Nenhum registro encontrado.</p>}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
