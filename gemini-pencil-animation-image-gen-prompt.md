# Prompt: Create the gemini-pencil-animation-image-gen Skill

## Context

I'm building a collection of Gemini image generation skills for different art styles. I already have a working skill called `gemini-pixel-image-gen` that generates pixel art using the Gemini API via a Python script. I need you to create a NEW skill called `gemini-pencil-animation-image-gen` that follows the exact same structure but targets a completely different art style: **pencil test animation drawings** (traditional animation production sketches).

I've attached a reference image that is the **source of truth** for the visual style. Study it carefully — every prompt template you write must reproduce this specific look.

## The Reference Art Style (Study the Attached Image)

The attached image shows a traditional **animation pencil test / production drawing** style with these specific characteristics:

**Line Work:**
- Hand-drawn pencil lines with natural stroke-weight variation (thicker on contour outlines, thinner on interior details)
- Graphite gray lines, NOT solid black — the tone is warm gray with visible pencil pressure variation
- Loose, sketchy quality — not clean vector lines. Subtle construction/guide line artifacts visible beneath the final drawing
- Cross-hatching and directional pencil strokes for shading on clothing folds, under chin, and shadow areas
- Line confidence suggests professional animator hand — fluid, gestural strokes, not stiff or mechanical

**Color & Rendering:**
- Extremely limited, muted color palette layered OVER the pencil drawing
- Flat color fills (no gradients) — think marker or digital flat-color over a pencil sketch
- Colors are desaturated and natural: dark navy (shirt), cool gray (jeans), warm skin tones, muted sandy blonde (hair)
- The pencil lines remain visible through and on top of the color fills — the drawing is the primary element, color is secondary

**Paper & Texture:**
- Warm cream/off-white paper background with visible grain texture
- Subtle aging/wear marks on the paper (slight scuffs, dust specks)
- Three hole-punch marks at the bottom edge — authentic animation paper
- A hand-written production label in the top-left corner (e.g., "A-2") — animation sheet numbering convention

**Character Style:**
- Slightly stylized proportions (Disney/Pixar adjacent) — head slightly larger than realistic, expressive features, appealing silhouette
- Warm, approachable character design language — this is NOT hyper-realistic, NOT anime, NOT cartoon
- Emphasis on personality through pose and expression rather than detail
- Clean silhouette readability — you can tell who this person is from their outline alone

**Overall Feel:**
- "Animation pre-production character design sketch" — like a page from a Disney animator's sketchbook or a "making of" art book
- The aesthetic says "this is a drawing by a skilled human animator," NOT "this is a computer-generated image"
- Warm, crafted, analog quality

## What to Build

Create the skill at: `.claude/skills/gemini-pencil-animation-image-gen/`

### Directory Structure

```
gemini-pencil-animation-image-gen/
├── SKILL.md
├── scripts/
│   └── generate_image.py       (copy from gemini-pixel-image-gen — same script, same API)
└── references/
    └── pencil-animation-prompt-templates.md
```

### SKILL.md Requirements

Follow the **skill-system-mastery** mandatory section order exactly:

1. **YAML frontmatter** — `name: gemini-pencil-animation-image-gen` with trigger phrases for "pencil animation", "pencil test", "animation sketch", "character design sketch", "pencil drawing", "animation production art", "traditional animation style"
2. **Purpose** — Generate character designs, expression sheets, pose studies, turnaround sheets, and scene compositions in the traditional animation pencil test style using the Gemini API
3. **When to Use** — bullet list of trigger situations
4. **Examples** — 2-3 user/Claude dialog exchanges
5. **Prerequisites** — same as gemini-pixel-image-gen (API key, google-genai, Pillow)
6. **How It Works** — same Python script pipeline
7. **Script Usage** — same flags (--output, --aspect-ratio, --remove-bg, --resize, --env-file, --model defaults to gemini-3.1-flash-image-preview)
8. **Prompt Construction Workflow** — reference the templates file, reference the `image-generator-prompt-science` skill for the 7-Layer Prompt Framework
9. **Success Criteria** — testable checklist specific to pencil animation style
10. **Copy/Paste Ready** — natural language trigger phrases

### generate_image.py

**Use the exact same script from gemini-pixel-image-gen.** Same API call, same flags, same base64 handling, same --remove-bg and --resize post-processing. The only difference between skills is the prompt content and templates — the generation pipeline is identical.

