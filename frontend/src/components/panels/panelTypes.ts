export type PanelKey = 'perguntas' | 'duvidas' | 'registros' | 'logs';

export type PanelItem = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
};

export type Panel = {
  key: PanelKey;
  label: string;
  title: string;
  items: PanelItem[];
};
