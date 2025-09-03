import { GoogleGenAI } from "@google/genai";

export const generateClinicalVideo = async (
    imageBase64: string,
    options: {
        primaryAnimation: string;
        emphasisEffect: string;
        motionSpeed: string;
    },
    onProgress: (stage: number) => void
): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });

        // Dynamic prompt engineering based on user options
        const basePrompt = `**CRITICAL INSTRUCTION: All generated motion and content MUST be strictly confined within the original boundaries of the before-and-after photo panels. Do NOT alter, fill, or generate anything in the background or areas outside of the two subject panels. The framing of the original photos must be perfectly preserved throughout the video.**

Generate a clinical demonstration video using the provided composite photo. The two panels must retain their exact original photos, backgrounds, and treatment results. Do not apply transitions, cuts, filters, or effects. Only add subtle, consistent human-like motion as described below, contained entirely within each panel:`;

        // Snippets for Animation Logic
        const animationSnippets = {
            animate_before_head_turn: {
                before: `• Left Panel (Before): The subject's head rotates slowly side-to-side *within its frame*. The movement must feel intentional, as if presenting untreated skin for close inspection. Maintain all natural texture and imperfections exactly as in the source photo.`,
                after: `• Right Panel (After): The subject remains steady and forward-facing *within its frame*. Add only very subtle micro-movements (natural blinking, faint micro-expressions) to keep the photo alive. The overall impression must be calm stability.`
            },
            animate_after_head_turn: {
                before: `• Left Panel (Before): The subject remains steady and forward-facing *within its frame*. Add only very subtle micro-movements (natural blinking) to keep the photo alive.`,
                after: `• Right Panel (After): The subject's head rotates slowly side-to-side *within its frame*. The movement must feel confident, as if showing off the excellent results from all angles.`
            },
            animate_after_smile: {
                before: `• Left Panel (Before): The subject remains steady and forward-facing *within its frame* with a neutral expression. Add only very subtle micro-movements (natural blinking).`,
                after: `• Right Panel (After): The subject's expression transitions from neutral into a gentle, confident smile. The smile should form naturally over 2-3 seconds and then hold. The head itself remains completely still.`
            },
            animate_after_surprise: {
                before: `• Left Panel (Before): The subject remains steady and forward-facing *within its frame* with a neutral expression. Add only very subtle micro-movements (natural blinking).`,
                after: `• Right Panel (After): The subject's expression transitions into one of pleased surprise. This includes a slight widening of the eyes and a soft, happy mouth, as if seeing their wonderful results for the first time. The head remains completely still.`
            }
        };

        // Snippets for Emphasis Effects (to be appended to the 'After' panel instruction)
        const emphasisSnippets = {
            none: '',
            hand_gesture: ` For 2-3 seconds, a natural, professional-looking hand (neutral nail color, no jewelry) will enter the RIGHT PANEL ONLY to gently highlight the primary treatment area in the 'after' results. The hand must NEVER appear in the left 'before' panel. The hand gesture must be subtle and clinical, drawing attention to the successful results without obscuring them, then smoothly exit the frame.`,
            subtle_zoom: ` Apply a very slow, subtle zoom-in effect (e.g., from 100% to 105% scale) focused on the subject in this panel. The zoom should be smooth and last for the majority of the video's duration to create a sense of focus.`
        };

        // Snippets for Motion Speed
        const speedSnippets = {
            slow: ` All described movements should be performed slowly and deliberately.`,
            normal: ` All described movements should be performed at a natural, calm pace.`,
            fast: ` All described movements should be performed at a slightly quicker, efficient pace.`
        };

        // Conditional prompt assembly
        const { primaryAnimation, emphasisEffect, motionSpeed } = options;

        // 1. Get base animation instructions
        let beforeInstruction = animationSnippets[primaryAnimation as keyof typeof animationSnippets].before;
        let afterInstruction = animationSnippets[primaryAnimation as keyof typeof animationSnippets].after;

        // 2. Append emphasis effect to the 'after' panel instruction
        afterInstruction += emphasisSnippets[emphasisEffect as keyof typeof emphasisSnippets];

        // 3. Get speed instruction
        const speedInstruction = speedSnippets[motionSpeed as keyof typeof speedSnippets];

        // 4. Assemble the final prompt
        const videoPrompt = `${basePrompt}\n\n${beforeInstruction}\n\n${afterInstruction}\n\n• Overall Pacing:${speedInstruction}`;

        onProgress(2); // Sending to AI
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: videoPrompt,
            image: {
                imageBytes: imageBase64,
                mimeType: 'image/png',
            },
            config: {
                numberOfVideos: 1
            }
        });

        onProgress(3); // Generating Video
        
        let pollDelay = 10000; // 10 seconds
        const maxPollDelay = 60000; // 60 seconds

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, pollDelay));
            try {
                operation = await ai.operations.getVideosOperation({ operation: operation });
                // If successful, reset delay
                pollDelay = 10000;
            } catch (pollError: any) {
                // Check if it's a rate limit error
                const errorString = pollError.toString();
                if (errorString.includes('429') || errorString.toUpperCase().includes('RESOURCE_EXHAUSTED')) {
                    const newDelay = Math.min(pollDelay * 2, maxPollDelay);
                    console.warn(`Rate limit hit while polling. Increasing delay from ${pollDelay}ms to ${newDelay}ms.`);
                    pollDelay = newDelay;
                    continue; // Continue the loop to retry after the increased delay
                } else {
                    // It's a different, unexpected error, so we should fail
                    throw pollError;
                }
            }
        }


        onProgress(4); // Finalizing
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        
        if (downloadLink) {
            return `${downloadLink}&key=${import.meta.env.VITE_GEMINI_API_KEY}`;
        } else {
            throw new Error("Video generation failed or returned no downloadable link.");
        }
    } catch (error) {
        console.error("Error in Gemini Service:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
};
