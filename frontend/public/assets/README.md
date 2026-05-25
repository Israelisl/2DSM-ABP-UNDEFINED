# Assets - Arquivos Públicos

Esta pasta contém arquivos estáticos servidos pelo frontend, como PDFs e imagens usados no atendimento.

## Responsabilidade

Os arquivos dentro de `frontend/public/assets/` ficam disponíveis publicamente pela aplicação Vite.

Em ambiente local, eles podem ser acessados a partir de:

```txt
http://localhost:5173/assets/
```

## Organização

```txt
frontend/public/assets/
|-- pdf/    # Documentos oficiais em PDF
|-- png/    # Imagens públicas, como horários de aula
`-- README.md
```

## Como Adicionar Arquivos

### Horários em PNG

Coloque os arquivos de horários em:

```txt
frontend/public/assets/png/
```

Exemplos de nomes:

```txt
horario-aula-1dsm.png
horario-aula-2dsm.png
horario-aula-1geo.png
```

Recomendações:

- Usar nomes descritivos e sem espaços.
- Preferir letras minúsculas.
- Conferir se o arquivo está versionado no Git.
- Manter imagens com tamanho adequado para carregamento no navegador.

### Documentos em PDF

Coloque os documentos em:

```txt
frontend/public/assets/pdf/
```

Exemplos:

```txt
DSM-PPC.pdf
Calendario_Academico_2026.pdf
Regulamento_Geral_dos_Cursos.pdf
```

Após adicionar um arquivo, confira se qualquer referência no seed ou no banco aponta exatamente para o nome versionado.

## Referências nas Respostas

Arquivos públicos podem ser referenciados em respostas do chatbot usando caminhos como:

```txt
/assets/pdf/Calendario_Academico_2026.pdf
/assets/png/horario-aula-1dsm.png
```

Quando o caminho for salvo no banco como fonte ou link, ele deve apontar para um arquivo realmente existente nesta pasta ou para uma URL externa válida.

## Exemplo no Seed SQL

No seed do banco, um arquivo público pode ser associado a uma resposta por meio do campo `evidence_source`.

Exemplo com um arquivo existente em `frontend/public/assets/png/`:

```sql
SELECT upsert_navigation_node(
  'dsm-horario-aulas',
  '1º semestre',
  'dsm-horario-aulas-1-semestre',
  NULL,
  'Horário de aulas do 1º semestre.',
  NULL,
  '/assets/png/horario-aula-1dsm.png',
  1,
  TRUE
);
```

Nesse exemplo, o arquivo precisa existir em:

```txt
frontend/public/assets/png/horario-aula-1dsm.png
```

E ficará disponível em:

```txt
http://localhost:5173/assets/png/horario-aula-1dsm.png
```

O projeto possui algumas referências legadas com `assets/...`. Para novas referências, prefira o padrão absoluto `/assets/...`, pois ele aponta diretamente para a raiz pública do frontend.

## Nota sobre Docker

Quando executado via Docker Compose, os arquivos em `frontend/public/assets/` são servidos automaticamente pela aplicação Vite em:

```txt
http://localhost:5173/assets/
```

Ao reconstruir o container, certifique-se de que os arquivos referenciados pelo seed ou pelo banco estão presentes antes de executar:

```bash
docker compose up --build
```

## Cuidados

- Não referenciar arquivos que não estejam versionados.
- Evitar nomes com espaços.
- Preferir nomes descritivos em letras minúsculas.
- Conferir se o arquivo abre corretamente após subir o frontend.