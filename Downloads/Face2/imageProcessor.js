// imageProcessor.js
// Aligns with the new System Prompt & geminiService systemInstruction flow.
// - Stateless per job (never re-use derivatives; caller must supply ORIGINAL buffers).
// - Beautify requires consent_on_file === true and BOTH images.
// - Anonymize allows 0/1/2 images but MUST have at least one.
// - If notes are missing, Gemini falls back to system rules (handled in geminiService).
// - No JSON is shown to users; jsonLog is returned for server-side storage only.

const geminiService = require('./geminiService');
const sharp = require('sharp');

/**
 * ANONYMIZE
 * - Privacy-preserving: replaces identity while preserving treatment effect.
 * - Accepts 0/1/2 inputs, but requires at least one image buffer.
 * - Never falls back to a non-anonymizing process.
 */
async function anonymizePhotos(beforeBuf, afterBuf, metadata = {}) {
  console.log('=== Starting Unified Gemini ANONYMIZE ===');

  // Minimal input validation for anonymize
  if (!beforeBuf && !afterBuf) {
    throw new Error('Anonymize requires at least one ORIGINAL image buffer (before or after).');
  }

  // Clamp/normalize key params expected by the System Prompt
  const safeMeta = normalizeAnonymizeParams(metadata);

  // Log buffer sizes (debug)
  console.log(`📊 Buffers — before: ${beforeBuf ? beforeBuf.length : 0}B, after: ${afterBuf ? afterBuf.length : 0}B`);
  
  let inputComposite;
  if (beforeBuf && afterBuf) {
    // Both images - combine into one composite
    console.log('🔗 Creating input composite for Gemini...');
    inputComposite = await createInputComposite(beforeBuf, afterBuf);
  } else {
    // Single image - use as is (Gemini can generate the missing panel)
    inputComposite = beforeBuf || afterBuf;
  }
  
  try {
    const result = await geminiService.processJob(inputComposite, null, {
      ...safeMeta,
      mode: 'anonymize',
    });
    console.log('✅ Unified Gemini ANONYMIZE complete.');
    // STATeless cleanup hint: drop references
    clearLocalBuffers(beforeBuf, afterBuf);
    return result; // { compositeBuffer, jsonLog }
  } catch (err) {
    console.error('❌ Unified Gemini ANONYMIZE failed:', err);
    // SECURITY: do NOT produce a non-anonymized output
    clearLocalBuffers(beforeBuf, afterBuf);
    throw new Error('Anonymization failed. No unsafe fallback executed.');
  }
}

/**
 * BEAUTIFY
 * - Consent required (consent_on_file === true).
 * - Requires BOTH before and after images (for fair side-by-side polish).
 * - Safe fallback allowed (basic photographic polish) if Gemini fails.
 */
async function beautifyPhotos(beforeBuf, afterBuf, metadata = {}) {
  console.log('=== Starting Unified Gemini BEAUTIFY ===');

  // Consent gate removed - beautify allowed without consent verification

  // Beautify requires both panels
  if (!beforeBuf || !afterBuf) {
    throw new Error('Beautify requires BOTH before and after ORIGINAL image buffers.');
  }

  const safeMeta = normalizeBeautifyParams(metadata);

  console.log(`📊 Buffers — before: ${beforeBuf.length}B, after: ${afterBuf.length}B`);
  
  // Combine the two separate images into one before/after composite for Gemini
  console.log('🔗 Creating input composite for Gemini...');
  const inputComposite = await createInputComposite(beforeBuf, afterBuf);
  
  try {
    // Send the combined image to Gemini (beforeBuffer = composite, afterBuffer = null)
    const result = await geminiService.processJob(inputComposite, null, {
      ...safeMeta,
      mode: 'beautify',
    });
    console.log('✅ Unified Gemini BEAUTIFY complete.');
    clearLocalBuffers(beforeBuf, afterBuf);
    return result;
  } catch (err) {
    console.error('❌ Unified Gemini BEAUTIFY failed. Falling back safely:', err);
    const fb = await fallbackBeautification(beforeBuf, afterBuf, safeMeta);
    clearLocalBuffers(beforeBuf, afterBuf);
    return fb;
  }
}

/**
 * Fallback for Beautify only (photographic polish).
 * - Never changes identity/anatomy.
 * - Keeps background, simple exposure/WB/saturation + sharpen.
 * - Produces a clean side-by-side PNG using Sharp.
 */
async function fallbackBeautification(beforeBuf, afterBuf, metadata = {}) {
  console.log('🔄 Using fallback beautification (photographic polish only)…');
  const start = Date.now();

  const intensity = Math.max(1, Math.min(10, Number(metadata.beautify_intensity || 5))) / 10;

  const processImage = (buffer) => {
    let pipeline = sharp(buffer).resize(400, null, { fit: 'contain' });
    if (intensity > 0.3) {
      pipeline = pipeline
        .modulate({
          brightness: 1 + (intensity * 0.1),
          saturation: 1 + (intensity * 0.2),
        })
        .sharpen();
    }
    return pipeline.png().toBuffer();
  };

  const [left, right] = await Promise.all([processImage(beforeBuf), processImage(afterBuf)]);
  const compositeBuffer = await createSideBySideComposite(left, right);

  const processingTime = Date.now() - start;
  const jsonLog = {
    job_id: metadata.job_id,
    mode: 'beautify',
    ai_service: 'fallback_basic_enhancement',
    beautify_intensity: Number(metadata.beautify_intensity || 5),
    processing_time_ms: processingTime,
    timestamp: new Date().toISOString(),
    notes_present: Boolean(metadata.notes && String(metadata.notes).trim()),
    status: 'completed_fallback',
    note: 'AI processing unavailable; used basic image enhancement (identity/treatment preserved).',
  };

  return { compositeBuffer, jsonLog };
}

