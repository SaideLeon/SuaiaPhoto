import type { PromptTemplate, Gender } from './types';

export const DEFAULT_IMAGE_URL = "data:image/webp;base64,UklGRqACAABXRUJQVlA4IIQCAABwHwCdASoZABkAPm0ylUekIqI8pqAAMAbEtLEwA/bi6if8r/yP9t/Yv+L/k/9r9gH8v/s/+l/yP+R/cP+L/n/9b/rv+J/y/+h/03/E/6H/Zf4L/yf9l/tP+Z/3//3/5n7AP5Z/UP+d/x/+L/03/Z/4//B/2f9//9P///9r8AP7f/pv+r/tP+l/1n/d/93///9n8AP/iWIAAAAAAAT8N8/r9Xv3T/Bf7/+v9f/0/5P+f/Lf6r/pf0D/J/mf7L9y/xv+d/q//T/tP8Z+9f8f/pf9F/fP+L/lf7//zf/H/z/9z/33/D/9/+p/////+gD//6sAAAACUN1/8hAAAAAAB4AAD++8gD+f38b+b9AAAARt4AAP7+WAD+/bgAAP7+WAD+/bgAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP7//lQAAAAA";

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    title: "Pessoa Moderna na Poltrona",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean) => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';
      const defaultClothing = gender === 'masculino'
        ? 'a dark navy blue dress shirt with the top buttons open, light beige slim-fit pants, and black loafers with tan soles'
        : 'a stylish dark navy blue silk blouse, light beige slim-fit trousers, and elegant black heels';
      const clothing = customClothing || defaultClothing;
      
      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : `Dress ${objectPronoun} in ${clothing}.`;

      return `Edit the uploaded image to depict the same subject as a ${subject} (keeping the *exact real face, hairstyle, skin tone, and body identity unchanged*), placing ${objectPronoun} in a modern beige armchair with wooden legs. ${subjectPronoun} is sitting confidently, leaning slightly forward with ${possessivePronoun} hands together. ${clothingInstruction} The background should be minimalist light gray with a smooth gradient, evenly lit with soft natural studio lighting. The mood is cinematic and fashion editorial, with high realism and fine details. Shot with a 50mm lens at f/2.8, vertical framing, full-body composition.`;
    }
  },
  {
    title: "Retrato Editorial com Óculos",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean) => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';
      const H_is = possessivePronoun.charAt(0).toUpperCase() + possessivePronoun.slice(1);
      const defaultClothing = 'a luxurious black silk blazer with peak lapels and a slightly open neckline, complemented by a minimal gold chain necklace and small gold huggie earrings';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : ` ${subjectPronoun} wears ${clothing}.`;

      return `Edit the uploaded image to show the same subject as a ${subject} (keeping ${possessivePronoun} real face, hairstyle, skin tone, and identity unchanged) positioned in a close-up portrait shot. ${H_is} face should be tilted slightly upward at approximately 15–20 degrees with ${possessivePronoun} chin gently lifted, creating a confident, aspirational angle. ${H_is} head is centered in the frame, gaze directed straight toward the camera. ${H_is} hair is neatly styled, maintaining natural texture and volume, with subtle light reflections for depth. ${subjectPronoun} is wearing modern, vintage-inspired sunglasses with molten amber-to-gold gradient lenses and lustrous golden frames with fine etched details, positioned perfectly on the bridge of ${possessivePronoun} nose. ${H_is} body is angled slightly (about 30 degrees) to add dimension, with relaxed shoulders and one shoulder subtly closer to the camera. ${H_is} expression should convey calm confidence, with a slight, composed smirk.${clothingInstruction} The background is a rich, saturated golden-yellow that transitions to deeper amber tones at the edges. Dramatic directional lighting from above-left sculpts ${possessivePronoun} face and neck with warm highlights and soft shadows, while subtle backlighting creates a halo effect around ${possessivePronoun} hair. The composition should reflect a fashion/editorial beauty portrait style, with the face occupying about 60% of the frame. Maintain high realism, cinematic lighting, and fine details.`;
    }
  },
  {
    title: "Iluminação Neon (Azul e Vermelho)",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean) => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';
      const H_is = possessivePronoun.charAt(0).toUpperCase() + possessivePronoun.slice(1);
      const defaultClothing = 'a dark t-shirt and a watch on his left wrist';
      const clothing = customClothing || defaultClothing;
      
      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : `${subjectPronoun} is wearing ${clothing}.`;

      return `Edit the uploaded image to depict the same ${subject} (keeping ${possessivePronoun} real face, expression, hairstyle, skin tone, and identity completely unchanged) in a striking portrait illuminated by dramatic dual-colored lighting. ${H_is} face should be split evenly — one side bathed in a cool blue light, and the other in a vibrant pink/red hue, producing a high-contrast, neon-like visual effect. ${subjectPronoun} should be gazing directly at the viewer with a thoughtful, pensive expression, ${possessivePronoun} left hand resting on ${possessivePronoun} chin. ${clothingInstruction} The background must remain dark and indistinct, subtly fading into shadow to emphasize the colorful illumination on ${possessivePronoun} face and upper body. Maintain photorealism, preserving every real facial and anatomical detail of the original subject while only modifying the lighting, color grading, and atmosphere to achieve a cinematic and artistic look.`;
    }
  },
  {
    title: "Editorial Corporativo Moderno",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean) => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const footwear = gender === 'masculino' ? 'black leather dress shoes' : 'elegant black leather heels';
      const defaultOutfit = gender === 'masculino' ? 'a structured blazer over the shoulders, slim-fit tailored trousers, and a black shirt underneath' : 'a structured black blazer, slim-fit tailored trousers, and a black silk blouse underneath';
      const outfit = customClothing || defaultOutfit;

      const clothingInstruction = hasClothingImage
        ? `The outfit should be the one from the second uploaded image, adapted to the subject's body. Do not copy the body or face from the second image, only the clothing.`
        : `The outfit should be: ${outfit}, conveying strength, professionalism, and contemporary style.`;

      return `Recreate this scene using the uploaded image of the ${subject} as the base, keeping their real face, hairstyle, skin tone, and identity completely unchanged. Maintain the same framing, pose, lighting, and atmosphere. The composition should show the person sitting on a tall wooden stool with a black metal frame, in a minimalist studio setting with a neutral gray background. The shot should capture the full body, from a slight distance, emphasizing posture and the clean, elegant environment. Their right leg should be bent and resting on the stool’s footrest, while the left leg touches the floor naturally. Replace any existing footwear with ${footwear} featuring subtle modern details. ${clothingInstruction} Their hair should appear neatly styled, with natural texture and clean lines. Their facial expression should remain confident and serene, with their gaze directed slightly to the side, projecting authority and calm focus. Lighting should be soft and directional studio light, creating a balanced contrast between illuminated and shaded areas, enhancing the fabric texture and facial contours. The background must stay smooth, with a subtle gray gradient, free of distractions, keeping full attention on the subject. The overall style should be modern corporate editorial, with a photorealistic, cinematic, and premium finish, suitable for a professional magazine portrait. Vertical format (1080x1920), portrait orientation, high photographic quality, sophisticated tone, and studio lighting precision.`;
    }
  },
  {
    title: "Retrato Glamouroso de Estúdio",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean) => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';
      const defaultClothing = 'a black satin or fine-textured shirt or blazer';
      const clothing = customClothing || defaultClothing;
      
      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : `Dress ${objectPronoun} in ${clothing}, conveying elegance and sophistication.`;

      return `Edit the uploaded image to create a professional, glamorous studio portrait of the same ${subject}, keeping their real face, hairstyle, skin tone, and identity completely unchanged. Style the scene with soft, directional clamshell lighting, producing a subtle chiaroscuro gradient that enhances the facial contours, highlights, and texture of the skin. ${clothingInstruction} Their pose should be refined and introspective, with their right hand gently resting under their chin, expressing thoughtfulness and confidence. Maintain a solid black background, emphasizing the lighting contrast and cinematic atmosphere. The overall look should reflect high-fashion editorial portraiture, with ultra-realistic detail, premium photographic quality, and a cinematic, modern aesthetic.`;
    }
  },
  {
    title: "Paisagem Urbana Cyberpunk",
    prompt: (_gender: Gender, customClothing?: string, hasClothingImage?: boolean) => {
        const clothing = customClothing || 'a stylish dark leather jacket over a tech-wear outfit';
        const clothingInstruction = hasClothingImage
          ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
          : `Dress the subject in ${clothing}.`;

        return `Transform the uploaded image, maintaining the subject's exact real face, hairstyle, and identity. Place them in a gritty, neon-drenched Cyberpunk cityscape at night. The background should feature towering futuristic skyscrapers, holographic advertisements, and rain-slicked streets reflecting the vibrant cyan and magenta lights. ${clothingInstruction} The lighting should be dramatic and high-contrast, with strong neon glows casting colored light onto the subject. The atmosphere is cinematic, moody, and futuristic. Ensure photorealistic quality with fine details in the environment and clothing.`;
    }
  },
  {
    title: "Retrato Vintage de Hollywood",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean) => {
        const defaultClothing = gender === 'masculino' ? 'a sophisticated dark tuxedo with a bow tie' : 'an elegant evening gown';
        const clothing = customClothing || defaultClothing;
        const clothingInstruction = hasClothingImage
          ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
          : `Dress the subject in ${clothing}.`;

        return `Recreate the uploaded image as a classic, black and white Vintage Hollywood portrait from the 1940s. Keep the subject's real face, expression, and identity completely unchanged. Use dramatic, high-contrast monochrome lighting, reminiscent of classic film noir cinematography (e.g., Rembrandt or butterfly lighting). ${clothingInstruction} The pose should be poised and confident, looking slightly off-camera. The background should be a simple, dark studio backdrop to focus all attention on the subject. The final image should have a timeless, elegant, and glamorous feel, with a subtle film grain effect to enhance the vintage aesthetic. Ensure ultra-realistic detail and a cinematic quality.`;
    }
  },
  {
    title: "Explorador(a) Espacial",
    prompt: (_gender: Gender, customClothing?: string, hasClothingImage?: boolean) => {
        const clothing = customClothing || 'a sleek, modern white and silver spacesuit with glowing blue accents';
        const clothingInstruction = hasClothingImage
          ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
          : `Dress the subject in ${clothing}.`;

        return `Edit the uploaded image to feature the same subject (keeping their real face, hairstyle, and identity unchanged) as a space explorer. Place them inside the cockpit of a futuristic spaceship, with a panoramic view of a nebula-filled galaxy through the main viewport. ${clothingInstruction} The interior of the cockpit should be filled with holographic displays and soft, ambient blue lighting reflecting off their helmet and suit. The mood is one of wonder, adventure, and advanced technology. Ensure photorealistic quality and cinematic detail.`;
    }
  }
];
