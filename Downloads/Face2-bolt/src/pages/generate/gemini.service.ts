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
        const basePrompt = `Create a side-by-side clinical comparison video from a provided BEFORE/AFTER photo set.

CORE OBJECTIVE: Create a professional-grade clinical before-and-after demonstration video that maintains absolute authenticity while incorporating subtle, naturalistic motion to enhance viewer engagement and treatment visualization.

FUNDAMENTAL REQUIREMENTS:
- PRESERVE ORIGINAL IMAGERY: The source photograph must remain completely unaltered in terms of facial features, skin texture, lighting conditions, background elements, and any visible treatment outcomes
- NO DIGITAL MANIPULATION: Absolutely no filters, beauty effects, color correction, contrast adjustments, or any form of digital enhancement
- NO CINEMATIC EFFECTS: No transitions, cuts, fades, zooms, pans, or any video editing techniques
- MAINTAIN CLINICAL AUTHENTICITY: All imperfections, asymmetries, natural variations, and authentic skin conditions must be preserved exactly as they appear in the original image

VIDEO COMPOSITION STRUCTURE:
The video must be formatted as a side-by-side clinical comparison with two distinct panels:

LEFT PANEL - "BEFORE" TREATMENT DOCUMENTATION:

MOTION CHARACTERISTICS:
- Primary Movement: Implement a slow, deliberate head rotation sequence that reveals the treatment area from multiple angles
- Rotation Pattern: Begin with subject facing forward (0°), then slowly rotate head 25-35° to the right, hold position for 0.8-1.2 seconds, return to center (0°) and pause for 1.0-1.5 seconds, then rotate 25-40° to the left, hold for 0.8-1.2 seconds, return to center and maintain position until video completion
- Rotation Speed: Extremely gradual movement, taking 2.5-3.5 seconds for each directional turn, creating a clinical examination pace
- Head Positioning: Maintain chin level throughout rotation - no tilting up or down, only horizontal rotation around the vertical axis

FACIAL EXPRESSION REQUIREMENTS:
- Expression: Neutral to slightly concerned, reflecting the pre-treatment state
- Eyes: Direct, honest gaze when facing forward; natural eye movement following head rotation
- Mouth: Relaxed, possibly with slight tension indicating concern about the condition
- Eyebrows: Natural position, may show slight furrowing indicating self-consciousness
- Overall Demeanor: Vulnerable presentation of the area requiring treatment

AUTHENTICITY PRESERVATION:
- Maintain ALL visible imperfections: acne, scars, age spots, fine lines, wrinkles, uneven skin tone, redness, hyperpigmentation, texture irregularities
- Preserve original lighting conditions and shadows exactly as captured
- Keep background elements completely static and unchanged
- Maintain original color temperature and saturation levels
- Preserve any visible makeup, hair, or accessories exactly as originally positioned

CLINICAL PRESENTATION INTENT:
- The movement should feel like a medical consultation where the patient is presenting their concern for professional evaluation
- Rotation should appear purposeful, as if showing the practitioner different angles of the treatment area
- Movement quality should be slightly hesitant, reflecting the vulnerability of showing imperfections

RIGHT PANEL - "AFTER" TREATMENT RESULTS:

MOTION CHARACTERISTICS:
- Primary Position: Subject remains predominantly forward-facing (0° orientation) with head stable and centered
- Micro-movements Only: Incorporate extremely subtle, barely perceptible movements that suggest life without creating distraction

SPECIFIC MICRO-MOVEMENT GUIDELINES:
- Blinking: Maximum 2 blinks during entire video sequence, each lasting 0.15-0.25 seconds with natural eyelid closure speed
- Eyebrow Activity: Occasional subtle shifts (1-2 instances) - slight raising or relaxing, each movement lasting 0.3-0.5 seconds
- Mouth Movements: Minimal lip adjustments - perhaps a slight relaxation or very subtle smile beginning (not full smile), lasting 0.4-0.7 seconds
- Eye Focus: Gentle shifts in gaze direction, moving from direct camera contact to slight angles (5-10° maximum deviation), returning to center
- Facial Muscle Tension: Very slight changes in overall facial tension, reflecting increased confidence

EXPRESSION REQUIREMENTS:
- Overall Demeanor: Confident, satisfied, and comfortable
- Eyes: Clear, direct, with subtle brightness indicating satisfaction
- Mouth: Relaxed, with potential for the beginning hint of a pleased expression
- Eyebrows: Naturally positioned, slightly more relaxed than "before" panel
- Skin Appearance: The treated results should be clearly visible - smoother texture, reduced imperfections, improved tone

STABILITY EMPHASIS:
- Head Position: Rock-steady primary position with only micro-adjustments
- Background: Completely static, identical to original image
- Lighting: Consistent with original capture conditions
- Overall Impression: Calm confidence in results, peaceful satisfaction

OPTIONAL HAND GESTURE SPECIFICATIONS:
- Timing: May introduce between seconds 3-8 of video sequence
- Duration: 1.5-3.0 seconds maximum
- Movement Quality: Slow, gentle, non-distracting
- Hand Position Options:
  * Light fingertip touch near treated area (not directly on skin)
  * Gentle gesture indicating the improvement (hand moving toward area without contact)
  * Soft framing gesture around the treated region
- Hand Movement Speed: Extremely slow and deliberate
- Entry/Exit: Hand should enter and exit frame gradually, never appearing suddenly

TECHNICAL VIDEO SPECIFICATIONS:
- Duration: 8 seconds total length
- Frame Rate: Smooth, cinematic quality (minimum 24fps)
- Resolution: High definition maintaining source image quality
- Audio: Silent - no sound required
- Aspect Ratio: Maintain 16:9 widescreen format with both panels clearly visible
- Panel Division: Clean, precise 50/50 split down the center vertical axis

LIGHTING AND VISUAL CONSISTENCY:
- Maintain identical lighting conditions between both panels
- Preserve original shadows, highlights, and color temperature
- No enhancement or correction of lighting conditions
- Background elements must remain perfectly consistent
- Any visible environmental details (furniture, walls, etc.) must be identical

MOTION QUALITY STANDARDS:
- All movements must appear completely natural and human-like
- No robotic or artificial motion patterns
- Movements should have natural acceleration and deceleration
- Incorporate subtle imperfections in timing that reflect natural human movement
- Avoid perfect symmetry or mechanical precision

CLINICAL AUTHENTICITY MARKERS:
- The "before" panel should clearly demonstrate the original condition requiring treatment
- The "after" panel should authentically show the treatment results without exaggeration
- Any improvement should be realistic and proportionate to actual treatment capabilities
- Maintain professional medical documentation standards throughout

VIEWER ENGAGEMENT ELEMENTS:
- The contrasting movement patterns (dynamic "before" vs. stable "after") should create visual interest
- Head rotation in "before" panel reveals condition comprehensively
- Stability in "after" panel emphasizes confidence and satisfaction with results
- Overall effect should be compelling without being sensationalized

ABSOLUTE PROHIBITIONS:
- No morphing or shape-changing effects
- No color grading or tone adjustments
- No smoothing, sharpening, or texture modifications
- No background replacement or alteration
- No addition of graphics, text, or overlays
- No speed ramping or time manipulation effects
- No particle effects, glows, or enhancement filters
- No artificial lighting or illumination changes

The final video must serve as an authentic clinical demonstration that could be used in medical presentations while maintaining complete honesty about both the original condition and the treatment results. Every frame must withstand professional scrutiny for authenticity and accuracy.

        `;

        // Snippets for Animation Logic
        const animationSnippets = {
            animate_before_head_turn: {
                before: `• Left Panel (Before): The subject’s head turns slowly side-to-side *within its frame*. Begin by turning approximately 15–30° in one direction, pause, return to center, pause for one second, then rotate 15–35° in the opposite direction before returning to center again. The movement must feel intentional, as if presenting untreated skin for close inspection. Maintain all natural texture and imperfections exactly as in the source photo—fine lines, redness, acne, scars, or uneven tone must remain visible and unedited. The rotation simply reveals them from different angles inside the original photo's boundaries. All movements must be contained within this panel.`,
                after: `• Right Panel (After): The subject remains steady and forward-facing *within its frame*. Add only very subtle micro-movements (natural blinking, faint micro-expressions) to keep the photo alive. The overall impression must be calm stability.`
            },
            animate_after_head_turn: {
                before: `• Left Panel (Before): The subject remains steady and forward-facing *within its frame*. Add only very subtle micro-movements (natural blinking) to keep the photo alive.`,
                after: `• Right Panel (After): The subject’s head turns slowly side-to-side *within its frame*. Begin by turning approximately 15–30° in one direction, pause, return to center, pause for one second, then rotate 15–35° in the opposite direction before returning to center again. The movement must feel intentional, as if presenting untreated skin for close inspection. Maintain all natural texture and imperfections exactly as in the source photo—fine lines, redness, acne, scars, or uneven tone must remain visible and unedited. The rotation simply reveals them from different angles inside the original photo's boundaries. All movements must be contained within this panel.
`
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
            hand_gesture: ` You may briefly introduce a natural hand gesture near the treatment area for 1–3 seconds, but it must not distract from the treatment area but rather highlight and emphasize it.`,
            subtle_zoom: ` You may briefly apply a natural a very slow, subtle zoom-in effect (e.g., from 100% to 105% scale).`
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
