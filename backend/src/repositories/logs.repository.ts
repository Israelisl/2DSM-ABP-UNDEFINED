import { pool } from "../database";

type CreateLogDTO = {
  sessionId?: string;
  navigationFlow: unknown[];
  inquiryIds?: number[];
  flag?: "ATENDEU" | "NAO_ATENDEU";
  feedbackComment?: string | null;
};

export const logsRepository = {
  async create(data: CreateLogDTO) {
    const result = await pool.query(
      `
      INSERT INTO interaction_logs (
        session_id,
        navigation_flow,
        inquiry_ids,
        flag,
        feedback_comment
      )
      VALUES (
        COALESCE($1, gen_random_uuid()),
        $2::jsonb,
        COALESCE($3::jsonb, '[]'::jsonb),
        $4,
        $5
      )
      RETURNING *
      `,
      [
        data.sessionId ?? null,
        JSON.stringify(data.navigationFlow),
        JSON.stringify(data.inquiryIds ?? []),
        data.flag ?? null,
        data.feedbackComment ?? null,
      ]
    );

    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query(`
    SELECT id, session_id, navigation_flow, inquiry_ids, flag, feedback_comment, created_at
    FROM interaction_logs
    ORDER BY created_at DESC
  `);

    return result.rows;
  }
};
