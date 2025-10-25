
import type { PromptTemplate, Gender } from './types';

export const DEFAULT_IMAGE_URL = "data:image/webp;base64,UklGRqACAABwXRUJQVlA4IIQCAABwHwCdASoZABkAPm0ylUekIqI8pqAAMAbEtLEwA/bi6if8r/yP9t/Yv+L/k/9r9gH8v/s/+l/yP+R/cP+L/n/9b/rv+J/y/+h/03/E/6H/Zf4L/yf9l/tP+Z/3//3/5n7AP5Z/UP+d/x/+L/03/Z/4//B/2f9//9P///9r8AP7f/pv+r/tP+l/1n/d/93///9n8AP/iWIAAAAAAAT8N8/r9Xv3T/Bf7/+v9f/0/5P+f/Lf6r/pf0D/J/mf7L9y/xv+d/q//T/tP8Z+9f8f/pf9F/fP+L/lf7//zf/H/z/9z/33/D/9/+p/////+gD//6sAAAACUN1/8hAAAAAAB4AAD++8gD+f38b+b9AAAARt4AAP7+WAD+/bgAAP7+WAD+/bgAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+//lQAAAAA";

const COMPOSITION_PROMPT_TEMPLATE = (sceneDescription: string, aspectRatio: string, brandTextColor: 'white' | 'light gray' = 'light gray') => `
Crie uma nova imagem fotorrealista combinando o rosto da primeira imagem enviada com o corpo, a pose e as roupas da segunda imagem enviada. O rosto, o tom de pele e as características faciais do sujeito devem ser uma correspondência exata da primeira imagem. A estrutura corporal, as proporções, a pose e a roupa devem ser uma correspondência exata da segunda imagem.

Misture perfeitamente o rosto no corpo, garantindo a correspondência correta do tom de pele e das proporções. A imagem final deve ser altamente detalhada e realista.

Coloque esta pessoa recém-criada na seguinte cena:
${sceneDescription}

Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte limpa e ${brandTextColor} no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.
`;

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    title: "Pessoa Moderna na Poltrona",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `O sujeito está em uma moderna poltrona bege com pernas de madeira, sentado com confiança, inclinado ligeiramente para a frente com as mãos juntas. O fundo deve ser um cinza claro minimalista com um gradiente suave, iluminado uniformemente com luz de estúdio natural e suave. O clima é cinematográfico e de editorial de moda, com alto realismo e detalhes finos. Fotografado com uma lente de 50mm a f/2.8, composição de corpo inteiro.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }

      const subject = gender === 'masculino' ? 'man' : 'woman';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';
      const identityPreservation = "rosto real exato, penteado, tom de pele e estrutura/proporções corporais inalterados";
      const defaultClothing = gender === 'masculino'
        ? 'uma camisa social azul-marinho escura com os botões de cima abertos, calças slim-fit bege claro e mocassins pretos com solas marrons'
        : 'uma blusa de seda azul-marinho escura e estilosa, calças slim-fit bege claro e saltos pretos elegantes';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `Vista ${objectPronoun} com ${clothing}.`;

      return `Edite a imagem enviada para retratar o mesmo sujeito como um(a) ${subject} (mantendo ${identityPreservation}), colocando ${objectPronoun} em uma moderna poltrona bege com pernas de madeira. ${subjectPronoun} está sentado(a) com confiança, inclinado(a) ligeiramente para a frente com ${possessivePronoun} mãos juntas. ${clothingInstruction} O fundo deve ser um cinza claro minimalista com um gradiente suave, iluminado uniformemente com luz de estúdio natural e suave. O clima é cinematográfico e de editorial de moda, com alto realismo e detalhes finos. Fotografado com uma lente de 50mm a f/2.8, composição de corpo inteiro. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Retrato Editorial com Óculos",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `O sujeito está posicionado em um retrato de close-up. O rosto está inclinado ligeiramente para cima em aproximadamente 15-20 graus com o queixo gentilmente levantado, criando um ângulo confiante e aspiracional. A cabeça está centralizada no enquadramento, com o olhar direcionado diretamente para a câmera. O sujeito usa óculos de sol modernos de inspiração vintage com lentes degradê de âmbar para dourado e armações douradas lustrosas com detalhes finos gravados. O corpo está levemente angulado (cerca de 30 graus) para adicionar dimensão, com ombros relaxados e um ombro sutilmente mais perto da câmera. A expressão transmite confiança calma, com um leve sorriso composto. O fundo é um amarelo-dourado rico e saturado que transita para tons de âmbar mais profundos nas bordas. A iluminação direcional dramática vinda de cima à esquerda esculpe o rosto e o pescoço com destaques quentes e sombras suaves, enquanto uma luz de fundo sutil cria um efeito de auréola ao redor do cabelo. O estilo é de retrato de beleza de moda/editorial, com o rosto ocupando cerca de 60% do quadro.`;

      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio, 'white');
      }

      const subject = gender === 'masculino' ? 'man' : 'woman';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';
      const H_is = possessivePronoun.charAt(0).toUpperCase() + possessivePronoun.slice(1);
      const identityPreservation = "rosto real, penteado, tom de pele e estrutura/proporções corporais inalterados";
      const defaultClothing = 'um luxuoso blazer de seda preto com lapelas pontudas e um decote ligeiramente aberto, complementado por um colar de corrente de ouro minimalista e pequenos brincos de argola dourados';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `${subjectPronoun} veste ${clothing}.`;

      return `Edite a imagem enviada para mostrar o mesmo sujeito como um(a) ${subject} (mantendo ${possessivePronoun} ${identityPreservation}) posicionado em um retrato de close-up. ${H_is} rosto deve estar inclinado ligeiramente para cima em aproximadamente 15-20 graus com ${possessivePronoun} queixo gentilmente levantado, criando um ângulo confiante e aspiracional. ${H_is} cabeça está centralizada no quadro, com o olhar direcionado diretamente para a câmera. ${subjectPronoun} está usando óculos de sol modernos de inspiração vintage com lentes degradê de âmbar para dourado e armações douradas lustrosas com detalhes finos gravados, posicionados perfeitamente na ponte do ${possessivePronoun} nariz. ${H_is} corpo está levemente angulado (cerca de 30 graus) para adicionar dimensão, com ombros relaxados e um ombro sutilmente mais perto da câmera. ${H_is} expressão deve transmitir confiança calma, com um leve sorriso composto. ${clothingInstruction} O fundo é um amarelo-dourado rico e saturado que transita para tons de âmbar mais profundos nas bordas. A iluminação direcional dramática vinda de cima à esquerda esculpe ${possessivePronoun} rosto e pescoço com destaques quentes e sombras suaves, enquanto uma luz de fundo sutil cria um efeito de auréola ao redor do ${possessivePronoun} cabelo. A composição deve refletir um estilo de retrato de beleza de moda/editorial, com o rosto ocupando cerca de 60% do quadro. Mantenha alto realismo, iluminação cinematográfica e detalhes finos. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e branca no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Iluminação Neon (Azul e Vermelho)",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `O sujeito está em um retrato impressionante iluminado por uma dramática iluminação de duas cores. O rosto está dividido igualmente - um lado banhado por uma luz azul fria e o outro por uma tonalidade rosa/vermelha vibrante, produzindo um efeito visual de alto contraste, semelhante a neon. O sujeito está olhando diretamente para o espectador com uma expressão pensativa, com a mão esquerda apoiada no queixo. O fundo deve permanecer escuro e indistinto, desaparecendo sutilmente na sombra para enfatizar a iluminação colorida no rosto e na parte superior do corpo. O clima é cinematográfico e artístico.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }

      const subject = gender === 'masculino' ? 'man' : 'woman';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';
      const H_is = possessivePronoun.charAt(0).toUpperCase() + possessivePronoun.slice(1);
      const identityPreservation = "rosto real, expressão, penteado, tom de pele e estrutura/proporções corporais completamente inalterados";
      const defaultClothing = 'uma camiseta escura e um relógio no pulso esquerdo';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `${subjectPronoun} está usando ${clothing}.`;

      return `Edite a imagem enviada para retratar o mesmo ${subject} (mantendo ${possessivePronoun} ${identityPreservation}) em um retrato impressionante iluminado por uma dramática iluminação de duas cores. ${H_is} rosto deve ser dividido igualmente - um lado banhado por uma luz azul fria e o outro por uma tonalidade rosa/vermelha vibrante, produzindo um efeito visual de alto contraste, semelhante a neon. ${subjectPronoun} deve estar olhando diretamente para o espectador com uma expressão pensativa, com ${possessivePronoun} mão esquerda apoiada no ${possessivePronoun} queixo. ${clothingInstruction} O fundo deve permanecer escuro e indistinto, desaparecendo sutilmente na sombra para enfatizar a iluminação colorida no ${possessivePronoun} rosto e na parte superior do corpo. Mantenha o fotorrealismo, preservando todos os detalhes faciais e anatômicos reais do sujeito original, modificando apenas a iluminação, a gradação de cores e a atmosfera para alcançar um visual cinematográfico e artístico. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Editorial Corporativo Moderno",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const footwear = gender === 'masculino' ? 'sapatos sociais de couro preto' : 'elegantes saltos de couro preto';
      const scene = `A cena é um ambiente de estúdio minimalista com um fundo cinza neutro. O sujeito está sentado em um banco alto de madeira com uma estrutura de metal preta. A foto deve capturar o corpo inteiro, de uma leve distância, enfatizando a postura e o ambiente limpo e elegante. A perna direita está dobrada e apoiada no apoio para os pés do banco, enquanto a perna esquerda toca o chão naturalmente. O calçado é ${footwear} com detalhes modernos sutis. O cabelo parece bem arrumado, com textura natural e linhas limpas. A expressão facial é confiante e serena, com o olhar direcionado ligeiramente para o lado, projetando autoridade e foco calmo. A iluminação é de estúdio, suave e direcional, criando um contraste equilibrado entre áreas iluminadas e sombreadas. O estilo geral é editorial corporativo moderno, com um acabamento fotorrealista, cinematográfico e premium.`;

      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }
      
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const identityPreservation = "rosto real, penteado, tom de pele e estrutura/proporções corporais completamente inalterados";
      const defaultOutfit = gender === 'masculino' ? 'um blazer estruturado sobre os ombros, calças de alfaiataria slim-fit e uma camisa preta por baixo' : 'um blazer preto estruturado, calças de alfaiataria slim-fit e uma blusa de seda preta por baixo';
      const outfit = customClothing || defaultOutfit;
      const clothingInstruction = `A roupa deve ser: ${outfit}, transmitindo força, profissionalismo e estilo contemporâneo.`;

      return `Recrie esta cena usando a imagem enviada do(a) ${subject} como base, mantendo ${identityPreservation}. Mantenha o mesmo enquadramento, pose, iluminação e atmosfera. A composição deve mostrar a pessoa sentada em um banco alto de madeira com uma estrutura de metal preta, em um ambiente de estúdio minimalista com um fundo cinza neutro. A foto deve capturar o corpo inteiro, de uma leve distância, enfatizando a postura e o ambiente limpo e elegante. A perna direita deve estar dobrada e apoiada no apoio para os pés do banco, enquanto a perna esquerda toca o chão naturalmente. Substitua qualquer calçado existente por ${footwear} com detalhes modernos sutis. ${clothingInstruction} O cabelo deve parecer bem arrumado, com textura natural e linhas limpas. A expressão facial deve permanecer confiante e serena, com o olhar direcionado ligeiramente para o lado, projetando autoridade e foco calmo. A iluminação deve ser de estúdio, suave e direcional, criando um contraste equilibrado entre áreas iluminadas e sombreadas, realçando a textura do tecido e os contornos faciais. O fundo deve permanecer liso, com um gradiente cinza sutil, livre de distrações, mantendo toda a atenção no sujeito. O estilo geral deve ser editorial corporativo moderno, com um acabamento fotorrealista, cinematográfico e premium, adequado para um retrato de revista profissional. Alta qualidade fotográfica, tom sofisticado e precisão na iluminação de estúdio. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Retrato Glamouroso de Estúdio",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `A cena é um retrato de estúdio profissional e glamoroso. O estilo é com iluminação de clamshell suave e direcional, produzindo um gradiente sutil de chiaroscuro que realça os contornos faciais, destaques e a textura da pele. A pose é refinada e introspectiva, com a mão direita descansando suavemente sob o queixo, expressando ponderação e confiança. O fundo é preto sólido, enfatizando o contraste da iluminação e a atmosfera cinematográfica. O visual geral reflete um retrato de alta moda editorial, com detalhes ultrarrealistas, qualidade fotográfica premium e uma estética cinematográfica e moderna.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }

      const subject = gender === 'masculino' ? 'man' : 'woman';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';
      const identityPreservation = "rosto real, penteado, tom de pele e estrutura/proporções corporais completamente inalterados";
      const defaultClothing = 'uma camisa ou blazer de cetim preto ou de textura fina';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `Vista ${objectPronoun} com ${clothing}, transmitindo elegância e sofisticação.`;

      return `Edite a imagem enviada para criar um retrato de estúdio profissional e glamoroso do(a) mesmo(a) ${subject}, mantendo ${identityPreservation}. Estilize a cena com iluminação de clamshell suave e direcional, produzindo um gradiente sutil de chiaroscuro que realça os contornos faciais, destaques e a textura da pele. ${clothingInstruction} A pose deve ser refinada e introspectiva, com a mão direita descansando suavemente sob o queixo, expressando ponderação e confiança. Mantenha um fundo preto sólido, enfatizando o contraste da iluminação e a atmosfera cinematográfica. O visual geral deve refletir um retrato de alta moda editorial, com detalhes ultrarrealistas, qualidade fotográfica premium e uma estética cinematográfica e moderna. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Paisagem Urbana Cyberpunk",
    prompt: (_gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
        const scene = `O sujeito está em uma paisagem urbana Cyberpunk, sombria e encharcada de neon, à noite. O fundo apresenta arranha-céus futuristas imponentes, anúncios holográficos e ruas molhadas de chuva refletindo as vibrantes luzes ciano e magenta. A iluminação é dramática e de alto contraste, com fortes brilhos de neon lançando luz colorida sobre o sujeito. A atmosfera é cinematográfica, sombria e futurista.`;

        if (hasBodyImage) {
            return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio, 'white');
        }

        const identityPreservation = "rosto real exato, penteado e estrutura/proporções corporais do sujeito";
        const clothing = customClothing || 'uma jaqueta de couro escura estilosa sobre uma roupa tech-wear';
        const clothingInstruction = `Vista o sujeito com ${clothing}.`;

        return `Transforme a imagem enviada, mantendo ${identityPreservation}. Coloque-os em uma paisagem urbana Cyberpunk, sombria e encharcada de neon, à noite. O fundo deve apresentar arranha-céus futuristas imponentes, anúncios holográficos e ruas molhadas de chuva refletindo as vibrantes luzes ciano e magenta. ${clothingInstruction} A iluminação deve ser dramática e de alto contraste, com fortes brilhos de neon lançando luz colorida sobre o sujeito. A atmosfera é cinematográfica, sombria e futurista. Garanta qualidade fotorrealista com detalhes finos no ambiente e nas roupas. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e branca no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Retrato Vintage de Hollywood",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
        const scene = `A cena é um retrato clássico de Hollywood Vintage em preto e branco da década de 1940. A iluminação é monocromática, dramática e de alto contraste, reminiscente da cinematografia clássica do film noir (por exemplo, iluminação Rembrandt ou borboleta). A pose é equilibrada e confiante, olhando ligeiramente para fora da câmera. O fundo é um simples cenário de estúdio escuro para focar toda a atenção no sujeito. A imagem final tem uma sensação atemporal, elegante e glamorosa, com um sutil efeito de grão de filme para realçar a estética vintage.`;

        if (hasBodyImage) {
            return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
        }

        const identityPreservation = "rosto real, expressão e estrutura/proporções corporais do sujeito completamente inalterados";
        const defaultClothing = gender === 'masculino' ? 'um sofisticado smoking escuro com gravata borboleta' : 'um elegante vestido de noite';
        const clothing = customClothing || defaultClothing;
        const clothingInstruction = `Vista o sujeito com ${clothing}.`;

        return `Recrie a imagem enviada como um retrato clássico de Hollywood Vintage em preto e branco da década de 1940. Mantenha ${identityPreservation}. Use iluminação monocromática, dramática e de alto contraste, reminiscente da cinematografia clássica do film noir (por exemplo, iluminação Rembrandt ou borboleta). ${clothingInstruction} A pose deve ser equilibrada e confiante, olhando ligeiramente para fora da câmera. O fundo deve ser um simples cenário de estúdio escuro para focar toda a atenção no sujeito. A imagem final deve ter uma sensação atemporal, elegante e glamorosa, com um sutil efeito de grão de filme para realçar a estética vintage. Garanta detalhes ultrarrealistas e qualidade cinematográfica. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Explorador(a) Espacial",
    prompt: (_gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
        const scene = `O sujeito é um explorador espacial dentro do cockpit de uma nave espacial futurista. Há uma vista panorâmica de uma galáxia cheia de nebulosas através da janela principal. O interior do cockpit é preenchido com displays holográficos e uma iluminação ambiente azul suave refletindo no traje. O clima é de admiração, aventura e tecnologia avançada.`;

        if (hasBodyImage) {
            return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio, 'white');
        }

        const identityPreservation = "seu rosto real, penteado e estrutura/proporções corporais inalterados";
        const clothing = customClothing || 'um traje espacial branco e prateado, elegante e moderno, com detalhes azuis brilhantes';
        const clothingInstruction = `Vista o sujeito com ${clothing}.`;

        return `Edite a imagem enviada para apresentar o mesmo sujeito (mantendo ${identityPreservation}) como um explorador espacial. Coloque-os dentro do cockpit de uma nave espacial futurista, com uma vista panorâmica de uma galáxia cheia de nebulosas através da janela principal. ${clothingInstruction} O interior do cockpit deve ser preenchido com displays holográficos e uma iluminação ambiente azul suave refletindo em seu traje. O clima é de admiração, aventura e tecnologia avançada. Garanta qualidade fotorrealista e detalhes cinematográficos. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e branca no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Retrato Artístico P&B",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `A cena é um retrato artístico em preto e branco em um estúdio de moda minimalista. O sujeito está sentado em uma cadeira moderna simples, inclinado ligeiramente para a frente com as mãos entrelaçadas, com uma expressão introspectiva e confiante. A iluminação é limpa e controlada, usando luz de estúdio suave para criar sombras esculpidas e destacar a estrutura facial, texturas e detalhes do tecido. O fundo é cinza liso e plano para manter o foco no sujeito. A gradação em preto e branco de alto contraste enfatiza a elegância e a profundidade. O estilo é editorial cinematográfico — refinado, atemporal e poderoso.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }

      const subject = gender === 'masculino' ? 'man' : 'woman';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';
      const identityPreservation = "seu rosto real exato, penteado, tom de pele e estrutura/proporções corporais inalterados";
      const defaultClothing = gender === 'masculino'
        ? 'um terno escuro sob medida com linhas nítidas, combinado com sapatos pretos polidos'
        : 'um terninho escuro sob medida com linhas nítidas, combinado com saltos pretos elegantes';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `Vista ${objectPronoun} com ${clothing}.`;

      return `Edite esta imagem de um(a) ${subject} para um retrato artístico em preto e branco em um estúdio de moda minimalista, mantendo ${identityPreservation}. ${clothingInstruction} ${subjectPronoun} está sentado(a) em uma cadeira moderna simples, inclinado(a) ligeiramente para a frente com ${possessivePronoun} mãos entrelaçadas, com uma expressão introspectiva e confiante. A iluminação é limpa e controlada, usando luz de estúdio suave para criar sombras esculpidas e destacar a estrutura facial, texturas e detalhes do tecido. O fundo é cinza liso e plano para manter o foco no sujeito. A gradação em preto e branco de alto contraste enfatiza a elegância e a profundidade. Estilo editorial cinematográfico — refinado, atemporal e poderoso. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Retrato Editorial P&B (Cinza)",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `A composição é um retrato de meio corpo, com o sujeito sentado e ligeiramente inclinado para a frente. O braço direito cruza o corpo, com a mão esquerda repousando suavemente no braço oposto, transmitindo elegância e confiança. A expressão facial é serena, confiante e ligeiramente enigmática. O olhar é direcionado para a câmera, com os lábios suavemente fechados e uma postura firme. A iluminação é de estúdio, com luz direcional suave e contrastante (estilo Rembrandt ou luz lateral), destacando o contorno do rosto, criando sombras elegantes e um gradiente sutil no fundo. O fundo é liso e neutro, em tons de cinza escuro, com leve profundidade e sem elementos distrativos. O estilo final é preto e branco, com contraste refinado, textura de pele suave e uma aparência de retrato editorial realista.`;

      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }
      
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const identityPreservation = "rosto real exato, penteado, tom de pele e estrutura/proporções corporais inalterados";
      const defaultHair = gender === 'masculino' 
        ? 'bem penteado e alinhado' 
        : 'solto, liso e bem alinhado, caindo naturalmente sobre um dos ombros';
      const hairstyleInstruction = `O cabelo deve estar ${defaultHair}.`;
      const defaultClothing = gender === 'masculino'
        ? 'um sofisticado conjunto escuro — um blazer preto estruturado sobre uma camisa preta justa'
        : 'um sofisticado conjunto escuro — um blazer preto estruturado sobre um top preto justo';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `A roupa é composta por ${clothing}.`;

      return `Recrie esta cena usando a imagem enviada do(a) ${subject} como referência, mantendo ${identityPreservation}. Mantenha o mesmo enquadramento, pose, iluminação e estilo da imagem de exemplo. A composição deve mostrar um retrato de meio corpo, com o sujeito sentado e ligeiramente inclinado para a frente. O braço direito deve cruzar o corpo, com a mão esquerda repousando suavemente no braço oposto, transmitindo elegância e confiança. A expressão facial deve ser serena, confiante e ligeiramente enigmática. O olhar deve ser direcionado para a câmera, com os lábios suavemente fechados e uma postura firme. ${clothingInstruction} ${hairstyleInstruction} A iluminação deve ser de estúdio, com luz direcional suave e contrastante (estilo Rembrandt ou luz lateral), destacando o contorno do rosto, criando sombras elegantes e um gradiente sutil no fundo. O fundo deve ser liso e neutro, em tons de cinza escuro, com leve profundidade e sem elementos distrativos. O estilo final deve ser preto e branco, com contraste refinado, textura de pele suave e uma aparência de retrato editorial realista. Qualidade fotográfica de estúdio profissional, acabamento cinematográfico e realista. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Retrato de Poder (Vermelho)",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `O retrato é caracterizado por uma iluminação cinematográfica forte e contraste intenso. Capturado em um ângulo ligeiramente baixo, voltado para cima, que dramatiza a linha da mandíbula e o pescoço do sujeito, a composição evoca dominância e elegância escultural. O fundo é um vermelho carmesim profundo e saturado, criando um choque visual ousado com a pele luminosa e o guarda-roupa escuro.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio, 'white');
      }

      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const identityPreservation = "exatamente as mesmas características faciais, penteado, tom de pele e estrutura/proporções corporais";
      const defaultClothing = 'roupas escuras e elegantes';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `O sujeito veste ${clothing}.`;

      return `Crie um retrato do sujeito enviado, mantendo ${identityPreservation}. O retrato é caracterizado por uma iluminação cinematográfica forte e contraste intenso. Capturado em um ângulo ligeiramente baixo, voltado para cima, que dramatiza a linha da mandíbula e o pescoço do sujeito, a composição evoca dominância e elegância escultural. ${clothingInstruction} O fundo é um vermelho carmesim profundo e saturado, criando um choque visual ousado com a ${possessivePronoun} pele luminosa e o guarda-roupa escuro. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e branca no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Silhueta Monocromática",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `A cena é um retrato de perfil lateral monocromático. Apresenta uma iluminação de contorno dramática que destaca as bordas do cabelo and rosto. O fundo desaparece completamente na escuridão, criando um contraste suave mas poderoso que enfatiza a silhueta. O clima geral é artístico, introspectivo e cinematográfico, com um forte efeito de chiaroscuro. A imagem é em preto e branco.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }

      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const identityPreservation = "rosto real exato, penteado, tom de pele e estrutura/proporções corporais inalterados";
      const defaultClothing = 'uma camisa escura simples';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `O sujeito veste ${clothing}.`;

      return `Edite a imagem enviada para criar um retrato de perfil lateral monocromático do(a) mesmo(a) ${subject}, mantendo ${identityPreservation}. ${clothingInstruction} A foto deve apresentar uma iluminação de contorno dramática que destaca as bordas do ${possessivePronoun} cabelo e rosto. O fundo deve desaparecer completamente na escuridão, criando um contraste suave mas poderoso que enfatiza a ${possessivePronoun} silhueta. O clima geral deve ser artístico, introspectivo e cinematográfico, com um forte efeito de chiaroscuro. A imagem deve ser em preto e branco, fotorrealista e com detalhes finos nas áreas iluminadas. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Selfie no Espelho (Cinemático)",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `É uma selfie no espelho ultra-realista. O sujeito usa óculos e segura um novo e moderno smartphone iPhone 17 na cor laranja em uma mão, cobrindo parcialmente o rosto, enquanto a outra mão descansa casualmente no bolso. A cena é ambientada em uma iluminação interna quente, criando uma atmosfera cinematográfica e sombria com sombras suaves.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }

      const subject = gender === 'masculino' ? 'man' : 'woman';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const identityPreservation = "rosto real exato, penteado, tom de pele e estrutura/proporções corporais inalterados";
      const defaultClothing = 'um suéter branco solto sobre uma camiseta branca, combinado com jeans escuros';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `O sujeito está vestindo ${clothing}.`;

      return `Use a foto enviada para criar uma selfie no espelho ultra-realista de um(a) ${subject} estiloso(a) com óculos, mantendo ${identityPreservation}. ${clothingInstruction} O sujeito segura um novo e moderno smartphone iPhone 17 na cor laranja em uma mão, cobrindo parcialmente ${possessivePronoun} rosto, enquanto ${possessivePronoun} outra mão descansa casualmente no ${possessivePronoun} bolso. A cena é ambientada em uma iluminação interna quente, criando uma atmosfera cinematográfica e sombria com sombras suaves. A imagem final deve ser fotorrealista com detalhes finos. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Visionário de Marketing (Contratando)",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, marketingText?: string, aspectRatio: string = '1:1') => {
      const defaultTypography = `"ESTAMOS CONTRATANDO" com "CONTRATANDO" destacado em uma caixa azul elétrico, seguido por "profissionais de marketing digital" e "#mentes criativas procuradas" em uma fonte sans-serif contemporânea`;
      const typographyInstruction = `O lado esquerdo exibe uma tipografia atraente: ${marketingText || defaultTypography}.`;
      
      const scene = `O sujeito está em uma pose de pensamento criativo com uma mão tocando o queixo de forma pensativa, a outra mão segurando um laptop aberto na altura da cintura, em uma postura de três quartos com uma expressão visionária e entusiasmada. O fundo é branco puro que se desvanece para um gradiente verde menta suave. Elementos visuais de marketing digital flutuam ao redor: ícones de plataformas de mídia social (Instagram, LinkedIn, Facebook, TikTok) em suas cores características, gráficos minimalistas de megafone, símbolos de gráficos de análise ascendentes, ícones de engajamento como corações e bolhas de comentários, símbolos de alvo/bullseye e símbolos de arroba. Crachás de métricas coloridos mostrando números de crescimento (+2.5k, +850). Linhas de conexão e nós entre os ícones sugerem campanhas integradas. Pequenos acentos de raio e estrela em azul e verde adicionam energia criativa. ${typographyInstruction} No canto superior esquerdo, há um ícone de campanha ou estratégia. A estética geral é inovadora, orientada por dados, mas criativa, com uma energia de recrutamento profissional do LinkedIn.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }
      
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const subjectPronoun = gender === 'masculino' ? 'He\'s' : 'She\'s';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';
      const identityPreservation = "rosto real exato, penteado, tom de pele e estrutura/proporções corporais inalterados";
      const defaultClothing = gender === 'masculino' 
        ? 'um moderno blazer azul elétrico sobre uma camisa henley branca casual'
        : 'um moderno blazer azul elétrico sobre uma blusa branca casual';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `${subjectPronoun} vestindo ${clothing} para um apelo profissional criativo.`;

      return `Edite esta imagem para mostrar um(a) profissional inovador(a) ${subject} (mantendo ${identityPreservation}) em uma pose de pensamento criativo com uma mão tocando ${possessivePronoun} queixo de forma pensativa, a outra mão segurando um laptop aberto na altura da cintura, em uma postura de três quartos com uma expressão visionária e entusiasmada. ${clothingInstruction} O fundo é branco puro que se desvanece para um gradiente verde menta suave. Elementos visuais de marketing digital flutuam ao redor ${objectPronoun}: ícones de plataformas de mídia social (Instagram, LinkedIn, Facebook, TikTok) em suas cores características, gráficos minimalistas de megafone, símbolos de gráficos de análise ascendentes, ícones de engajamento como corações e bolhas de comentários, símbolos de alvo/bullseye e símbolos de arroba. Crachás de métricas coloridos mostrando números de crescimento (+2.5k, +850). Linhas de conexão e nós entre os ícones sugerem campanhas integradas. Pequenos acentos de raio e estrela em azul e verde adicionam energia criativa. ${typographyInstruction} No canto superior esquerdo, há um ícone de campanha ou estratégia. A estética geral é inovadora, orientada por dados, mas criativa, com uma energia de recrutamento profissional do LinkedIn. Renderização fotorrealista com iluminação vibrante e envolvente, estilo de agência digital e estética moderna de aquisição de talentos de marketing. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Pôster de Moda (Vermelho)",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, marketingText?: string, aspectRatio: string = '1:1') => {
      const typographyText = marketingText || 'MAKE IT HAPPEN.';
      const scene = `É um pôster de editorial de moda de estúdio. O sujeito está sentado com confiança em uma cadeira de design moderno. O fundo é um vermelho puro com uma leve textura. A composição inclui uma tipografia branca, grande e em negrito, na parte superior, que diz '${typographyText}'. A estética geral deve ser nítida, vibrante e refletir um design de alta moda.`;

      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio, 'white');
      }

      const subject = gender === 'masculino' ? 'man' : 'woman';
      const identityPreservation = "rosto real exato, penteado, tom de pele e estrutura/proporções corporais inalterados";
      const defaultClothing = 'uma roupa monocromática vermelha completa, incluindo um moletom oversized, calças de moletom e tênis';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `O sujeito está vestindo ${clothing}.`;
      
      return `Crie um pôster de editorial de moda de estúdio com o(a) jovem ${subject} enviado(a), mantendo ${identityPreservation}. O sujeito deve estar sentado com confiança em uma cadeira de design moderno. ${clothingInstruction} O fundo deve ser um vermelho puro com uma leve textura. A composição deve incluir uma tipografia branca, grande e em negrito, na parte superior, que diz '${typographyText}'. A estética geral deve ser nítida, vibrante e refletir um design de alta moda. A imagem final deve ser fotorrealista com uma qualidade de alta qualidade e polida. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e branca no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Princesa na Poltrona (Rosa)",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `O sujeito é retratado como uma criança de 2 anos sentada no centro de uma poltrona de encosto alto em um ambiente de estúdio minimalista e monocromático. O fundo é uma parede e chão contínuos em uma cor rosa queimado sólida. A poltrona também combina com essa cor para criar um efeito monocromático contínuo. Os sapatos são limpos e brancos. Os pés não tocam o chão devido à altura da poltrona, com as mãos suavemente entrelaçadas no colo. A iluminação é suave, uniforme e de estúdio, com sombras mínimas. A imagem final deve ser de altíssima resolução, elegante, moderna e minimalista, no estilo da fotografia de retrato de alta moda.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio, 'white');
      }

      const subject = gender === 'masculino' ? 'boy' : 'girl';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const identityPreservation = "características faciais e tom de pele exatos, mas reimaginando-os como uma criança de 2 anos, preservando a essência de sua estrutura corporal na versão infantil";
      const defaultClothing = gender === 'masculino' 
        ? 'um terno branco elegante com detalhes sutis de joias e uma pequena e elegante coroa' 
        : 'um vestido de dama de honra branco com flores e joias e uma coroa combinando';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `Vista o sujeito com ${clothing}.`;

      return `Converta a imagem enviada, mantendo ${identityPreservation} do sujeito. O sujeito deve ser retratado como um(a) ${subject} de 2 anos sentado(a) no centro de uma poltrona de encosto alto em um ambiente de estúdio minimalista e monocromático. Substitua o fundo atual por uma parede e chão contínuos em uma cor rosa queimado sólida. A poltrona também deve combinar com essa cor para criar um efeito monocromático contínuo. ${clothingInstruction} Os sapatos do sujeito devem ser limpos e brancos. Posicione-os de forma que ${possessivePronoun} pés não toquem o chão devido à altura da poltrona, com ${possessivePronoun} mãos suavemente entrelaçadas no ${possessivePronoun} colo. A iluminação deve ser suave, uniforme e de estúdio, com sombras mínimas. A imagem final deve ser de altíssima resolução, elegante, moderna e minimalista, no estilo da fotografia de retrato de alta moda. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e branca no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  },
  {
    title: "Horror Cinematográfico (IT)",
    prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const scene = `É uma cena de filme de terror cinematográfico de Halloween. O sujeito está em pé no escuro, segurando um isqueiro perto do rosto. A chama do isqueiro lança um brilho quente e bruxuleante em sua expressão tensa. Atrás do sujeito, Pennywise, o Palhaço Dançarino do filme 'IT', assoma, seu rosto aterrorizante também iluminado pela mesma chama, sorrindo ameaçadoramente por cima do ombro do sujeito. A atmosfera é tensa e cinematográfica. A iluminação é um forte contraste de azul e laranja, com uma profundidade de campo rasa.`;
      
      if (hasBodyImage) {
        return COMPOSITION_PROMPT_TEMPLATE(scene, aspectRatio);
      }
      
      const identityPreservation = "rosto real exato, expressão e estrutura/proporções corporais completamente inalterados";
      const defaultClothing = 'roupas escuras e casuais adequadas para uma cena escura';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = `Vista o sujeito com ${clothing}.`;

      return `Edite a imagem enviada para criar uma cena de filme de terror cinematográfico de Halloween. O sujeito (mantendo ${identityPreservation}) está em pé no escuro, segurando um isqueiro perto do rosto. A chama do isqueiro lança um brilho quente e bruxuleante em sua expressão tensa. Atrás do sujeito, Pennywise, o Palhaço Dançarino do filme 'IT', assoma, seu rosto aterrorizante também iluminado pela mesma chama, sorrindo ameaçadoramente por cima do ombro do sujeito. A atmosfera é tensa e cinematográfica. A iluminação é um forte contraste de azul e laranja. A imagem final deve ser ultrarrealista, com textura de pele detalhada, resolução 4K e uma profundidade de campo rasa. ${clothingInstruction} Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
    }
  }
];