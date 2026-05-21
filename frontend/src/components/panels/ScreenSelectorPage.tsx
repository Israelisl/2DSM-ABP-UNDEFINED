import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { AuthUser } from "../../services/authService";
import { inquiryService, type Inquiry } from "../../services/inquiryService";
import { logService, type InteractionLog } from "../../services/logService";
import {
  navigationAdminService,
  type AdminNavigationNode,
  type NavigationNodePayload,
} from "../../services/navigationAdminService";

type AdminTab = "perguntas" | "duvidas" | "logs";
type QuestionFormMode = "hidden" | "create" | "edit";

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
  const title = form.title.trim();
  const slug = form.slug.trim() || createSlugFromTitle(title);

  return {
    parent_id: form.parent_id ? Number(form.parent_id) : null,
    title,
    slug,
    prompt: null,
    answer_summary: toNullableText(form.answer_summary),
    evidence_excerpt: toNullableText(form.evidence_excerpt),
    evidence_source: toNullableText(form.evidence_source),
    display_order: Number(form.display_order || 0),
    is_active: form.is_active,
  };
}

function createSlugFromTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionForm, setQuestionForm] = useState<QuestionFormState>(emptyQuestionForm);
  const [questionFormMode, setQuestionFormMode] = useState<QuestionFormMode>("hidden");
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [formContextQuestion, setFormContextQuestion] = useState<AdminNavigationNode | null>(null);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<number>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [updatingInquiryId, setUpdatingInquiryId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const questionFormRef = useRef<HTMLElement | null>(null);

  const canManageQuestions = user?.role === "ADMIN";

  const getQuestionChildren = (parentId: number | null) =>
    questions
      .filter((question) => question.parent_id === parentId)
      .sort((a, b) => a.display_order - b.display_order || a.title.localeCompare(b.title));

  const getDescendantIds = (parentId: number): number[] => {
    const children = getQuestionChildren(parentId);
    return children.flatMap((child) => [child.id, ...getDescendantIds(child.id)]);
  };

  const filteredQuestions = useMemo(() => {
    const search = questionSearch.trim().toLowerCase();
    if (!search) return questions;

    return questions.filter((question) => {
      const searchableText = [
        question.title,
        question.slug,
        question.parent_title ?? "Menu inicial",
        question.answer_summary ?? "",
        question.prompt ?? "",
      ].join(" ").toLowerCase();

      return searchableText.includes(search);
    });
  }, [questionSearch, questions]);

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
    setFormContextQuestion(null);
    setQuestionFormMode("hidden");
  };

  const startCreatingQuestion = (parentId: number | null = null) => {
    const parentQuestion = parentId
      ? questions.find((question) => question.id === parentId) ?? null
      : null;

    setQuestionForm({
      ...emptyQuestionForm,
      parent_id: parentId ? String(parentId) : "",
      display_order: String(getQuestionChildren(parentId).length + 1),
    });
    setEditingQuestionId(null);
    setFormContextQuestion(parentQuestion);
    setQuestionFormMode("create");
  };

  const updateQuestionTitle = (title: string) => {
    setQuestionForm((currentForm) => ({
      ...currentForm,
      title,
      slug: createSlugFromTitle(title),
    }));
  };

  const handleQuestionSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingQuestion(true);
    setMessage(null);

    try {
      const payload = buildQuestionPayload(questionForm);

      if (editingQuestionId) {
        await navigationAdminService.update(editingQuestionId, {
          ...payload,
          slug: payload.slug || `pergunta-${editingQuestionId}`,
        });
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
    setFormContextQuestion(node);
    setQuestionFormMode("edit");
    setActiveTab("perguntas");
    setExpandedQuestionIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (node.parent_id) nextIds.add(node.parent_id);
      return nextIds;
    });
  };

  useEffect(() => {
    if (questionFormMode !== "hidden") {
      window.requestAnimationFrame(() => {
        questionFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [questionFormMode, editingQuestionId]);

  const toggleQuestionExpanded = (id: number) => {
    setExpandedQuestionIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }

      return nextIds;
    });
  };

  const removeQuestion = async (id: number) => {
    setMessage(null);

    try {
      await navigationAdminService.remove(id);
      setMessage("Pergunta excluida.");
      if (editingQuestionId === id) resetQuestionForm();
      await loadAdminData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Nao foi possivel excluir a pergunta.";
      setMessage(errorMessage);
    }
  };

  const renderQuestionTree = (parentId: number | null, level = 0): ReactNode => {
    const children = getQuestionChildren(parentId);

    return children.map((question) => {
      const childCount = getQuestionChildren(question.id).length;
      const isExpanded = expandedQuestionIds.has(question.id);
      const hasChildren = childCount > 0;

      return (
        <div className={`sd-faq-tree-branch ${level > 0 ? "nested" : ""}`} key={question.id}>
          <article className={`sd-faq-tree-item ${editingQuestionId === question.id ? "selected" : ""}`}>
            <button
              className={`sd-tree-toggle ${hasChildren ? "" : "empty"}`}
              type="button"
              onClick={() => hasChildren && toggleQuestionExpanded(question.id)}
              disabled={!hasChildren}
              aria-label={isExpanded ? "Recolher subperguntas" : "Expandir subperguntas"}
            >
              {hasChildren ? (isExpanded ? "v" : ">") : ""}
            </button>

            <div className="sd-faq-tree-content">
              <div className="sd-question-meta">
                <strong>{question.parent_title ?? "Menu inicial"}</strong>
                <small>/{question.slug}</small>
                {hasChildren && <span className="sd-count-badge">{childCount}</span>}
                {question.evidence_source && <span className="sd-link-badge">link</span>}
              </div>
              <h3>{question.title}</h3>
              <p>{question.answer_summary || question.prompt || "Sem resposta cadastrada."}</p>
            </div>

            {canManageQuestions && (
              <div className="sd-faq-tree-actions">
                <button className="sd-icon-action" type="button" onClick={() => startCreatingQuestion(question.id)}>
                  + Subpergunta
                </button>
                <button className="sd-secondary-button" type="button" onClick={() => startEditingQuestion(question)}>
                  Modificar
                </button>
                <button
                  className="sd-danger-button"
                  type="button"
                  onClick={() => {
                    const descendants = getDescendantIds(question.id).length;
                    const suffix = descendants > 0 ? ` Isso tambem exclui ${descendants} subpergunta(s).` : "";

                    if (window.confirm(`Excluir "${question.title}"?${suffix}`)) {
                      void removeQuestion(question.id);
                    }
                  }}
                >
                  Excluir
                </button>
              </div>
            )}
          </article>

          {isExpanded && hasChildren && (
            <div className="sd-faq-tree-children">
              {renderQuestionTree(question.id, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const toggleInquiryStatus = async (inquiry: Inquiry) => {
    const nextStatus = inquiry.status === "ABERTA" ? "RESPONDIDA" : "ABERTA";
    setMessage(null);
    setUpdatingInquiryId(inquiry.id);

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
    } finally {
      setUpdatingInquiryId(null);
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
          <div className="sd-questions-manager">
            <div className="sd-question-toolbar">
              <div>
                <h2>Gerenciar FAQ</h2>
                <p>Gerencie a arvore de perguntas e respostas do chatbot.</p>
              </div>
              {canManageQuestions && (
                <button className="sd-btn-primary" type="button" onClick={() => startCreatingQuestion(null)}>
                  Nova pergunta
                </button>
              )}
            </div>

            {questionFormMode !== "hidden" && (
              <section className="sd-admin-section sd-question-form-panel" ref={questionFormRef}>
                <div className="sd-section-heading">
                  <div>
                    <h2>{questionFormMode === "edit" ? "Editar item" : "Novo item"}</h2>
                    <p>
                      {questionForm.parent_id
                        ? `Item selecionado ${questions.find((question) => question.id === Number(questionForm.parent_id))?.title ?? ""}`
                        : "Item no menu inicial"}
                    </p>
                  </div>
                  <button className="sd-secondary-button" type="button" onClick={resetQuestionForm}>
                    Fechar
                  </button>
                </div>

                {formContextQuestion && (
                  <div className="sd-form-context-card" aria-label="Contexto da pergunta selecionada">
                    <span className="sd-form-context-label">
                      {questionFormMode === "edit" ? "Editando" : "Criando subpergunta para"}
                    </span>
                    <div className="sd-faq-tree-content">
                      <div className="sd-question-meta">
                        <strong>{formContextQuestion.parent_title ?? "Menu inicial"}</strong>
                        <small>/{formContextQuestion.slug}</small>
                      </div>
                      <h3>{formContextQuestion.title}</h3>
                      <p>{formContextQuestion.answer_summary || formContextQuestion.prompt || "Sem resposta cadastrada."}</p>
                    </div>
                  </div>
                )}

                <form className="sd-admin-form" onSubmit={handleQuestionSubmit}>
                  <div className="sd-form-block">
                    <label>
                      Texto da opcao / pergunta
                      <input
                        value={questionForm.title}
                        onChange={(event) => updateQuestionTitle(event.target.value)}
                        placeholder="Ex.: Horario das aulas"
                        required
                      />
                    </label>

                    <label>
                      Resposta
                      <textarea
                        value={questionForm.answer_summary}
                        onChange={(event) => setQuestionForm({ ...questionForm, answer_summary: event.target.value })}
                        rows={4}
                        placeholder="Resposta exibida quando o usuario selecionar esta pergunta."
                      />
                    </label>
                  </div>

                  <div className="sd-form-two-columns">
                    <label>
                      Link externo
                      <input
                        type="url"
                        value={questionForm.evidence_source}
                        onChange={(event) => setQuestionForm({ ...questionForm, evidence_source: event.target.value })}
                        placeholder="https://..."
                      />
                    </label>

                    <label>
                      Texto/observacao do link
                      <input
                        value={questionForm.evidence_excerpt}
                        onChange={(event) => setQuestionForm({ ...questionForm, evidence_excerpt: event.target.value })}
                        placeholder="Saiba mais"
                      />
                    </label>
                  </div>

                  <div className="sd-form-two-columns compact">
                    <label>
                      Ordem
                      <input
                        type="number"
                        min="0"
                        value={questionForm.display_order}
                        onChange={(event) => setQuestionForm({ ...questionForm, display_order: event.target.value })}
                      />
                    </label>
                  </div>

                  <div className="sd-form-two-columns compact">
                    <label className="sd-checkbox-label">
                      <input
                        type="checkbox"
                        checked={questionForm.is_active}
                        onChange={(event) => setQuestionForm({ ...questionForm, is_active: event.target.checked })}
                      />
                      Visivel no chat
                    </label>
                  </div>

                  <div className="sd-admin-actions">
                    <button className="sd-btn-primary" type="submit" disabled={savingQuestion}>
                      {savingQuestion ? "Salvando..." : questionFormMode === "edit" ? "Salvar" : "Criar"}
                    </button>
                    <button className="sd-secondary-button" type="button" onClick={resetQuestionForm}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="sd-admin-section sd-question-tree-card">
              <div className="sd-question-tree-header">
                <div>
                  <h2>Arvore de perguntas</h2>
                  <p>{questions.length} pergunta(s) cadastrada(s)</p>
                </div>
              </div>

              <label className="sd-question-search">
                Buscar pergunta
                <input
                  type="search"
                  placeholder="Digite parte da pergunta ou categoria"
                  value={questionSearch}
                  onChange={(event) => setQuestionSearch(event.target.value)}
                />
              </label>

              <div className="sd-faq-tree">
                {questionSearch.trim() ? (
                  filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => {
                      const childCount = getQuestionChildren(question.id).length;

                      return (
                        <article className={`sd-faq-tree-item ${editingQuestionId === question.id ? "selected" : ""}`} key={question.id}>
                          <span className="sd-tree-toggle empty" />
                          <div className="sd-faq-tree-content">
                            <div className="sd-question-meta">
                              <strong>{question.parent_title ?? "Menu inicial"}</strong>
                              <small>/{question.slug}</small>
                              {childCount > 0 && <span className="sd-count-badge">{childCount}</span>}
                              {question.evidence_source && <span className="sd-link-badge">link</span>}
                            </div>
                            <h3>{question.title}</h3>
                            <p>{question.answer_summary || question.prompt || "Sem resposta cadastrada."}</p>
                          </div>
                          {canManageQuestions && (
                            <div className="sd-faq-tree-actions">
                              <button className="sd-icon-action" type="button" onClick={() => startCreatingQuestion(question.id)}>
                                + Subpergunta
                              </button>
                              <button className="sd-secondary-button" type="button" onClick={() => startEditingQuestion(question)}>
                                Modificar
                              </button>
                              <button
                                className="sd-danger-button"
                                type="button"
                                onClick={() => {
                                  const descendants = getDescendantIds(question.id).length;
                                  const suffix = descendants > 0 ? ` Isso tambem exclui ${descendants} subpergunta(s).` : "";

                                  if (window.confirm(`Excluir "${question.title}"?${suffix}`)) {
                                    void removeQuestion(question.id);
                                  }
                                }}
                              >
                                Excluir
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })
                  ) : (
                    <p>Nenhuma pergunta encontrada.</p>
                  )
                ) : questions.length === 0 ? (
                  <div className="sd-empty-state">
                    <p>Nenhuma pergunta cadastrada.</p>
                    {canManageQuestions && (
                      <button className="sd-btn-primary" type="button" onClick={() => startCreatingQuestion(null)}>
                        Criar primeira pergunta
                      </button>
                    )}
                  </div>
                ) : (
                  renderQuestionTree(null)
                )}
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
                    <button
                      type="button"
                      className="sd-secondary-button"
                      disabled={updatingInquiryId === inquiry.id}
                      onClick={() => void toggleInquiryStatus(inquiry)}
                    >
                      {updatingInquiryId === inquiry.id
                        ? "Atualizando..."
                        : `Marcar como ${inquiry.status === "ABERTA" ? "respondida" : "aberta"}`}
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
