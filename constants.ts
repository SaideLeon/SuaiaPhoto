import type { PromptTemplate, Gender } from './types';

export const DEFAULT_IMAGE_URL = "data:image/webp;base64,UklGRqACAABXRUJQVlA4IIQCAABwHwCdASoZABkAPm0ylUekIqI8pqAAMAbEtLEwA/bi6if8r/yP9t/Yv+L/k/9r9gH8v/s/+l/yP+R/cP+L/n/9b/rv+J/y/+h/03/E/6H/Zf4L/yf9l/tP+Z/3//3/5n7AP5Z/UP+d/x/+L/03/Z/4//B/2f9//9P///9r8AP7f/pv+r/tP+l/1n/d/93///9n8AP/iWIAAAAAAAT8N8/r9Xv3T/Bf7/+v9f/0/5P+f/Lf6r/pf0D/J/mf7L9y/xv+d/q//T/tP8Z+9f8f/pf9F/fP+L/lf7//zf/H/z/9z/33/D/9/+p/////+gD//6sAAAACUN1/8hAAAAAAB4AAD++8gD+f38b+b9AAAARt4AAP7+WAD+/bgAAP7+WAD+/bgAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+/cwAAP79zAAA/v3MAAD+//lQAAAAA";

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    title: "Pessoa Moderna na Poltrona",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';

      let identityPreservation = "exact real face, hairstyle, skin tone, and body identity unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "exact real face, skin tone, and body identity unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image. Adapt the new hairstyle to the subject's head and face shape, but do not copy the face or body from the reference image.`;
      }
      
      const defaultClothing = gender === 'masculino'
        ? 'a dark navy blue dress shirt with the top buttons open, light beige slim-fit pants, and black loafers with tan soles'
        : 'a stylish dark navy blue silk blouse, light beige slim-fit trousers, and elegant black heels';
      const clothing = customClothing || defaultClothing;
      
      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : `Dress ${objectPronoun} in ${clothing}.`;

      return `Edit the uploaded image to depict the same subject as a ${subject} (keeping the ${identityPreservation}), placing ${objectPronoun} in a modern beige armchair with wooden legs. ${subjectPronoun} is sitting confidently, leaning slightly forward with ${possessivePronoun} hands together. ${clothingInstruction} ${hairstyleInstruction} The background should be minimalist light gray with a smooth gradient, evenly lit with soft natural studio lighting. The mood is cinematic and fashion editorial, with high realism and fine details. Shot with a 50mm lens at f/2.8, full-body composition. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Retrato Editorial com Óculos",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';
      const H_is = possessivePronoun.charAt(0).toUpperCase() + possessivePronoun.slice(1);

      let identityPreservation = "real face, hairstyle, skin tone, and identity unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "real face, skin tone, and identity unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `The subject's hairstyle should be replaced with the one from the ${imageRef} uploaded image, adapted to their head, but keeping their face.`;
      }
      
      const defaultClothing = 'a luxurious black silk blazer with peak lapels and a slightly open neckline, complemented by a minimal gold chain necklace and small gold huggie earrings';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : ` ${subjectPronoun} wears ${clothing}.`;

      return `Edit the uploaded image to show the same subject as a ${subject} (keeping ${possessivePronoun} ${identityPreservation}) positioned in a close-up portrait shot. ${H_is} face should be tilted slightly upward at approximately 15–20 degrees with ${possessivePronoun} chin gently lifted, creating a confident, aspirational angle. ${H_is} head is centered in the frame, gaze directed straight toward the camera. ${hairstyleInstruction} ${subjectPronoun} is wearing modern, vintage-inspired sunglasses with molten amber-to-gold gradient lenses and lustrous golden frames with fine etched details, positioned perfectly on the bridge of ${possessivePronoun} nose. ${H_is} body is angled slightly (about 30 degrees) to add dimension, with relaxed shoulders and one shoulder subtly closer to the camera. ${H_is} expression should convey calm confidence, with a slight, composed smirk.${clothingInstruction} The background is a rich, saturated golden-yellow that transitions to deeper amber tones at the edges. Dramatic directional lighting from above-left sculpts ${possessivePronoun} face and neck with warm highlights and soft shadows, while subtle backlighting creates a halo effect around ${possessivePronoun} hair. The composition should reflect a fashion/editorial beauty portrait style, with the face occupying about 60% of the frame. Maintain high realism, cinematic lighting, and fine details. Add the minimalist brand text 'LuxiaEstudio' in a clean, white sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Iluminação Neon (Azul e Vermelho)",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';
      const H_is = possessivePronoun.charAt(0).toUpperCase() + possessivePronoun.slice(1);

      let identityPreservation = "real face, expression, hairstyle, skin tone, and identity completely unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "real face, expression, skin tone, and identity completely unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image, adapting it to their head. Do not copy the face from the reference image.`;
      }

      const defaultClothing = 'a dark t-shirt and a watch on his left wrist';
      const clothing = customClothing || defaultClothing;
      
      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : `${subjectPronoun} is wearing ${clothing}.`;

      return `Edit the uploaded image to depict the same ${subject} (keeping ${possessivePronoun} ${identityPreservation}) in a striking portrait illuminated by dramatic dual-colored lighting. ${H_is} face should be split evenly — one side bathed in a cool blue light, and the other in a vibrant pink/red hue, producing a high-contrast, neon-like visual effect. ${subjectPronoun} should be gazing directly at the viewer with a thoughtful, pensive expression, ${possessivePronoun} left hand resting on ${possessivePronoun} chin. ${hairstyleInstruction} ${clothingInstruction} The background must remain dark and indistinct, subtly fading into shadow to emphasize the colorful illumination on ${possessivePronoun} face and upper body. Maintain photorealism, preserving every real facial and anatomical detail of the original subject while only modifying the lighting, color grading, and atmosphere to achieve a cinematic and artistic look. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Editorial Corporativo Moderno",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      
      let identityPreservation = "real face, hairstyle, skin tone, and identity completely unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "real face, skin tone, and identity completely unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `The subject's hair should appear neatly styled, matching the hairstyle from the ${imageRef} uploaded image.`;
      } else {
        hairstyleInstruction = "Their hair should appear neatly styled, with natural texture and clean lines.";
      }

      const footwear = gender === 'masculino' ? 'black leather dress shoes' : 'elegant black leather heels';
      const defaultOutfit = gender === 'masculino' ? 'a structured blazer over the shoulders, slim-fit tailored trousers, and a black shirt underneath' : 'a structured black blazer, slim-fit tailored trousers, and a black silk blouse underneath';
      const outfit = customClothing || defaultOutfit;

      const clothingInstruction = hasClothingImage
        ? `The outfit should be the one from the second uploaded image, adapted to the subject's body. Do not copy the body or face from the second image, only the clothing.`
        : `The outfit should be: ${outfit}, conveying strength, professionalism, and contemporary style.`;

      return `Recreate this scene using the uploaded image of the ${subject} as the base, keeping their ${identityPreservation}. Maintain the same framing, pose, lighting, and atmosphere. The composition should show the person sitting on a tall wooden stool with a black metal frame, in a minimalist studio setting with a neutral gray background. The shot should capture the full body, from a slight distance, emphasizing posture and the clean, elegant environment. Their right leg should be bent and resting on the stool’s footrest, while the left leg touches the floor naturally. Replace any existing footwear with ${footwear} featuring subtle modern details. ${clothingInstruction} ${hairstyleInstruction} Their facial expression should remain confident and serene, with their gaze directed slightly to the side, projecting authority and calm focus. Lighting should be soft and directional studio light, creating a balanced contrast between illuminated and shaded areas, enhancing the fabric texture and facial contours. The background must stay smooth, with a subtle gray gradient, free of distractions, keeping full attention on the subject. The overall style should be modern corporate editorial, with a photorealistic, cinematic, and premium finish, suitable for a professional magazine portrait. High photographic quality, sophisticated tone, and studio lighting precision. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Retrato Glamouroso de Estúdio",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';

      let identityPreservation = "real face, hairstyle, skin tone, and identity completely unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "real face, skin tone, and identity completely unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image.`;
      }

      const defaultClothing = 'a black satin or fine-textured shirt or blazer';
      const clothing = customClothing || defaultClothing;
      
      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : `Dress ${objectPronoun} in ${clothing}, conveying elegance and sophistication.`;

      return `Edit the uploaded image to create a professional, glamorous studio portrait of the same ${subject}, keeping their ${identityPreservation}. ${hairstyleInstruction} Style the scene with soft, directional clamshell lighting, producing a subtle chiaroscuro gradient that enhances the facial contours, highlights, and texture of the skin. ${clothingInstruction} Their pose should be refined and introspective, with their right hand gently resting under their chin, expressing thoughtfulness and confidence. Maintain a solid black background, emphasizing the lighting contrast and cinematic atmosphere. The overall look should reflect high-fashion editorial portraiture, with ultra-realistic detail, premium photographic quality, and a cinematic, modern aesthetic. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Paisagem Urbana Cyberpunk",
    prompt: (_gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
        
        let identityPreservation = "subject's exact real face, hairstyle, and identity";
        let hairstyleInstruction = '';
        if (hasHairstyleImage) {
            identityPreservation = "subject's exact real face and identity";
            const imageRef = hasClothingImage ? 'third' : 'second';
            hairstyleInstruction = `The subject's hairstyle should be replaced with the one from the ${imageRef} uploaded image.`;
        }
        
        const clothing = customClothing || 'a stylish dark leather jacket over a tech-wear outfit';
        const clothingInstruction = hasClothingImage
          ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
          : `Dress the subject in ${clothing}.`;

        return `Transform the uploaded image, maintaining the ${identityPreservation}. Place them in a gritty, neon-drenched Cyberpunk cityscape at night. The background should feature towering futuristic skyscrapers, holographic advertisements, and rain-slicked streets reflecting the vibrant cyan and magenta lights. ${hairstyleInstruction} ${clothingInstruction} The lighting should be dramatic and high-contrast, with strong neon glows casting colored light onto the subject. The atmosphere is cinematic, moody, and futuristic. Ensure photorealistic quality with fine details in the environment and clothing. Add the minimalist brand text 'LuxiaEstudio' in a clean, white sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Retrato Vintage de Hollywood",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {

        let identityPreservation = "subject's real face, expression, and identity completely unchanged";
        let hairstyleInstruction = '';
        if (hasHairstyleImage) {
            identityPreservation = "subject's real face, expression, and identity completely unchanged, but replace their hairstyle";
            const imageRef = hasClothingImage ? 'third' : 'second';
            hairstyleInstruction = `The new hairstyle should match the one from the ${imageRef} uploaded image, adapted for a vintage look.`;
        }
        
        const defaultClothing = gender === 'masculino' ? 'a sophisticated dark tuxedo with a bow tie' : 'an elegant evening gown';
        const clothing = customClothing || defaultClothing;
        const clothingInstruction = hasClothingImage
          ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
          : `Dress the subject in ${clothing}.`;

        return `Recreate the uploaded image as a classic, black and white Vintage Hollywood portrait from the 1940s. Keep the ${identityPreservation}. ${hairstyleInstruction} Use dramatic, high-contrast monochrome lighting, reminiscent of classic film noir cinematography (e.g., Rembrandt or butterfly lighting). ${clothingInstruction} The pose should be poised and confident, looking slightly off-camera. The background should be a simple, dark studio backdrop to focus all attention on the subject. The final image should have a timeless, elegant, and glamorous feel, with a subtle film grain effect to enhance the vintage aesthetic. Ensure ultra-realistic detail and a cinematic quality. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Explorador(a) Espacial",
    prompt: (_gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {

        let identityPreservation = "their real face, hairstyle, and identity unchanged";
        let hairstyleInstruction = '';
        if (hasHairstyleImage) {
            identityPreservation = "their real face and identity unchanged";
            const imageRef = hasClothingImage ? 'third' : 'second';
            hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image, visible inside a transparent helmet visor.`;
        }
        
        const clothing = customClothing || 'a sleek, modern white and silver spacesuit with glowing blue accents';
        const clothingInstruction = hasClothingImage
          ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
          : `Dress the subject in ${clothing}.`;

        return `Edit the uploaded image to feature the same subject (keeping ${identityPreservation}) as a space explorer. Place them inside the cockpit of a futuristic spaceship, with a panoramic view of a nebula-filled galaxy through the main viewport. ${clothingInstruction} ${hairstyleInstruction} The interior of the cockpit should be filled with holographic displays and soft, ambient blue lighting reflecting off their suit. The mood is one of wonder, adventure, and advanced technology. Ensure photorealistic quality and cinematic detail. Add the minimalist brand text 'LuxiaEstudio' in a clean, white sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Retrato Artístico P&B",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subjectPronoun = gender === 'masculino' ? 'He' : 'She';

      let identityPreservation = "their exact real face, hairstyle, skin tone, and identity unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "their exact real face, skin tone, and identity unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image.`;
      }

      const defaultClothing = gender === 'masculino'
        ? 'a tailored dark suit with sharp lines, paired with polished black shoes'
        : 'a tailored dark pantsuit with sharp lines, paired with elegant black heels';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : `Dress ${objectPronoun} in ${clothing}.`;

      return `Edit this image of a ${subject} into a black and white artistic portrait in a minimalist fashion studio, keeping ${identityPreservation}. ${clothingInstruction} ${hairstyleInstruction} ${subjectPronoun} sits on a simple modern chair, leaning slightly forward with ${possessivePronoun} hands clasped, giving an introspective and confident expression. Lighting is clean and controlled, using soft studio light to create sculpted shadows and highlight facial structure, textures, and fabric details. The background is plain, smooth gray to keep the focus on the subject. High contrast black and white grading emphasizes elegance and depth. Cinematic editorial style — refined, timeless, and powerful. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Retrato Editorial P&B (Cinza)",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      
      let identityPreservation = "exact real face, hairstyle, skin tone, and body identity unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "exact real face, skin tone, and body identity unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `The subject's hairstyle should be replaced with the one from the ${imageRef} uploaded image, adapted for the lighting.`;
      } else {
        const defaultHair = gender === 'masculino' 
          ? 'neatly styled and well-aligned' 
          : 'loose, straight, and well-aligned, falling naturally over one of the shoulders';
        hairstyleInstruction = `The hair should be ${defaultHair}.`;
      }

      const defaultClothing = gender === 'masculino'
        ? 'a sophisticated dark set — a structured black blazer over a tight black shirt'
        : 'a sophisticated dark set — a structured black blazer over a tight black top';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `The outfit should be the one from the second uploaded image, adapted to the subject's body. Do not copy the body or face from the second image, only the clothing.`
        : `The outfit is composed of ${clothing}.`;

      return `Recreate this scene using the uploaded image of the ${subject} as a reference, keeping their ${identityPreservation}. Maintain the same framing, pose, lighting, and style of the example image. The composition should show a half-body portrait, with the subject seated and slightly leaning forward. The right arm should cross the body, with the left hand resting gently on the opposite arm, conveying elegance and confidence. The facial expression should be serene, confident, and slightly enigmatic. The gaze should be directed at the camera, with the lips gently closed and a firm posture. ${clothingInstruction} ${hairstyleInstruction} The lighting should be studio-style, with soft, contrasting directional light (Rembrandt or side light style), highlighting the contour of the face, creating elegant shadows, and a subtle gradient in the background. The background should be smooth and neutral, in shades of dark gray, with slight depth and no distracting elements. The final style should be black and white, with refined contrast, soft skin texture, and a realistic editorial portrait appearance. Professional studio photographic quality, cinematic and realistic finish. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Retrato de Poder (Vermelho)",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';

      let identityPreservation = "exact same face features, hairstyle, and skin tone";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "exact same face features and skin tone";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `The subject's hairstyle should be replaced with the one from the ${imageRef} uploaded image, adapted to the dramatic lighting and angle.`;
      }

      const defaultClothing = 'dark, elegant clothing';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `The subject wears the outfit shown in the second uploaded image, adapted to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : `The subject wears ${clothing}.`;

      return `Create a portrait shot of the uploaded subject, keeping the ${identityPreservation}. The portrait is characterized by stark cinematic lighting and intense contrast. Captured in a slightly low, upward-facing angle that dramatizes the subject’s jawline and neck, the composition evokes dominance and sculptural elegance. ${hairstyleInstruction} ${clothingInstruction} The background is a deep, saturated crimson red, creating a bold visual clash with the ${possessivePronoun} luminous skin and dark wardrobe. Add the minimalist brand text 'LuxiaEstudio' in a clean, white sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Silhueta Monocromática",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const subject = gender === 'masculino' ? 'man' : 'woman';

      let identityPreservation = "exact real face, hairstyle, skin tone, and body identity unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "exact real face, skin tone, and body identity unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image, adapting it to the side-profile and lighting.`;
      }
      
      const defaultClothing = 'a simple dark shirt';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape and the lighting.`
        : `The subject wears ${clothing}.`;

      return `Edit the uploaded image to create a monochrome side-profile portrait of the same ${subject}, keeping their ${identityPreservation}. ${hairstyleInstruction} ${clothingInstruction} The shot should feature dramatic rim lighting that highlights the edges of ${possessivePronoun} hair and face. The background should fade completely into darkness, creating a soft but powerful contrast that emphasizes ${possessivePronoun} silhouette. The overall mood should be artistic, introspective, and cinematic, with a strong chiaroscuro effect. The image must be black and white, photorealistic, and with fine details in the illuminated areas. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Selfie no Espelho (Cinemático)",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      
      let identityPreservation = "exact real face, hairstyle, skin tone, and body identity unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "exact real face, skin tone, and body identity unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image, ensuring it looks natural in the mirror reflection.`;
      }

      const defaultClothing = 'a loose white sweater layered over a crisp white T-shirt, paired with dark blue denim jeans';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `The subject is wearing the outfit from the second uploaded image, adapted to their body shape.`
        : `The subject is wearing ${clothing}.`;

      return `Use the uploaded photo to create an ultra-realistic mirror selfie of a stylish ${subject} with glasses, keeping their ${identityPreservation}. ${hairstyleInstruction} ${clothingInstruction} The subject holds a new modern iPhone 17 smartphone in an orange color in one hand, partially covering ${possessivePronoun} face, while ${possessivePronoun} other hand rests casually in ${possessivePronoun} pocket. The scene is set in warm indoor lighting, creating a cinematic, moody atmosphere with soft shadows. The final image should be photorealistic with fine details. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Visionário de Marketing (Contratando)",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';
      const subjectPronoun = gender === 'masculino' ? 'He\'s' : 'She\'s';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';
      const objectPronoun = gender === 'masculino' ? 'him' : 'her';

      let identityPreservation = "exact real face, hairstyle, skin tone, and body identity unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "exact real face, skin tone, and body identity unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image.`;
      }
      
      const defaultClothing = gender === 'masculino' 
        ? 'a modern electric blue blazer over a casual white henley shirt'
        : 'a modern electric blue blazer over a casual white blouse';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape. Do not copy the body or face from the second image, only the clothing.`
        : `${subjectPronoun} wearing ${clothing} for creative professional appeal.`;
        
      const defaultTypography = `"WE'RE HIRING" with "HIRING" highlighted in an electric blue box, followed by "digital marketers" and "#creative minds wanted" in a contemporary sans-serif font`;
      const typographyInstruction = `The left side displays compelling typography: ${marketingText || defaultTypography}.`;

      return `Edit this image to show an innovative professional ${subject} (keeping ${identityPreservation}) in a creative thinking pose with one hand touching ${possessivePronoun} chin thoughtfully, other hand holding a laptop open at waist level, standing in a three-quarter stance with an enthusiastic visionary expression. ${clothingInstruction} ${hairstyleInstruction} The background is pristine white fading to a soft mint green gradient. Digital marketing visual elements float around ${objectPronoun}: social media platform icons (Instagram, LinkedIn, Facebook, TikTok logos) in their signature colors, minimalist megaphone graphics, ascending analytics chart symbols, engagement icons like hearts and comment bubbles, target/bullseye symbols, and at-sign symbols. Colorful metric badges showing growth numbers (+2.5k, +850). Connecting lines and nodes between icons suggest integrated campaigns. Small lightning bolt and star accents in blue and green add creative energy. ${typographyInstruction} Top left features a campaign or strategy icon. The overall aesthetic is innovative, data-driven yet creative, with LinkedIn professional recruitment energy. Photorealistic rendering with vibrant engaging lighting, digital agency style, and modern marketing talent acquisition aesthetic. Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Pôster de Moda (Vermelho)",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'man' : 'woman';

      let identityPreservation = "exact real face, hairstyle, skin tone, and body identity unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "exact real face, skin tone, and body identity unchanged";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image.`;
      }
      
      const defaultClothing = 'a full monochrome red outfit, including an oversized hoodie, joggers, and sneakers';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape.`
        : `The subject is wearing ${clothing}.`;

      const typographyText = marketingText || 'MAKE IT HAPPEN.';

      return `Create a studio fashion editorial poster featuring the uploaded young ${subject}, keeping their ${identityPreservation}. The subject should be sitting confidently on a modern designer chair. ${hairstyleInstruction} ${clothingInstruction} The background should be a pure red with a slight texture. The composition must include oversized, bold white typography across the top that spells ‘${typographyText}’. The overall aesthetic must be sharp, vibrant, and reflect a high-fashion design. The final image should be photorealistic with a high-end, polished quality. Add the minimalist brand text 'LuxiaEstudio' in a clean, white sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Princesa na Poltrona (Rosa)",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      const subject = gender === 'masculino' ? 'boy' : 'girl';
      const possessivePronoun = gender === 'masculino' ? 'his' : 'her';

      let identityPreservation = "exact real face features and skin tone, but reimagining them as a 2-year-old";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "exact real face features and skin tone, but reimagining them as a 2-year-old";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `Replace the subject's hairstyle with the one from the ${imageRef} uploaded image, adapting it for a young child.`;
      }

      const defaultClothing = gender === 'masculino' 
        ? 'a smart white suit with subtle jewel accents and a small, elegant crown' 
        : 'a white bejeweled flower girl dress and a matching crown';
      const clothing = customClothing || defaultClothing;

      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their young child's body shape.`
        : `Dress the subject in ${clothing}.`;

      return `Convert the uploaded image, keeping the subject's ${identityPreservation}. The subject should be depicted as a 2-year-old ${subject} sitting in the center of a high-back armchair in a minimalist, monochromatic studio environment. Replace the current background with a seamless wall and floor in a solid, burnt rose pink color. The armchair should also match this color to create a seamless monochromatic effect. ${hairstyleInstruction} ${clothingInstruction} The subject's shoes should be clean and white. Position them so ${possessivePronoun} feet are not touching the floor due to the height of the armchair, with ${possessivePronoun} hands gently clasped in ${possessivePronoun} lap. The lighting should be soft, even, and studio-style, with minimal shadows. The final image must be ultra-high resolution, elegant, modern, and minimalist, in the style of high-fashion portrait photography. Add the minimalist brand text 'LuxiaEstudio' in a clean, white sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  },
  {
    title: "Horror Cinematográfico (IT)",
    prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, _marketingText?: string, aspectRatio: string = '1:1') => {
      
      let identityPreservation = "exact real face, expression, and identity completely unchanged";
      let hairstyleInstruction = '';
      if (hasHairstyleImage) {
        identityPreservation = "exact real face, expression, and identity completely unchanged, but replace their hairstyle";
        const imageRef = hasClothingImage ? 'third' : 'second';
        hairstyleInstruction = `The new hairstyle should match the one from the ${imageRef} uploaded image, adapted for the lighting and scene.`;
      }
      
      const defaultClothing = 'dark, casual clothing suitable for a dark scene';
      const clothing = customClothing || defaultClothing;
      const clothingInstruction = hasClothingImage
        ? `Dress the subject in the outfit shown in the second uploaded image, adapting it to their body shape and the dark, cinematic lighting.`
        : `Dress the subject in ${clothing}.`;

      return `Edit the uploaded image to create a cinematic Halloween horror movie still. The subject (keeping their ${identityPreservation}) is standing in the dark, holding a lighter close to their face. The lighter's flame casts a warm, flickering glow on their tense expression. Behind the subject, Pennywise the Dancing Clown from the movie 'IT' looms, his terrifying face also illuminated by the same flame, smiling menacingly over the subject's shoulder. The atmosphere is tense and cinematic. The lighting is a strong contrast of blue and orange. The final image should be ultra-realistic, with detailed skin texture, 4K resolution, and a shallow depth of field. ${hairstyleInstruction} ${clothingInstruction} Add the minimalist brand text 'LuxiaEstudio' in a clean, light gray sans-serif font in the bottom right corner. Ensure the final image has a ${aspectRatio} aspect ratio.`;
    }
  }
];