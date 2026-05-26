import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import FaqTreeItem from '@/components/admin/FaqTreeItem';
import FaqItemForm from '@/components/admin/FaqItemForm';

export default function Admin() {
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [parentIdForNew, setParentIdForNew] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryClient = useQueryClient();

  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['faq-items'],
    queryFn: () => base44.entities.FaqItem.list('order', 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FaqItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-items'] });
      resetForm();
      toast.success('Item criado com sucesso');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FaqItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-items'] });
      resetForm();
      toast.success('Item atualizado com sucesso');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FaqItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-items'] });
      toast.success('Item excluído com sucesso');
    },
  });

  const getChildren = (parentId) => {
    if (!parentId) {
      return allItems.filter((item) => !item.parent_id || item.parent_id === '').sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return allItems.filter((item) => item.parent_id === parentId).sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const getDescendantIds = (parentId) => {
    const children = allItems.filter((item) => item.parent_id === parentId);
    let ids = children.map((c) => c.id);
    children.forEach((child) => {
      ids = [...ids, ...getDescendantIds(child.id)];
    });
    return ids;
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
    setParentIdForNew(null);
  };

  const handleSave = (formData) => {
    if (editingItem?.id) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate({
        ...formData,
        parent_id: parentIdForNew || '',
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setParentIdForNew(item.parent_id || null);
    setShowForm(true);
  };

  const handleAddChild = (parentId) => {
    setEditingItem(null);
    setParentIdForNew(parentId);
    setShowForm(true);
  };

  const handleAddRoot = () => {
    setEditingItem(null);
    setParentIdForNew(null);
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    // Delete descendants first
    const descendantIds = getDescendantIds(deleteTarget.id);
    for (const id of descendantIds) {
      await base44.entities.FaqItem.delete(id);
    }
    deleteMutation.mutate(deleteTarget.id);
    setDeleteTarget(null);
  };

  const renderTree = (parentId, level = 0) => {
    const children = getChildren(parentId);
    return children.map((item) => {
      const itemChildren = getChildren(item.id);
      return (
        <FaqTreeItem
          key={item.id}
          item={item}
          childCount={itemChildren.length}
          level={level}
          onEdit={handleEdit}
          onDelete={(item) => setDeleteTarget(item)}
          onAddChild={handleAddChild}
        >
          {renderTree(item.id, level + 1)}
        </FaqTreeItem>
      );
    });
  };

  const parentItem = parentIdForNew ? allItems.find((i) => i.id === parentIdForNew) : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gerenciar FAQ</h1>
              <p className="text-sm text-muted-foreground">Gerencie as perguntas e respostas do chatbot</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Ver Chat</span>
              </Button>
            </Link>
            <Button size="sm" onClick={handleAddRoot} className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Pergunta</span>
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {editingItem?.id ? 'Editar Item' : 'Novo Item'}
                {parentItem && (
                  <span className="text-muted-foreground font-normal text-sm ml-2">
                    — Sub-item de "{parentItem.question_text}"
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FaqItemForm
                item={editingItem}
                onSave={handleSave}
                onCancel={resetForm}
                isSaving={createMutation.isPending || updateMutation.isPending}
              />
            </CardContent>
          </Card>
        )}

        {/* Tree */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Árvore de Perguntas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
              </div>
            ) : allItems.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">Nenhuma pergunta cadastrada</p>
                <Button size="sm" onClick={handleAddRoot} className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Criar primeira pergunta
                </Button>
              </div>
            ) : (
              <div className="space-y-0.5">{renderTree(null, 0)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir item</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteTarget?.question_text}"?
              {getDescendantIds(deleteTarget?.id || '').length > 0 &&
                ` Isso também excluirá ${getDescendantIds(deleteTarget?.id || '').length} sub-item(ns).`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}