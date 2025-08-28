// geminiService.js
// Updated to: 
//  - use a single, authoritative SYSTEM PROMPT (Beautify & Anonymize)
//  - rely on rules if notes are not provided
//  - send system prompt via `systemInstruction`
//  - keep statelessness and image handling intact

const { GoogleGenAI, Modality } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

class GeminiService {
  async processJob(beforeBuffer, afterBuffer, jobParams) {
    const startTime = Date.now();
    const mode = jobParams.mode;                // 'beautify' | 'anonymize'
    const notes = jobParams.notes || "";        // may be empty (fallback to rules)
    const variation = Math.max(15, Math.min(100, Number(jobParams.variation || 55))); // anonymize strength
    const alignOverride = jobParams.alignment_variance; // optional 5–20
    const beautifyIntensity = Math.max(1, Math.min(10, Number(jobParams.beautify_intensity || 5)));

    console.log(`=== Starting Gemini ${mode} job #${jobParams.job_id} ===`);

    const modelName = "gemini-2.5-flash-image-preview";
    console.log(`🤖 Using model: ${modelName}`);

    // Build the SYSTEM prompt (long, policy-like instructions)
    const systemText = this.buildSystemPrompt();

    // Build the per-job USER content (compact)
    const userText = this.buildUserPrompt({
      mode,
      notes,
      variation,
      alignOverride,
      beautifyIntensity,
      advanced: jobParams.advanced || {},
    });

    // Validate images (anonymize can accept 0/1/2, but at least one is required for now)
    if (!beforeBuffer && !afterBuffer) {
      throw new Error("At least one image is required");
    }
    const beforeSize = beforeBuffer ? beforeBuffer.length : 0;
    const afterSize = afterBuffer ? afterBuffer.length : 0;
    console.log(`📊 Image sizes - Before: ${beforeSize}B, After: ${afterSize}B`);
    if ((beforeBuffer && beforeSize < 200) || (afterBuffer && afterSize < 200)) {
      console.log("⚠️ Very small inputs — using fallback");
      throw new Error("Input images too small for AI processing - using fallback");
    }

    // Compose multimodal parts
    const parts = [{ text: userText }];
    if (beforeBuffer) {
      parts.push({
        inlineData: {
          data: beforeBuffer.toString("base64"),
          mimeType: "image/webp",
        },
      });
    }
    if (afterBuffer) {
      parts.push({
        inlineData: {
          data: afterBuffer.toString("base64"),
          mimeType: "image/webp",
        },
      });
    }

    console.log("📤 Sending to Gemini…");
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        // The long rules live here as a SYSTEM instruction
        systemInstruction: { role: "system", parts: [{ text: systemText }] },
        contents: { parts },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      // Extract image from response
      let compositeImageBase64 = null;
      if (response?.candidates?.length) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            compositeImageBase64 = part.inlineData.data;
            break;
          }
        }
      }
      if (!compositeImageBase64) {
        const textResponse = response?.text;
        console.error("❌ No image in response. Text:", textResponse);
        throw new Error("Invalid response from Gemini API - no image data found");
      }

      const processingTime = Date.now() - startTime;
      console.log(`✅ Gemini ${mode} job complete in ${processingTime}ms`);

      const jsonLog = {
        job_id: jobParams.job_id,
        mode,
        ai_service: modelName,
        processing_time_ms: processingTime,
        timestamp: new Date().toISOString(),
        // store inputs (server-side only; UI must not show JSON)
        inputs: {
          variation,
          beautify_intensity: beautifyIntensity,
          alignment_variance: alignOverride || "auto",
          notes_present: Boolean(notes && notes.trim()),
        },
        status: "completed",
      };

      return {
        compositeBuffer: Buffer.from(compositeImageBase64, "base64"),
        jsonLog,
      };
    } catch (err) {
      console.error(`❌ Gemini ${mode} failed:`, err);
      console.log("🔄 Falling back to basic processing…");
      return await this.fallbackProcessing(beforeBuffer, afterBuffer, jobParams, startTime);
    }
  }

  /**
   * Long, authoritative SYSTEM PROMPT (Beautify & Anonymize)
   * Includes: consent gate, statelessness, notes fallback, identity lock, imperfection lock,
   * clothing/hair micro-variation, alignment variance, similarity guard, and "no JSON in UI".
   */
  buildSystemPrompt() {
    return (
`🧩 System Prompt — MedSpa Photo App (Beautify & Anonymize)

ROLE
You are the image engine for a clinical before/after web app. You run one job at a time and must follow the rules below.

CONSENT GATE
- Only process Beautify jobs if the backend indicates consent is on file.
- Anonymize jobs are allowed without individual consent only because identity is replaced and cannot reasonably be re-identified.

STATELESSNESS / SOURCE OF TRUTH
- Treat every request as a fresh, stateless job.
- Use only the ORIGINAL upload(s) provided with this request.
- Never read or iterate on previously generated images.
- After finishing, purge any memory, caches, or latent context from this job.

INPUTS (from backend)
- mode: "beautify" | "anonymize"
- images: may include 0/1/2 of {before, after}
- notes: free text describing treatment(s) and desired AFTER appearance
- variation: 15–100 (Anonymize strength; scales identity edits)
- alignment_variance: optional override 5–20%
- beautify_intensity: 1–10 (polish strength)
- advanced: hair micro-variation, clothing type lock, clothing variation (≤15%), optional eye color

IF NOTES ARE MISSING
- Fall back to the rules in this System Prompt:
  - For Beautify: polish exposure/WB/contrast/gamma, micro-straighten (≤5°), keep identity/treatment/background.
  - For Anonymize: enforce imperfection lock in BEFORE and realistic, subtle improvement in AFTER; no exaggeration.

GLOBAL OUTPUT CONTRACT
- Produce a single side-by-side composite image with final dimensions of 1200x1200 pixels (square orientation).
- The composite should have two vertical panels: "Before" on the left, "After" on the right, separated by a thin neutral divider.
- Return the image only. The backend stores JSON server-side; do not render JSON in UI.

MODE A — BEAUTIFY (consent-approved)
Goal: polish photography without changing identity, anatomy, or treatment magnitude.
Allowed: WB/tint/temperature, exposure EV, contrast, gamma, gentle dehaze; local dodge/burn (subtle); NR then grain re-add; mild sharpening; micro-straighten/perspective ≤5°; recenter within canvas bounds.
Background: keep original elements; clean banding/noise only. No replacements, no object removal.
Forbidden: face/feature reshaping, slimming, eye/lip enlargement, makeup, "beauty filters"; artificial bokeh; background replacement.

MODE B — ANONYMIZE (no consent; privacy-preserving)
Core: replace the subject’s identity with ONE anonymized identity, consistent across both panels, non-matching to the original.
Notes-based preservation:
- If notes exist: BEFORE shows baseline imperfections described; AFTER shows only the improvements described (no exaggeration).
- If no notes: BEFORE preserves imperfections; AFTER applies generic realistic improvements (reduced lines/folds, reduced under-eye shadows, slightly more even tone).
Identity Randomization (scaled by variation 15→100; apply once then lock across panels):
- Hair: natural shade {auburn, brunette, chestnut, dark blonde, black}; style {straight|loose wave}; part {middle|side}; length {collarbone–shoulder}. Keep consistent; allow ≤10% micro-variation (slight part shift, loose strands, minor volume change).
- Brows: reshape (fuller/arched | straight/full); magnitude scales with variation.
- Eyes: iris {hazel|green|gray|brown}, identical across panels; lid/crease geometry scales with variation.
- Nose: one morph (narrower bridge | softer tip | slightly wider base); magnitude scales with variation.
- Jaw/Cheeks: contour tweak (softer | narrower); magnitude scales with variation.
- Skin tone: uniform shift up to ±15% max.
- Marks: remove/relocate identifiable moles/scars/tattoos consistently.
Clothing (same type; realistic variation):
- Keep clothing type identical across panels (scrub→scrub, tee→tee).
- Introduce ≤10–15% variation: wrinkles/folds, neckline angle, sleeve/collar position; neutral shade shift (charcoal↔slate); subtle texture change (matte knit vs scrub weave).
- No logos, no graphics.
Alignment & Framing:
- Align AFTER to BEFORE via similarity transform.
- Add natural misalignment 5–20% (random unless override is provided). Do not perfectly align.
Imperfection Lock (delineation):
- BEFORE must visibly preserve: pores, fine lines, nasolabial folds, under-eye shadows, uneven tone, redness, acne/texture.
- AFTER shows only improvements (notes-based or default). Keep skin textured and human (no plastic).
Realism:
- Maintain pores, micro-shadows, natural asymmetries, stray hairs; add subtle grain if too clean; clinical lighting (no cinematic glow).
Similarity Guard:
- Non-matching identity required. Internal face-embedding cosine thresholds by variation:
  - 15% → ≤ 0.40
  - 50% → ≤ 0.32
  - 100% → ≤ 0.25
- If above threshold, re-run with stronger identity edits (treatment unchanged), up to 3 attempts.

CASES
- Two images: treat as same subject; apply rules above.
- One image: create paired set. Anonymize → synthesize missing panel per notes/fallback; Beautify → duplicate framing; keep identity/treatment intact.
- Zero images (Anonymize only): generate plausible anonymized pair per notes/fallback, still following identity lock, delineation, realism.

VARIATION & INTENSITY
Anonymize variation (15–100):
- Alignment variance: 5% → 20%
- Nose/Jaw/Eyelid morph caps: 5% → 20%
- Brow reshape: ±5% → ±40%
- Hair hue/lightness: ±5% → ±15%
- Clothing variation: 5% → 15%
- Skin-tone shift: ≤ ±15%
Beautify intensity (1–10):
- WB ±300K→±1500K; Exposure ±0.15→±0.6 EV; Contrast low→med-high; Perspective ≤2°→≤5°. Always preserve identity, treatment, background.

HARD CONSTRAINTS
- Never fabricate or exaggerate clinical results.
- Never oversmooth skin into plastic.
- Never replace/remove background elements.
- Never change clothing type across panels.
- Never drift identity traits within a job.
- Never reuse cached outputs or iterate from prior results.

FEEDBACK
UI may collect thumbs 👍/👎 and comments. You do not render feedback controls.

END OF JOB
Return the composite image only. Do not output JSON. Purge job memory/state after completion.`
    );
  }

  /**
   * Short per-job user prompt that hands Gemini the live parameters.
   */
  buildUserPrompt({ mode, notes, variation, alignOverride, beautifyIntensity, advanced }) {
    const header =
      mode === "anonymize"
        ? `MODE: ANONYMIZE\n- variation: ${variation}\n- alignment_variance: ${alignOverride ? `${alignOverride}% (override)` : "auto (5–20%)"}\n- advanced: ${JSON.stringify(advanced)}`
        : `MODE: BEAUTIFY\n- intensity: ${beautifyIntensity}\n- advanced: ${JSON.stringify(advanced)}`;

    const notesBlock =
      notes && notes.trim()
        ? `NOTES (authoritative if present):\n${notes.trim()}`
        : `NO NOTES PROVIDED → Use system fallback rules for this mode.`;

    const labels =
      mode === "anonymize"
        ? `Composite labels: ""`
        : `Composite labels: ""`;

    const caption =
      mode === "anonymize"
        ? `Caption: ""`
        : `Caption: ""`;

    return [
      "SESSION:",
      "- Treat this as a fresh, stateless job using ONLY the ORIGINAL images included below.",
      "",
      header,
      "",
      notesBlock,
      "",
      labels,
      caption,
      "",
      "Return a single side-by-side composite image only (no JSON in UI).",
    ].join("\n");
  }

  // === FALLBACK (unchanged except for minor comments) ===
  async fallbackProcessing(beforeBuffer, afterBuffer, jobParams, startTime) {
    const sharp = require("sharp");
    const mode = jobParams.mode;
    const intensity = (jobParams.beautify_intensity || 5) / 10;

    if (!beforeBuffer && !afterBuffer) {
      const placeholder = await sharp({
        create: {
          width: 1200,
          height: 600,
          channels: 4,
          background: { r: 240, g: 240, b: 240, alpha: 1 },
        },
      })
        .png()
        .toBuffer();

      const processingTime = Date.now() - startTime;
      return {
        compositeBuffer: placeholder,
        jsonLog: {
          job_id: jobParams.job_id,
          mode,
          ai_service: "fallback_placeholder",
          processing_time_ms: processingTime,
          timestamp: new Date().toISOString(),
          notes: jobParams.notes,
          status: "completed",
          note: "AI processing unavailable, used placeholder",
        },
      };
    }

    const processImage = (buffer) => {
      let pipeline = sharp(buffer).resize(600, null, { fit: "contain" });
      if (mode === "beautify" && intensity > 0.3) {
        pipeline = pipeline
          .modulate({
            brightness: 1 + intensity * 0.1,
            saturation: 1 + intensity * 0.2,
          })
          .sharpen();
      }
      return pipeline.png().toBuffer();
    };

    let leftImage, rightImage;
    if (beforeBuffer && afterBuffer) {
      [leftImage, rightImage] = await Promise.all([
        processImage(beforeBuffer),
        processImage(afterBuffer),
      ]);
    } else if (beforeBuffer) {
      leftImage = await processImage(beforeBuffer);
      rightImage =
        mode === "anonymize"
          ? await sharp(beforeBuffer)
              .modulate({ brightness: 1.1, saturation: 0.9, hue: 10 })
              .resize(600, null, { fit: "contain" })
              .png()
              .toBuffer()
          : leftImage;
    } else {
      rightImage = await processImage(afterBuffer);
      leftImage = rightImage;
    }

    const compositeBuffer = await this.createSideBySideComposite(leftImage, rightImage);
    const processingTime = Date.now() - startTime;

    const jsonLog = {
      job_id: jobParams.job_id,
      mode,
      ai_service: "fallback_basic_enhancement",
      beautify_intensity: jobParams.beautify_intensity,
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
      notes: jobParams.notes,
      status: "completed",
      note: "AI processing unavailable, used basic image enhancement",
    };

    return { compositeBuffer, jsonLog };
  }

  async createSideBySideComposite(leftBuffer, rightBuffer) {
    const sharp = require("sharp");
    console.log("🧱 Creating square composite (left=before, right=after)…");

    const squareSize = 1200;
    const half = squareSize / 2;
    const dividerWidth = 4;

    const mkBg = async () =>
      sharp({
        create: {
          width: half - dividerWidth / 2,
          height: squareSize,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      })
        .png()
        .toBuffer();

    const [leftBg, rightBg] = await Promise.all([mkBg(), mkBg()]);

    const resizedLeft = await sharp(leftBuffer)
      .resize(half - dividerWidth / 2, squareSize, {
        fit: "inside",
        position: "center",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toBuffer();
    const resizedRight = await sharp(rightBuffer)
      .resize(half - dividerWidth / 2, squareSize, {
        fit: "inside",
        position: "center",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toBuffer();

    const leftMeta = await sharp(resizedLeft).metadata();
    const rightMeta = await sharp(resizedRight).metadata();

    const leftLeft = Math.max(0, Math.floor((half - dividerWidth / 2 - leftMeta.width) / 2));
    const leftTop = Math.max(0, Math.floor((squareSize - leftMeta.height) / 2));
    const rightLeft = Math.max(0, Math.floor((half - dividerWidth / 2 - rightMeta.width) / 2));
    const rightTop = Math.max(0, Math.floor((squareSize - rightMeta.height) / 2));

    const leftComposite = await sharp(leftBg)
      .composite([{ input: resizedLeft, left: leftLeft, top: leftTop }])
      .png()
      .toBuffer();
    const rightComposite = await sharp(rightBg)
      .composite([{ input: resizedRight, left: rightLeft, top: rightTop }])
      .png()
      .toBuffer();

    const divider = await sharp({
      create: {
        width: dividerWidth,
        height: squareSize,
        channels: 4,
        background: { r: 200, g: 200, b: 200, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const composite = await sharp({
      create: {
        width: squareSize,
        height: squareSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([
        { input: leftComposite, left: 0, top: 0 },
        { input: divider, left: half - dividerWidth / 2, top: 0 },
        { input: rightComposite, left: half + dividerWidth / 2, top: 0 },
      ])
      .png()
      .toBuffer();

    return composite;
  }
}

module.exports = new GeminiService();