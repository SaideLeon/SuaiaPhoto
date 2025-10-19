# 🎨 LuxiaEstudio

Bem-vindo ao **LuxiaEstudio**! Uma ferramenta de edição de imagens com IA que permite transformar suas fotos em obras de arte com estilos pré-definidos. Envie uma imagem, escolha um modelo, personalize os detalhes e deixe que o poder do Gemini da Google crie uma nova versão para você.

## ✨ Funcionalidades

- **Upload de Imagem**: Envie facilmente suas próprias fotos (JPG, PNG, WebP) para começar a editar.
- **Seleção de Estilos**: Escolha entre uma variedade de modelos de prompts criativos, como "Paisagem Urbana Cyberpunk", "Retrato Vintage de Hollywood" e mais.
- **Personalização Detalhada**: Ajuste o gênero para adaptar o prompt e descreva roupas personalizadas para obter resultados mais precisos.
- **Modo de Edição Contínua**: Após cada geração, a imagem resultante se torna a nova base para edições futuras, permitindo um fluxo criativo rápido e iterativo sem a necessidade de reenviar a imagem.
- **Geração com IA**: Utiliza o modelo `gemini-2.5-flash-image` para realizar edições de imagem de alta qualidade.
- **Download Fácil**: Baixe suas criações com um único clique.
- **Interface Intuitiva**: Um design limpo e responsivo construído com React e Tailwind CSS.
- **Instalável (PWA)**: Adicione o LuxiaEstudio à sua tela inicial para acesso rápido, como um aplicativo nativo.
- **Funcionalidade Offline**: A aplicação principal carrega instantaneamente e funciona offline, graças ao cache do service worker.

## 🚀 Como Usar

O processo é simples e direto:

1.  **Envie sua Imagem**: Clique na área de upload e selecione uma foto do seu dispositivo.
2.  **Escolha um Estilo**: Selecione um dos modelos disponíveis na lista suspensa.
3.  **Defina o Gênero**: Escolha "Masculino" ou "Feminino" para garantir que o prompt de IA use os termos corretos.
4.  **Personalize as Roupas (Opcional)**: Se desejar, descreva uma peça de roupa específica. Caso contrário, o estilo padrão do modelo será usado.
5.  **Clique em "Gerar Imagem"**: A IA começará a processar sua solicitação.
6.  **Continue Editando**: A nova imagem aparecerá no painel de resultados e se tornará a imagem original. Mude o estilo ou as opções e gere novamente para refinar ainda mais sua arte.
7.  **Baixe sua Criação**: Use o botão "Baixar Imagem" para salvar o resultado final.

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - [React](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
- **API de IA**:
  - [Google Gemini API](https://ai.google.dev/)
- **PWA**:
  - Service Worker
  - Web App Manifest

## 📁 Estrutura do Projeto

```
/
├── components/         # Componentes React reutilizáveis (Header, Loader)
├── services/           # Lógica de comunicação com a API Gemini
├── App.tsx             # Componente principal da aplicação
├── constants.ts        # Constantes, como os modelos de prompts
├── icon.svg            # Ícone da aplicação
├── index.html          # Ponto de entrada HTML
├── index.tsx           # Ponto de entrada do React
├── manifest.json       # Manifest do PWA
├── metadata.json       # Metadados do projeto
├── README.md           # Este arquivo
├── service-worker.ts   # Service worker para PWA e funcionalidade offline
└── types.ts            # Definições de tipos TypeScript
```

Aproveite para soltar a sua criatividade com o **LuxiaEstudio**!