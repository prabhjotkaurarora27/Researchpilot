/**
 * Benchmark sample dataset for ResearchPilot demonstrations & instant testing.
 * Topic: Modern LLM Scaling, Compute Optimality, and Emergent Abilities.
 */

export const SAMPLE_SOURCES = [
  {
    id: 101,
    url: 'https://arxiv.org/abs/2001.08361',
    domain: 'arxiv.org',
    status: 'done',
    credibility: {
      score: 96,
      tier: 'high',
      label: 'Peer Reviewed',
      factors: ['ArXiv CS.CL', 'OpenAI Research', '14,000+ citations'],
    },
    extracted_data: {
      title: 'Scaling Laws for Neural Language Models',
      source_type: 'paper',
      publish_date: '2020-01-23',
      core_claim: 'Cross-entropy loss scales as a power law with model parameter count, dataset size, and total compute budget across many orders of magnitude.',
      key_stats: [
        'Loss scales as power law over 7 orders of magnitude in compute',
        'Parameter count (N) recommended to scale faster than tokens (D)',
        'Optimal ratio: 73% compute to parameters, 27% to dataset size',
      ],
      methodology: 'Empirical scaling sweeps across 10M to 1.5B parameters on WebText.',
      sample_size: 'WebText dataset (40GB)',
    },
    raw_content: 'We investigate empirical scaling laws for language model performance with cross-entropy loss. The loss scales as a power-law with model size, dataset size, and the amount of compute used for training, with some architectural hyperparameters having negligible impact.',
  },
  {
    id: 102,
    url: 'https://arxiv.org/abs/2203.15556',
    domain: 'arxiv.org',
    status: 'done',
    credibility: {
      score: 98,
      tier: 'high',
      label: 'Top Tier Lab',
      factors: ['DeepMind Research', 'NeurIPS Oral', 'Foundational Paper'],
    },
    extracted_data: {
      title: 'Training Compute-Optimal Large Language Models (Chinchilla)',
      source_type: 'paper',
      publish_date: '2022-03-29',
      core_claim: 'Current large language models are significantly undertrained; model size and number of training tokens should be scaled in equal proportion.',
      key_stats: [
        'Model size and training tokens should scale in 1:1 proportion',
        '70B Chinchilla outperforms 175B GPT-3 with 4x fewer parameters and 4x more tokens',
        'Evaluated across 400+ model runs from 70M to 16B parameters',
      ],
      methodology: 'Cosine learning schedule sweeps across 400+ model runs.',
      sample_size: 'MassiveWeb, C4, Books (1.4T tokens)',
    },
    raw_content: 'We assess the optimal model size and number of tokens for training a transformer language model under a given compute budget. We find that current large models are considerably undertrained, a consequence of the hypothesis that model size should increase faster than token count.',
  },
  {
    id: 103,
    url: 'https://arxiv.org/abs/2304.15004',
    domain: 'arxiv.org',
    status: 'done',
    credibility: {
      score: 94,
      tier: 'high',
      label: 'Academic Review',
      factors: ['Stanford University', 'NeurIPS Best Paper Award', 'Rigorous Metric Analysis'],
    },
    extracted_data: {
      title: 'Are Emergent Abilities of Large Language Models a Mirage?',
      source_type: 'paper',
      publish_date: '2023-04-28',
      core_claim: 'Emergent abilities appear sharp and unpredictable primarily due to non-linear discontinuous evaluation metrics chosen by researchers, rather than abrupt fundamental transitions in underlying model capabilities.',
      key_stats: [
        'Sharp transitions convert to smooth linear curves under continuous metrics (e.g., Brier score)',
        'Analyzed BIG-bench emergence across 100+ tasks',
        'Discontinuous accuracy metrics artificially induce apparent phase transitions',
      ],
      methodology: 'Mathematical reformulations of evaluation metrics across BIG-bench tasks.',
      sample_size: 'BIG-bench benchmark suite',
    },
    raw_content: 'Recent work claims that large language models display emergent abilities that are not present in smaller models. Here, we present an alternative explanation: that emergent abilities appear due to the researcher’s choice of metric rather than changes in the model’s performance with scale.',
  },
  {
    id: 104,
    url: 'https://anthropic.com/research/mapping-mind-language-model',
    domain: 'anthropic.com',
    status: 'done',
    credibility: {
      score: 93,
      tier: 'high',
      label: 'Frontier Lab',
      factors: ['Anthropic Interpretability Team', 'Direct Activation Probing'],
    },
    extracted_data: {
      title: 'Mapping the Mind of a Large Language Model',
      source_type: 'report',
      publish_date: '2024-05-21',
      core_claim: 'Dictionary learning using sparse autoencoders identifies millions of interpretable, monosemantic feature directions in production models corresponding to abstract concepts.',
      key_stats: [
        'Extracted >10 million interpretable features in Claude 3 Sonnet',
        'Features generalize across multimodal representations (text and imagery)',
        'Activation clamping directly steers behavioral safety and factual output',
      ],
      methodology: 'Sparse Autoencoders (SAEs) applied to middle residual stream layers.',
      sample_size: 'Claude 3 Sonnet middle-layer activations',
    },
    raw_content: 'We apply dictionary learning to extract interpretable features from Claude 3 Sonnet. We find monosemantic representations corresponding to vast abstract concepts, cities, security vulnerabilities, and philosophical doctrines, demonstrating that internal representations are structured rather than uninterpretable black boxes.',
  },
];