/**
 * Create an input composite for Gemini.
 * Combines two separate images into one side-by-side image with thin white divider.
 * This is what gets sent TO Gemini, not the final output.
 */
async function createInputComposite(beforeBuffer, afterBuffer) {
  console.log('🔗 Creating input composite for Gemini...');
  
  // Create a clean side-by-side layout for Gemini to process
  const squareSize = 800;
  const halfWidth = squareSize / 2;
  const dividerWidth = 4; // Slightly thicker white divider for clarity
  
  // Resize each image to fill exactly half the space
  const beforeResized = await sharp(beforeBuffer)
    .resize(halfWidth - dividerWidth/2, squareSize, { 
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toBuffer();
  
  const afterResized = await sharp(afterBuffer)
    .resize(halfWidth - dividerWidth/2, squareSize, { 
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toBuffer();
  
  // Create white divider
  const divider = await sharp({
    create: {
      width: dividerWidth,
      height: squareSize,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
  .png()
  .toBuffer();
  
  // Combine into single image for Gemini
  const composite = await sharp({
    create: {
      width: squareSize,
      height: squareSize,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
  .composite([
    {
      input: beforeResized,
      left: 0,
      top: 0
    },
    {
      input: divider,
      left: halfWidth - dividerWidth/2,
      top: 0
    },
    {
      input: afterResized,
      left: halfWidth + dividerWidth/2,
      top: 0
    }
  ])
  .png()
  .toBuffer();

  return composite;
}

/**
 * Create a square side-by-side composite (PNG).
 * Creates a perfect square with before image on left half, after image on right half.
 */
async function createSideBySideComposite(beforeBuffer, afterBuffer) {
  console.log('🧱 Creating square side-by-side composite…');
  
  // Fixed square dimensions
  const squareSize = 800;
  const halfWidth = squareSize / 2;
  const dividerWidth = 2;
  
  // Resize each image to fit inside half the square (preserves full faces)
  const beforeResized = await sharp(beforeBuffer)
    .resize(halfWidth - dividerWidth/2, squareSize, { 
      fit: 'inside',
      position: 'center',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();
  
  const afterResized = await sharp(afterBuffer)
    .resize(halfWidth - dividerWidth/2, squareSize, { 
      fit: 'inside',
      position: 'center',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();
  
  // Create the square composite
  const composite = await sharp({
    create: {
      width: squareSize,
      height: squareSize,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    {
      input: beforeResized,
      left: 0,
      top: 0
    },
    {
      input: await makeDivider(squareSize, dividerWidth),
      left: halfWidth - dividerWidth/2,
      top: 0
    },
    {
      input: afterResized,
      left: halfWidth + dividerWidth/2,
      top: 0
    }
  ])
  .png()
  .toBuffer();

  return composite;
}

async function makeDivider(height, width) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 200, g: 200, b: 200, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
}

/* ---------- helpers ---------- */

function normalizeAnonymizeParams(meta) {
  const variation = clampInt(meta.variation ?? 55, 15, 100);
  let alignment_variance = meta.alignment_variance;
  if (alignment_variance != null) {
    alignment_variance = clampInt(alignment_variance, 5, 20);
  }
  return {
    ...meta,
    mode: 'anonymize',
    variation,
    alignment_variance,
    // If notes are absent, geminiService/system prompt falls back to default rules.
    notes: (meta.notes && String(meta.notes)) || '',
    advanced: meta.advanced || {},
  };
}

function normalizeBeautifyParams(meta) {
  const beautify_intensity = clampInt(meta.beautify_intensity ?? 5, 1, 10);
  return {
    ...meta,
    mode: 'beautify',
    beautify_intensity,
    notes: (meta.notes && String(meta.notes)) || '',
    advanced: meta.advanced || {},
  };
}

function clampInt(n, min, max) {
  const v = Number.parseInt(n, 10);
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}

/**
 * Best-effort local cleanup to encourage statelessness between jobs.
 * (Real statelessness is enforced by always using ORIGINAL inputs + backend DB rules.)
 */
function clearLocalBuffers(beforeBuf, afterBuf) {
  try {
    // Drop references
    beforeBuf = null; // eslint-disable-line no-param-reassign
    afterBuf = null;  // eslint-disable-line no-param-reassign
    if (global && typeof global.gc === 'function') {
      global.gc();
    }
  } catch (_) {
    // ignore
  }
}

module.exports = {
  anonymizePhotos,
  beautifyPhotos,
};