// Image-editing models shown in Card 3. Same pattern as PHOTOBOOTH_STYLES:
// one object per model. Add a new model by pasting another object into the
// array below — no layout work, the renderer styles it automatically.
//
// All models use the same generator/worker (currently openai/gpt-image-2);
// this file is purely the information/display side.

export type EditorModelId =
  | "openai/gpt-image-2"
  | "seedream-5-lite"
  | "flux-2-max";

export type ModelSection = {
  heading: string;
  paragraphs?: string[];
  items?: { term: string; text: string }[];
};

export type EditorModel = {
  id: EditorModelId;
  label: string; // pill text in the header
  title: string; // big heading at the top of the body
  description: string; // intro paragraph
  sections: ModelSection[];
};

export const EDITOR_MODELS: EditorModel[] = [
  {
    id: "openai/gpt-image-2",
    label: "GPT Image 2",
    title: "GPT Image 2",
    description:
      "GPT Image 2 represents OpenAI's most advanced tier of image generation technology. It allows you to synthesize brand-new imagery from textual prompts or modify pre-existing files with pinpoint, instruction-guided accuracy.",
    sections: [
      {
        heading: "Core Workflows",
        paragraphs: [
          "The model operates across two primary pipelines: generating original visuals from descriptive text, and refining existing assets using explicit directions. It is engineered to adhere strictly to your guidelines while leaving designated areas completely unaltered.",
          "When source images are provided, the system analyzes them at maximum resolution automatically without requiring manual configuration. The architecture inherently maximizes detail retention from your inputs.",
        ],
        items: [
          { term: "To modify an image:", text: "Provide a single reference file." },
          {
            term: "To merge concepts:",
            text: "Provide multiple files to blend distinct styles, subjects, or visual elements into a unified output.",
          },
        ],
      },
      {
        heading: "Technical Advantages",
        items: [
          {
            term: "Lifelike Textures & Realism:",
            text: "Produces highly authentic imagery featuring accurate illumination, realistic material physics, and intricate surface details—ranging from raw, candid snapshots to high-end corporate media.",
          },
          {
            term: "Accurate Graphic Typography:",
            text: "Capable of rendering compact lettering, dense paragraphs, and structured layouts such as interface designs, information graphics, and promotional flyers.",
          },
          {
            term: "Localized Modifications:",
            text: "Executes pinpoint alterations without reconstructing the entire canvas. The system maintains character identity, overall layout, and environmental lighting while adjusting only the specified regions.",
          },
          {
            term: "Aesthetic Alignment:",
            text: "Enforces uniform artistic styling across varied content or migrates the visual theme of a reference image onto a new subject with minimal instruction.",
          },
          {
            term: "Contextual Intelligence:",
            text: 'Understands historical and cultural references natively. Requesting a backdrop of "Bethel, New York in August 1969" triggers the system\'s internal knowledge of the Woodstock festival.',
          },
        ],
      },
      {
        heading: "Primary Applications",
        items: [
          {
            term: "Creation —",
            text: "Perfect for designing logos, application mockups, instructional graphics, hyper-realistic photography, graphic novels, and advertising assets. Ideal for conceptual brainstorming or final production assets.",
          },
          {
            term: "Modification —",
            text: "Supports thematic filtering, digital apparel fittings, commercial product mockups, translating text within graphics, altering light sources, deleting unwanted items, and merging distinct layers. You can transplant individuals into novel environments while keeping their facial features identical, or swap out interior decor without shifting the camera's perspective.",
          },
          {
            term: "Narrative Continuity —",
            text: "Enables the creation of multi-frame projects where a specific character retains a uniform appearance across diverse backgrounds—perfect for animated storyboarding, children's literature, and marketing initiatives.",
          },
        ],
      },
      {
        heading: "Optimization Guide",
        items: [
          {
            term: "Provide Explicit Guidance:",
            text: 'Offer definitive descriptions rather than vague commands. Swap out generic phrases like "enhance this" for targeted notes like "introduce gentle coastal morning light" or "transform the crimson cap into cyan velvet."',
          },
          {
            term: "Employ Photographic Terminology:",
            text: 'To achieve true lifelike quality, specify camera settings, environmental lighting, and composition. Phrases like "captured on a 50mm lens, diffused morning sun, narrow depth of field" yield far more authentic results than ambiguous buzzwords.',
          },
          {
            term: "Define Protected Elements:",
            text: 'When performing edits, state exactly what must remain untouched. For example: "Alter the ambient lighting exclusively; do not modify the model\'s expression, posture, or attire."',
          },
          {
            term: "Isolate Display Text:",
            text: 'When adding legible words into a design, place the exact phrasing within "quotation marks" and specify the font characteristics (e.g., "heavyweight sans-serif, centered alignment, high-contrast palette").',
          },
          {
            term: "Modify Progressively:",
            text: "Establish a foundational image first, then apply incremental, step-by-step adjustments rather than overhauling the entire prompt at once.",
          },
          {
            term: "Index Multiple References:",
            text: 'When feeding several source files into the system, tag them numerically and explain their interactions explicitly (e.g., "Imbue the artistic theme of image 1 onto the individual shown in image 2").',
          },
        ],
      },
      {
        heading: "⚠️ Key Technical Constraints",
        items: [
          {
            term: "Alpha Channels:",
            text: "GPT Image 2 does not generate transparent backgrounds.",
          },
        ],
      },
    ],
  },
  {
    id: "seedream-5-lite",
    label: "Seedream 5.0 Lite",
    title: "Seedream 5.0 Lite",
    description:
      "Seedream 5.0 Lite introduces multi-stage intelligence, visual learning, and deep domain expertise to deliver production-ready, ultra-high-definition designs.",
    sections: [
      {
        heading: "Next-Generation Design Capabilities",
        items: [
          {
            term: "Visual Learning (Before & After):",
            text: 'You don\'t have to struggle to describe complex changes in words. Simply upload a "before and after" example pair alongside your target image. The system analyzes the transformation—like swapping materials, textures, or art styles—and applies it perfectly to your new design.',
          },
          {
            term: "Physical & Spatial Logic:",
            text: "The engine inherently understands physics, balance, and real-world mechanics. It accurately renders correct weight distributions, realistic clock face alignments, and precise environmental proportions without distortions.",
          },
          {
            term: "Professional Industry Standards:",
            text: "Built with deep, specialized knowledge across architecture, science, health, and commercial design. It can instantly translate a basic blueprint sketch into a photorealistic interior rendering, or produce highly detailed, accurate schematics.",
          },
        ],
      },
      {
        heading: "Performance & Delivery",
        items: [
          {
            term: "Ultra-High Definition:",
            text: "Engineered exclusively to output pristine, ultra-definition visual assets.",
          },
          {
            term: "Dual-Image Inputs:",
            text: "Supports a maximum upload of 2 reference or style images per request to guide your modifications.",
          },
          {
            term: "High-Volume Output:",
            text: "Generates up to 10 conceptually aligned images at once—perfect for building matching storyboards, comprehensive brand packages, or consistent character sheets in a single click.",
          },
          {
            term: "Flawless Typography:",
            text: "Seamlessly handles multi-lingual text and typography layout integrations directly inside your graphics.",
          },
          {
            term: "Premium Exports:",
            text: "Delivers crisp, studio-ready files in native PNG or JPEG formats.",
          },
        ],
      },
    ],
  },
  {
    id: "flux-2-max",
    label: "FLUX.2 [max]",
    title: "FLUX.2 [max]",
    description:
      "FLUX.2 [max] represents the absolute peak of image synthesis and editing technology from Black Forest Labs. Engineered for elite-tier production, this model delivers maximum performance, flawless visual quality, and unmatched consistency across complex design workflows.",
    sections: [
      {
        heading: "The Apex of Image Editing & Consistency",
        paragraphs: [
          "This model is built specifically for scenarios that require absolute precision, offering the highest success rate in the industry for complex, multi-reference modifications. It preserves lighting, textures, facial geometries, and core product shapes with perfect fidelity.",
        ],
        items: [
          {
            term: "Multi-Reference Character Continuity:",
            text: "Lock down identities, specific products, or complex styles across massive design batches. By utilizing up to 10 distinct reference images, you can place the exact same face or product mockup across dozens of completely different environments or dynamic editorial layouts without losing identity details.",
          },
          {
            term: "Studio-Grade Product Transformations:",
            text: "instanly upgrade casual, low-quality mobile photos into high-end, production-ready commercial assets optimized for top-tier marketplaces.",
          },
          {
            term: "Precise Hex-Code Color Control:",
            text: "Generate systematic, flawless color variations of products with extreme accuracy by using literal hex color codes directly in your workflow.",
          },
          {
            term: "Single-Image 3D Reconstruction:",
            text: "Synthesize entirely new 3D perspective views of a scene from just a single original photograph or a small set of references, enabling virtual tours of physical or imagined spaces.",
          },
          {
            term: "Cinematic Pre-Visualization:",
            text: "Create motion-picture-quality keyframes and storyboard panels that preserve exact character likenesses and subtle emotional expressions from frame to frame.",
          },
        ],
      },
      {
        heading: "Core Operational Advantages",
        items: [
          {
            term: "Flawless Intent Comprehension",
            text: "Features best-in-class adherence to instructions, effortlessly decoding both short, direct commands and highly layered, complex descriptive briefs more accurately than any previous engine.",
          },
          {
            term: "Infinite Creative Exploration",
            text: "Engineered with enhanced artistic variety. When generating batches from a single description, the model produces highly diverse, unique concepts where no two layouts look identical—while still strictly respecting your core parameters.",
          },
          {
            term: "Rapid Production Velocity",
            text: "Despite massive breakthroughs in structural detail and editing precision, the engine runs at accelerated speeds, generating premium content up to three times faster than competing models of equivalent quality.",
          },
        ],
      },
    ],
  },
];

export const findEditorModel = (id: string): EditorModel | undefined =>
  EDITOR_MODELS.find((model) => model.id === id);