export const SAMPLE_SYNTHESIS = {
  summary_oneline:
    'While scaling compute yields smooth, power-law reductions in cross-entropy loss [S1] [S2], the apparent sudden "emergence" of higher-order abilities is largely a metric artifact [S3], even as internal activations organize into structured conceptual feature spaces [S4].',
  summary_paragraph:
    'Language model performance scales predictably with compute across multiple orders of magnitude [S1] [S2]. However, there is a fundamental divergence regarding allocation: early work favored scaling model parameters heavily [S1], whereas subsequent compute-optimal analysis proved that parameter size and dataset token count must be scaled in equal 1:1 proportion [S2]. Concurrently, mathematical analysis reveals that abrupt "emergent jumps" on benchmark suites are an optical illusion of non-linear scoring metrics [S3], although mechanistic interpretability confirms that internal representations develop rich, monosemantic conceptual topologies as capacity grows [S4].',
  summary_full: `## Theoretical Convergence: Compute Dominance
Both OpenAI and DeepMind empirical studies confirm that language modeling cross-entropy loss decreases monotonically as a power law when overall compute is increased [S1] [S2]. Across seven orders of magnitude, architectural changes (depth vs. width, attention head counts) exert minor influence compared to raw floating-point operations (FLOPs).

## Critical Methodological Contradiction: The Token-to-Parameter Ratio
A decisive contradiction exists between Kaplan et al. [S1] and Hoffmann et al. [S2]. Kaplan et al. argued that parameters should increase ~3x faster than training tokens for optimal compute allocation [S1]. Chinchilla [S2] demonstrated that this finding was biased by suboptimal learning rate schedules; when corrected, model parameters and token counts should scale at an exact 1:1 ratio. Consequently, models like GPT-3 (175B) were severely data-starved compared to modern compute-optimal baselines.

## Latent Connection: Metric Discontinuity vs. Representational Structure
While Schaeffer et al. demonstrate that sudden performance thresholds on downstream benchmarks are artifacts of discontinuous accuracy thresholds [S3], Anthropic's sparse autoencoder investigations show that underlying feature representations do indeed accumulate richer, higher-dimensional abstractions as model capacity expands [S4]. The smoothness of cross-entropy scaling [S1] [S2] aligns with continuous metric curves [S3], explaining why capabilities develop smoothly even when benchmark accuracy looks like a step function.`,
  consensus: [
    {
      point: 'Cross-entropy loss follows strict power-law scaling with compute across multiple orders of magnitude [S1] [S2]',
      citations: [1, 2],
      citation_passages: {
        '1': 'The loss scales as a power-law with model size, dataset size, and the amount of compute used for training, with some architectural hyperparameters having negligible impact.',
        '2': 'We assess the optimal model size and number of tokens for training a transformer language model under a given compute budget, confirming empirical power-law relationships.',
      },
      explanation: 'Both research groups independently validated that training compute is the supreme predictor of language modeling loss.',
    },
    {
      point: 'Language models consistently exhibit continuous internal capability growth with scale, refuting arbitrary architectural bottlenecks [S1] [S3] [S4]',
      citations: [1, 3, 4],
      citation_passages: {
        '1': 'Performance has a smooth power-law dependence on compute, showing no signs of plateauing or abrupt disruption within tested ranges.',
        '3': 'When changing from discontinuous metrics to continuous metrics, the transition changes from sharp and unpredictable to smooth and predictable.',
        '4': 'We find monosemantic representations corresponding to vast abstract concepts that progressively resolve with model scale.',
      },
      explanation: 'All three sources contradict the popular narrative that scale introduces magical unpredictable phase changes.',
    },
  ],
  contradictions: [
    {
      point: 'Optimal compute allocation: Parameters over tokens [S1] vs. strict 1:1 parameter-to-token proportionality [S2]',
      citations: [1, 2],
      citation_passages: {
        '1': 'Parameter count (N) recommended to scale faster than tokens (D): 73% of compute increase to parameters, 27% to dataset size.',
        '2': 'We find that model size and training tokens should be scaled in equal proportion (1:1), showing that previous models were considerably undertrained.',
      },
      explanation: 'A fundamental disagreement in AI engineering that altered the entire industry trajectory from giant sparse models to denser, token-heavy training (Chinchilla, Llama).',
    },
    {
      point: 'Novel capability onset: Abrupt discontinuous emergence [S1] vs. artifact of metric selection [S3]',
      citations: [1, 3],
      citation_passages: {
        '1': 'Larger models exhibit qualitative capability leaps on composite tasks that are near zero in smaller models.',
        '3': 'Emergent abilities appear due to the researcher’s choice of metric rather than changes in the model’s performance with scale.',
      },
      explanation: 'Contradiction on whether complex reasoning abilities materialize spontaneously at scale or evolve smoothly along continuous evaluation curves.',
    },
  ],
  connections: [
    {
      point: 'Continuous metric scaling explains the smooth formation of monosemantic feature dictionaries in deep networks [S3] [S4]',
      citations: [3, 4],
      citation_passages: {
        '3': 'When evaluated under continuous probability metrics (Brier score or cross-entropy), capability curves are strictly continuous and monotonic.',
        '4': 'Dictionary learning extracts millions of interpretable features that activate linearly with conceptual relevance.',
      },
      explanation: 'Connects mathematical evaluation theory with empirical mechanistic interpretability: internal feature geometry grows incrementally, explaining why continuous metrics predict behavior far better than pass/fail benchmarks.',
    },
    {
      point: 'Under-trained models retain un-disentangled feature representations that mask true capacity [S2] [S4]',
      citations: [2, 4],
      citation_passages: {
        '2': 'Given a fixed compute budget, under-trained models suffer from high parameter redundancy and wasted capacity.',
        '4': 'Activation steering demonstrates that feature purity and concept isolation improve dramatically when token training budgets are sufficient.',
      },
      explanation: 'Suggests that token saturation is essential for sparse autoencoders to isolate clean monosemantic features without polysemantic superposition.',
    },
  ],
  suggested_questions: [
    'Why did Kaplan et al. conclude that parameters should scale 3x faster than tokens, and how did Hoffmann et al. disprove it?',
    'If emergence is a metric illusion [S3], why do safety-critical vulnerabilities appear suddenly in jailbreak benchmarks?',
    'How does token saturation [S2] affect the interpretability of sparse autoencoder feature dictionaries [S4]?',
  ],
};

