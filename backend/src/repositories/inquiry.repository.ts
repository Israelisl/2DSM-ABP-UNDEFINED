import { pool } from "../database";

// Estrutura de dados usada para criar uma nova dúvida no banco.
export type InquiryCreateData = {
  requester_name: string;
  requester_email: string;
  question: string;
};

// Status permitidos pela enum inquiry_status criada no banco de dados.
export type InquiryStatus = "ABERTA" | "RESPONDIDA";

export const inquiryRepository = {
  // Insere um novo registro na tabela inquiries e retorna o registro criado.
  async createInquiry(data: InquiryCreateData) {
    const result = await pool.query(
      `INSERT INTO inquiries (requester_name, requester_email, question, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, requester_name, requester_email, question, status, created_at`,
      [data.requester_name, data.requester_email, data.question, "ABERTA"]
    );

    return result.rows[0];
  },

  // Retorna as duvidas mais recentes primeiro para facilitar o acompanhamento.
  async findAll() {
    const result = await pool.query(
      `SELECT
         inquiries.id,
         inquiries.requester_name,
         inquiries.requester_email,
         inquiries.question,
         inquiries.status,
         inquiries.answered_by,
         users.name AS answered_by_name,
         inquiries.created_at,
         inquiries.updated_at
       FROM inquiries
       LEFT JOIN users ON users.id = inquiries.answered_by
       ORDER BY inquiries.created_at DESC`
    );

    return result.rows;
  },

  // Atualiza o status e sincroniza o campo answered_by com o estado da duvida.
  async updateStatus(id: number, status: InquiryStatus, answeredBy: string | null) {
    const result = await pool.query(
      `UPDATE inquiries
       SET status = $1::inquiry_status,
           answered_by = CASE WHEN $1::inquiry_status = 'RESPONDIDA' THEN $2::uuid ELSE NULL END
       WHERE id = $3
       RETURNING
         id,
         requester_name,
         requester_email,
         question,
         status,
         answered_by,
         (SELECT name FROM users WHERE users.id = inquiries.answered_by) AS answered_by_name,
         created_at,
         updated_at`,
      [status, answeredBy, id]
    );

    return result.rows[0] ?? null;
  },
};
