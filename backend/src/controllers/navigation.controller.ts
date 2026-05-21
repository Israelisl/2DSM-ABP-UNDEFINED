import { Request, Response } from "express";
import { navigationService } from "../services/navigation.service";
import type { NavigationNodeWriteData } from "../repositories/navigation.repository";

function normalizeNullableText(value: unknown) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeNavigationPayload(body: Record<string, unknown>): NavigationNodeWriteData | null {
  const title = normalizeNullableText(body.title);
  const slug = normalizeNullableText(body.slug);

  if (!title || !slug) return null;

  const parentIdValue = body.parent_id;
  const parent_id =
    parentIdValue === null || parentIdValue === undefined || parentIdValue === ""
      ? null
      : Number(parentIdValue);

  const displayOrderValue = Number(body.display_order ?? 0);

  if (parent_id !== null && (!Number.isInteger(parent_id) || parent_id <= 0)) {
    return null;
  }

  if (!Number.isInteger(displayOrderValue) || displayOrderValue < 0) {
    return null;
  }

  return {
    parent_id,
    title,
    slug,
    prompt: normalizeNullableText(body.prompt),
    answer_summary: normalizeNullableText(body.answer_summary),
    evidence_excerpt: normalizeNullableText(body.evidence_excerpt),
    evidence_source: normalizeNullableText(body.evidence_source),
    display_order: displayOrderValue,
    is_active: typeof body.is_active === "boolean" ? body.is_active : true,
  };
}

export async function getRootNavigation(req: Request, res: Response) {
    try {
        const data = await navigationService.getRoot();
        
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Erro ao buscar navegação"});
    }
}

export async function getChildren(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const data = await navigationService.getChildren(slug);

    if (!data) {
        return res.status(404).json({ error: "Nó não encontrado" });
    }

  res.json(data);
}

export async function listNavigationNodes(_req: Request, res: Response) {
  try {
    const data = await navigationService.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar perguntas." });
  }
}

export async function createNavigationNode(req: Request, res: Response) {
  const data = normalizeNavigationPayload(req.body);

  if (!data) {
    res.status(400).json({ error: "Titulo, slug, parent_id e ordem devem ser validos." });
    return;
  }

  try {
    const node = await navigationService.create(data);
    res.status(201).json(node);
  } catch (error) {
    console.error(error);
    res.status(409).json({ error: "Nao foi possivel cadastrar a pergunta. Verifique se o slug ja existe." });
  }
}

export async function updateNavigationNode(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = normalizeNavigationPayload(req.body);

  if (!Number.isInteger(id) || id <= 0 || !data) {
    res.status(400).json({ error: "Dados invalidos para atualizar a pergunta." });
    return;
  }

  try {
    const node = await navigationService.update(id, data);

    if (!node) {
      res.status(404).json({ error: "Pergunta nao encontrada." });
      return;
    }

    res.json(node);
  } catch (error) {
    console.error(error);
    res.status(409).json({ error: "Nao foi possivel atualizar a pergunta. Verifique se o slug ja existe." });
  }
}

export async function deleteNavigationNode(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Id da pergunta invalido." });
    return;
  }

  try {
    const deleted = await navigationService.deactivate(id);

    if (!deleted) {
      res.status(404).json({ error: "Pergunta nao encontrada." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao desativar pergunta." });
  }
}
