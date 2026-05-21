import { pool } from "../database";

export type NavigationNodeWriteData = {
  parent_id: number | null;
  title: string;
  slug: string;
  prompt: string | null;
  answer_summary: string | null;
  evidence_excerpt: string | null;
  evidence_source: string | null;
  display_order: number;
  is_active: boolean;
};

export const navigationRepository = {
  async findRoot() {
    const result = await pool.query(`
      SELECT id, title, slug, prompt, answer_summary, evidence_excerpt, evidence_source
      FROM navigation_nodes
      WHERE parent_id IS NULL
        AND is_active = true
      ORDER BY display_order
    `);

    return result.rows;
  },
  async findChildrenBySlug(slug: string) {
    const parentResult = await pool.query(
      `
      SELECT id, title, slug, answer_summary, evidence_excerpt, evidence_source
      FROM navigation_nodes
      WHERE slug = $1
        AND is_active = true
      `,
      [slug]
    );
    if (parentResult.rows.length === 0) {
      return null
    }

    const parent = parentResult.rows[0]

    const childrenResult = await pool.query(
      `
      SELECT id, title, slug, answer_summary, evidence_excerpt, evidence_source
      FROM navigation_nodes
      WHERE parent_id = $1
        AND is_active = true
      ORDER BY display_order
      `,
      [parent.id]
    );
    return {
      parent,
      children: childrenResult.rows
    }
  },

  async findAll() {
    const result = await pool.query(`
      SELECT
        node.id,
        node.parent_id,
        parent.title AS parent_title,
        node.title,
        node.slug,
        node.prompt,
        node.answer_summary,
        node.evidence_excerpt,
        node.evidence_source,
        node.display_order,
        node.is_active,
        node.created_at,
        node.updated_at
      FROM navigation_nodes node
      LEFT JOIN navigation_nodes parent ON parent.id = node.parent_id
      ORDER BY
        COALESCE(parent.display_order, node.display_order),
        node.parent_id NULLS FIRST,
        node.display_order,
        node.title
    `);

    return result.rows;
  },

  async create(data: NavigationNodeWriteData) {
    const result = await pool.query(
      `
      INSERT INTO navigation_nodes (
        parent_id,
        title,
        slug,
        prompt,
        answer_summary,
        evidence_excerpt,
        evidence_source,
        display_order,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id,
        parent_id,
        title,
        slug,
        prompt,
        answer_summary,
        evidence_excerpt,
        evidence_source,
        display_order,
        is_active,
        created_at,
        updated_at
      `,
      [
        data.parent_id,
        data.title,
        data.slug,
        data.prompt,
        data.answer_summary,
        data.evidence_excerpt,
        data.evidence_source,
        data.display_order,
        data.is_active,
      ],
    );

    return result.rows[0];
  },

  async update(id: number, data: NavigationNodeWriteData) {
    const result = await pool.query(
      `
      UPDATE navigation_nodes
      SET
        parent_id = $1,
        title = $2,
        slug = $3,
        prompt = $4,
        answer_summary = $5,
        evidence_excerpt = $6,
        evidence_source = $7,
        display_order = $8,
        is_active = $9
      WHERE id = $10
      RETURNING
        id,
        parent_id,
        title,
        slug,
        prompt,
        answer_summary,
        evidence_excerpt,
        evidence_source,
        display_order,
        is_active,
        created_at,
        updated_at
      `,
      [
        data.parent_id,
        data.title,
        data.slug,
        data.prompt,
        data.answer_summary,
        data.evidence_excerpt,
        data.evidence_source,
        data.display_order,
        data.is_active,
        id,
      ],
    );

    return result.rows[0] ?? null;
  },

  async deactivate(id: number) {
    const result = await pool.query(
      `
      UPDATE navigation_nodes
      SET is_active = false
      WHERE id = $1
      RETURNING id
      `,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }
};

