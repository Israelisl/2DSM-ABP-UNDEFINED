import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

export default function FaqItemForm({ item, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState({
    question_text: '',
    answer_text: '',
    external_link: '',
    link_label: '',
    order: 0,
  });

  useEffect(() => {
    if (item) {
      setForm({
        question_text: item.question_text || '',
        answer_text: item.answer_text || '',
        external_link: item.external_link || '',
        link_label: item.link_label || '',
        order: item.order || 0,
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="question_text">Texto da opção / pergunta *</Label>
        <Input
          id="question_text"
          value={form.question_text}
          onChange={(e) => setForm({ ...form, question_text: e.target.value })}
          placeholder="Ex: Administração"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="answer_text">Resposta (exibida ao selecionar)</Label>
        <Textarea
          id="answer_text"
          value={form.answer_text}
          onChange={(e) => setForm({ ...form, answer_text: e.target.value })}
          placeholder="Ex: O curso de Administração forma profissionais..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="external_link">Link externo (opcional)</Label>
          <Input
            id="external_link"
            value={form.external_link}
            onChange={(e) => setForm({ ...form, external_link: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="link_label">Texto do link</Label>
          <Input
            id="link_label"
            value={form.link_label}
            onChange={(e) => setForm({ ...form, link_label: e.target.value })}
            placeholder="Saiba mais"
          />
        </div>
      </div>

      <div className="space-y-1.5 max-w-[120px]">
        <Label htmlFor="order">Ordem</Label>
        <Input
          id="order"
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSaving} className="gap-1.5">
          <Save className="w-4 h-4" />
          {item?.id ? 'Salvar' : 'Criar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="gap-1.5">
          <X className="w-4 h-4" />
          Cancelar
        </Button>
      </div>
    </form>
  );
}