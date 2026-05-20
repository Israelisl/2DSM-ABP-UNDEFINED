import { pool } from "../database";

export const navigationRepository = {
  async findRoot() {
    const result = await pool.query(`
      SELECT id, title, slug
      FROM navigation_nodes
      WHERE parent_id IS NULL
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
  }
};

