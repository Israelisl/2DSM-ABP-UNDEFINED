import { type Panel } from './panelTypes';

export const panels: Panel[] = [
  {
    key: 'perguntas',
    label: 'Perguntas',
    title: 'Perguntas',
    items: [
      {
        id: 'pergunta-documentos',
        eyebrow: 'Pergunta #1',
        title: 'Como solicito documentos acadêmicos pela Secretaria Digital?',
        description: 'Acesse o atendimento, escolha o curso e selecione o tipo de documento desejado.'
      },
      {
        id: 'pergunta-calendario',
        eyebrow: 'Pergunta #2',
        title: 'Onde encontro o calendário acadêmico atualizado?',
        description: 'O calendário fica disponível nos materiais oficiais do curso e nos documentos públicos.'
      },
      {
        id: 'pergunta-avisos',
        eyebrow: 'Pergunta #3',
        title: 'Quais canais devo usar para acompanhar avisos importantes?',
        description: 'Consulte os comunicados da coordenação, a Secretaria Digital e os murais oficiais.'
      }
    ]
  },
  {
    key: 'duvidas',
    label: 'Dúvidas',
    title: 'Dúvidas',
    items: [
      {
        id: 'duvida-assunto',
        eyebrow: 'Dúvida #1',
        title: 'Para qual assunto você gostaria de obter informações?'
      },
      {
        id: 'duvida-provas-rematricula',
        eyebrow: 'Dúvida #2',
        title: 'Onde eu vejo as datas das provas oficiais e o calendário de rematrícula do próximo semestre? Não achei em nenhum mural aqui.'
      },
      {
        id: 'duvida-biblioteca-virtual',
        eyebrow: 'Dúvida #3',
        title: 'Esqueci como entra na biblioteca virtual para ver os livros de Engenharia de Software. Onde fica o link de acesso e qual login eu uso?'
      }
    ]
  },
  {
    key: 'registros',
    label: 'Registros',
    title: 'Registros',
    items: [
      {
        id: 'registro-matricula',
        eyebrow: 'Registro #1',
        title: 'Atendimento de matrícula encaminhado para análise.',
        description: 'Solicitação registrada às 09:12 com prioridade normal.'
      },
      {
        id: 'registro-estagio',
        eyebrow: 'Registro #2',
        title: 'Documento de estágio recebido pela secretaria.',
        description: 'A equipe acadêmica fará a conferência dos dados enviados.'
      },
      {
        id: 'registro-cadastro',
        eyebrow: 'Registro #3',
        title: 'Atualização cadastral concluída.',
        description: 'O aluno foi notificado sobre a conclusão do procedimento.'
      }
    ]
  },
  {
    key: 'logs',
    label: 'Logs',
    title: 'Logs',
    items: [
      {
        id: 'log-acesso-painel',
        eyebrow: 'Log #1',
        title: 'Usuário acessou o painel de atendimento.',
        description: 'Evento registrado pelo sistema de navegação.'
      },
      {
        id: 'log-calendario',
        eyebrow: 'Log #2',
        title: 'Consulta ao calendário acadêmico realizada.',
        description: 'Retorno entregue com base nos arquivos públicos disponíveis.'
      },
      {
        id: 'log-documentos',
        eyebrow: 'Log #3',
        title: 'Opção de documentos acadêmicos selecionada.',
        description: 'Fluxo preparado para orientar a próxima etapa do atendimento.'
      }
    ]
  }
];