Read the existing script at `.claude/skills/gemini-pixel-image-gen/scripts/generate_image.py` and copy it.

### references/pencil-animation-prompt-templates.md

**This is the most important file.** Use the `image-generator-prompt-science` skill's 7-Layer Prompt Framework to build each template. Read that skill first at `.claude/skills/image-generator-prompt-science/SKILL.md`.

Create these templates:

**Template 1: Character Design from Reference Photo**
For generating a pencil animation-style character based on a real person's photo. Should capture distinguishing features (hair, build, clothing style) translated into the slightly stylized animation proportions. Must include the paper texture, production label, and hole-punch details.

**Template 2: Expression Sheet**
A single sheet with 6-9 facial expressions of the same character arranged in a grid. Expressions like: neutral, happy, thinking, surprised, frustrated, determined, laughing, skeptical. Identity must stay consistent across all expressions. Include the production label convention.

**Template 3: Pose Study / Action Sheet**
Multiple full-body poses of the same character on one sheet: standing, sitting, walking, typing at desk, leaning, pointing, etc. Useful for establishing a character's body language and movement vocabulary.

**Template 4: Turnaround Sheet**
Front, 3/4, side profile, 3/4 back, and back views of a character arranged in a horizontal lineup. Critical for character consistency — proportions, height, and details must match across all views.

**Template 5: Scene Composition Sketch**
A full scene with one or more characters in an environment (e.g., "two characters at a coffee shop," "character working at a desk in a command center"). More illustrative, still in the pencil test style, with minimal environment detail and emphasis on character interaction.

**Template 6: Character Comparison Lineup**
Multiple different characters standing side-by-side for height/proportion comparison. Used when designing a cast of characters to ensure they're visually distinct and properly scaled relative to each other.

### Style Cluster (Include in Every Template)

Based on the reference image, define this style cluster and include it (or a reference to it) in every template:

```
Style: Traditional animation pencil test drawing. Hand-drawn graphite pencil lines
on warm cream animation paper. Lines are warm gray (NOT black) with natural
stroke-weight variation — thicker on contour outlines (~2-3px equivalent),
thinner on interior details (~1px equivalent). Visible construction line
artifacts beneath the final drawing. Subtle cross-hatching for shading on
clothing folds and shadow areas.

Color: Extremely limited, desaturated flat color fills layered over the pencil
drawing. Pencil lines remain visible through and on top of color. Colors are
muted and natural — no saturated or vibrant tones.

Paper: Warm cream/off-white background with visible paper grain texture. Three
hole-punch marks at the bottom edge. A hand-written production label in the
top-left corner (e.g., "A-[NUMBER]"). Subtle aging marks and dust specks.

Character proportions: Slightly stylized (Disney/Pixar pre-production adjacent).
Head slightly larger than realistic, expressive features, appealing proportions.
Clean silhouette readability.

Negatives: No vector-clean lines. No solid black outlines. No cel shading. No
anime style. No heavy color saturation. No digital painting look. No gradient
shading. Must look hand-drawn by a professional animator, not computer-generated.
```

### Prompt Refinement Tips Section

Include a section in the templates file with fixes for common Gemini issues specific to this style:
- "If the output looks too digital/clean" → reinforce the hand-drawn, sketchy quality
- "If the lines are too black/heavy" → specify warm gray graphite, not ink
- "If the colors are too saturated" → add explicit desaturation constraints
- "If the paper texture is missing" → describe the animation paper with hole-punch marks
- "If the character looks like anime/cartoon" → anchor to "Disney/Pixar pre-production" not "cartoon"
- "If construction lines are missing" → ask for "visible guide lines and construction marks beneath the final drawing"

## Important Notes

- **The attached reference image is the visual source of truth.** Study it before writing any templates. Every template should reproduce this exact aesthetic.
- **Use the `image-generator-prompt-science` skill** (located at `.claude/skills/image-generator-prompt-science/SKILL.md`) to structure your prompt templates using the 7-Layer Framework
- **The Python script is identical** to gemini-pixel-image-gen — copy it, don't rewrite it
- **Model name is `gemini-3.1-flash-image-preview`** (Nano Banana 2) — this is the default in the script
- **Read the existing gemini-pixel-image-gen skill** for structural reference — your skill should follow the same SKILL.md structure and section order, just with different art style content
- **Save all files to:** `.claude/skills/gemini-pencil-animation-image-gen/`