export const SAMPLE_MATRIX = [
  {
    dimension: 'Core Scaling Thesis',
    divergent: true,
    cells: {
      1: 'Scale parameters 3x faster than tokens (73% compute to N)',
      2: 'Scale parameters and tokens in strict 1:1 proportion',
      3: 'Downstream emergence is an optical illusion of non-linear scoring',
      4: 'Internal geometry resolves into discrete monosemantic concepts',
    },
  },
  {
    dimension: 'Experimental Methodology',
    divergent: false,
    cells: {
      1: 'Power-law sweeps on WebText (10M - 1.5B parameters)',
      2: 'Cosine LR schedule sweeps across 400+ runs (70M - 16B parameters)',
      3: 'Mathematical re-evaluation of BIG-bench accuracy curves',
      4: 'Sparse Autoencoders on Claude 3 Sonnet residual streams',
    },
  },
  {
    dimension: 'Primary Training Dataset',
    divergent: true,
    cells: {
      1: 'WebText (40GB scraped web text)',
      2: 'MassiveWeb, C4, GitHub, Books (1.4 Trillion tokens)',
      3: 'BIG-bench & MMLU evaluation suites',
      4: 'Proprietary multimodal web & synthetic reasoning corpus',
    },
  },
  {
    dimension: 'Model Efficiency Implication',
    divergent: true,
    cells: {
      1: 'Larger models are more sample-efficient; train big, stop early',
      2: 'Smaller models trained on vastly more tokens yield superior inference economics',
      3: 'Evaluate models using continuous probability losses, not binary step functions',
      4: 'Safety interventions can be executed via direct feature clamping without fine-tuning',
    },
  },
  {
    dimension: 'Peer Verification',
    divergent: false,
    cells: {
      1: 'OpenAI Tech Report (ArXiv 2020)',
      2: 'DeepMind / NeurIPS 2022',
      3: 'Stanford / NeurIPS 2023 Best Paper',
      4: 'Anthropic Research Publication (2024)',
    },
  },
];
