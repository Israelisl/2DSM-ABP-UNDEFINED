// frontend/src/hooks/useChat.ts
import { useState, useEffect, useRef } from 'react';
import { chatService, type NavigationNode } from '../services/chatService';

export type DisplayOption = NavigationNode | { title: 'Voltar'; slug: '__back' };

export type Message = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  html?: boolean;
  evidence_source?: string | null;
};

type NavigationLevel = {
  slug: string | null;
  title: string;
  options: DisplayOption[];
};

const BACK_OPTION: DisplayOption = { title: 'Voltar', slug: '__back' };

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', text: 'Para qual curso você deseja atendimento?' }
  ]);
  const [currentOptions, setCurrentOptions] = useState<DisplayOption[]>([]);
  const [history, setHistory] = useState<NavigationLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, currentOptions]);

  useEffect(() => {
    (async () => {
      try {
        const rootOptions = await chatService.fetchRoot();
        setCurrentLevel({ slug: null, title: 'root', options: rootOptions });
        setCurrentOptions(rootOptions);
      } catch (error) {
        console.error(error);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'bot',
            text: 'Não foi possível carregar as opções de atendimento no momento. Tente novamente mais tarde.'
          }
        ]);
      }
    })();
  }, []);

  const buildOptions = (children: NavigationNode[], canGoBack: boolean) => {
    if (children.length === 0) return [BACK_OPTION];
    return canGoBack ? [...children, BACK_OPTION] : children;
  };

  const getBotText = (node: NavigationNode, children: NavigationNode[]) => {
    if (node.answer_summary) return node.answer_summary;
    if (children.length > 0) return `Entendido! O que você deseja saber sobre ${node.title}?`;
    return `Ainda não temos uma resposta detalhada para "${node.title}".`;
  };

  const handleChoice = async (option: DisplayOption) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: option.title }]);

    if (option.slug === '__back') {
      const previous = history[history.length - 1];
      if (!previous) return;

      setHistory(prev => prev.slice(0, -1));
      setCurrentLevel(previous);
      setCurrentOptions(previous.options);
      return;
    }

    try {
      const data = await chatService.fetchChildren(option.slug);
      const nextOptions = buildOptions(data.children, true);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: getBotText(data.parent, data.children),
          html: Boolean(data.parent.answer_summary),
          evidence_source: data.parent.evidence_source
        }
      ]);

      if (currentLevel) setHistory(prev => [...prev, currentLevel]);
      setCurrentLevel({ slug: option.slug, title: option.title, options: nextOptions });
      setCurrentOptions(nextOptions);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Não foi possível carregar a resposta desejada no momento. Por favor, tente outra opção.'
        }
      ]);
    }
  };

  return { messages, currentOptions, bottomRef, handleChoice };
}