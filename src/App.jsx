import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";

const DV = {
  black:"#09101C", navy:"#112040", navyMd:"#172C56", cobalt:"#1B3490",
  blue:"#1D6FCA", teal:"#00C2D4", white:"#FFFFFF", bg:"#F0F4F8",
  card:"#FFFFFF", border:"#D8E4F0", text:"#0D1B2A", sub:"#4A5568",
  slate:"#6B7C93", mint:"#22A04A", amber:"#F59E0B", coral:"#EF4444",
  revBg:"#EAF3EC", costBg:"#FFF7E6",
};
const CSS = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:system-ui,-apple-system,sans-serif;background:${DV.bg};}
  @keyframes slide{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .step{animation:slide .3s ease;}
  .opt:not([data-locked]):hover{border-color:${DV.blue}!important;background:#EBF2FF!important;cursor:pointer;}
  .uc-bar:hover{opacity:.85;cursor:pointer;}
  .uc-bar{transition:opacity .15s;}
  .tab:hover{background:rgba(255,255,255,.1)!important;}
`;

// ── Data ─────────────────────────────────────────────────────────────────────
const INTRO = {
  id:"intro", type:"intro",
  problems:[
    {t:"Evidence gaps post-completion", b:"Clinical trials don't answer long-term safety, durability, HCRU, or cost questions. Teams rely on long-term extension (LTE) studies or wait years for post-launch data."},
    {t:"Costly site follow-up", b:"LTE studies require continued site and patient engagement, which is expensive and burdensome, with significant risk of loss to follow-up."},
    {t:"Disconnected trial & RWD context", b:"The breadth of baseline data collected in a clinical trial is informed by anticipated needs. Linking to longitudinal RWD unlocks historical data on medical and treatment history and healthcare resource utilization, which improves interpretation of trial results."},
    {t:"High-stake questions arriving late", b:"Safety or representativeness concerns often surface near submission. Early trial tokenization and linkage better place clients to address these concerns in a timely fashion."},
  ],
};

const USE_CASES = [
  {
    id:"uc1", type:"usecase", num:1, emoji:"📅",
    title:"Long-Term Follow-Up",
    sub:"Follow patients after trial completion via RWD",
    timing:"After trial completion",
    how:{
      subtitle:"Follow trial patients into routine care to capture post-trial safety, durability and HCRU.",
      example:"link an NSCLC trial cohort to mortality and claims data to measure overall survival, next-line treatment and hospital use after the trial.",
      flow:[
        {emoji:"🗂️",label:"INPUT",sub:"Data linked",items:[
          "Tokenized US trial participants — treatment arms/exposure, dates, endpoints",
          "Real-world data: open/closed claims, EHR / labs, mortality",
        ]},
        {emoji:"⚙️",label:"WHAT DATAVANT DOES",sub:"Datavant solutions",items:[
          {t:"Link trial participants to post-trial RWD",d:"Connect trial-defined patients to routine-care data after follow-up ends."},
          {t:"Contextualize long-term outcomes",d:"Benchmark outcomes against trial-similar or indicated patient populations using RWD."},
          {t:"Generate post-trial evidence",d:"Measure post-trial effectiveness and safety outcomes, treatment patterns, HCRU and healthcare costs."},
        ]},
        {emoji:"📈",label:"OUTPUT",sub:"Evidence generated",items:[
          "Post-trial safety, durability, treatment patterns",
          "HCRU and cost",
          "Mortality / overall survival",
        ],purpose:"For payer / HTA, regulatory and safety decisions."},
      ],
      bottomLine:"One linked cohort — reused across many evidence questions, without re-linking each time.",
    },
    headline:"Follow trial patients into routine care to capture long-term safety, HCRU and durability evidence",
    rwdWhy:"Passively follow trial participants through routine care to efficiently capture long-term safety, HCRU, and durability evidence. Used today as a complement to traditional methods, RWD linkage extends evidence generation beyond the protocol — and may reduce reliance on site-based LTEs over time.",
    challenges:[
      "Once a trial protocol ends, sponsors lose visibility of how patients fare in routine care",
      "Clinical trials leave long-term safety, HCRU, and durability evidence unanswered",
      "Site-based LTEs cost millions and are subject to poor generalizability due to participant selection and loss-to-follow-up challenges",
      "Waiting for post-launch accrual delays payer and HTA evidence by 18–24 months",
    ],
    without:[
      "Maintain costly site follow-up for years post-trial",
      "Wait 18–24 months for real-world treated patients to accrue post-launch",
      "Rely on chart retrieval — high-touch, manual, and impossible to scale",
      "Start from scratch for each LTE study",
    ],
    with:[
      "Link tokenized trial participants to claims/EHR/mortality immediately at trial completion",
      "Start evidence generation earlier — no need to wait for post-launch accrual",
      "Reuse one linked trial-RWD cohort across multiple evidence generation studies",
      "Build a reusable data foundation across the full portfolio",
    ],
    value:{ levers:[
      {name:"HEOR efficiency",type:"cost",feasibility:"High",detail:"Reuse one linked cohort across multiple analyses — avoid repeated linkage and study setup"},
      {name:"LT Outcome completeness",type:"cost",feasibility:"High",detail:"Claims and EHR fill evidence gaps beyond trial follow-up"},
      {name:"Lower LTE cost",type:"cost",feasibility:"Medium",detail:"Replace site follow-up with routine-care data for eligible long-term outcomes"},
      {name:"Expanded payer access",type:"rev",feasibility:"Low",detail:"Durability, HCRU, and cost evidence strengthens payer and HTA story"},
    ]},
    discoveryQs:[
      "When your trial reaches completion, what's your current plan for capturing long-term safety and HCRU evidence?",
      "How long does it typically take your team to stand up a post-launch real-world evidence study after trial completion?",
      "Are you planning any long-term extension (LTE) studies for current trials? What's driving that decision over an RWD approach?",
    ],
    quizzes:[
      {
        q:"A Phase III cardiovascular trial has just reached completion. The sponsor needs payer-ready HCRU and durability evidence. What does Datavant trial tokenization and RWD linkage enable?",
        opts:["Wait 18–24 months for post-launch treated patients to accrue in RWD, then start a claims study","Extend the trial protocol with a 3-year site-based LTE","Link tokenized trial participants to claims/EHR/mortality after protocol follow-up ends to passively follow patients through routine care and collect data on their medical journey and health outcomes","Commission a systematic literature review of similar cardiovascular trials"],
        correct:2,
        explain:"LTFU tokenization links trial-defined patients to routine-care data (claims, EHR, mortality) immediately after protocol follow-up ends — starting evidence generation earlier than waiting for post-launch accrual, without running a separate LTE.",
      },
      {
        q:"A sponsor wants long-term safety and HCRU evidence soon after their trial ends. Why does linking the trial cohort to RWD generate it faster than a traditional post-launch RWD study?",
        opts:["Linked RWD updates in real time, so long-term outcomes are available the moment they occur","Regulators fast-track evidence from tokenized trial cohorts, shortening the review clock","The trial patients are already treated and identified, so linkage can start generating evidence right away — a post-launch study must first wait ~18–24 months for real-world patients to accrue on the drug","Tokenized cohorts need less data harmonization, so any analysis runs faster"],
        correct:2,
        explain:"The speed advantage is about the starting point, not the plumbing: the trial cohort has already received the drug, so linkage can begin immediately. A traditional post-launch study must first wait ~18–24 months for enough real-world patients to be treated and accrue outcomes. Claims latency, harmonization effort and regulatory timelines are not shortened by tokenization.",
      },
    ],
  },
  {
    id:"uc2", type:"usecase", num:2, emoji:"📊",
    how:{
      subtitle:"Assess whether enrolled trial participants reflect the intended protocol and target labelled population.",
      example:"link an enrolled heart-failure trial cohort to pre-trial claims and EHR, then compare age, comorbidities and prior therapy against an indicated real-world population to evaluate representativeness and inform regulator / HTA discussions.",
      flow:[
        {emoji:"🗂️",label:"INPUT",sub:"Data linked",items:[
          "Tokenized US trial participants — enrollment/baseline dates, arms/subgroups, eligibility criteria",
          "Real-world data: open/closed claims, EHR/labs, plus an external indicated cohort",
        ]},
        {emoji:"⚙️",label:"WHAT DATAVANT DOES",sub:"Datavant solutions",items:[
          {t:"Find the trial cohort in RWD",d:"Link tokenized participants to pre-trial RWD to understand their medical history."},
          {t:"Build a target-population benchmark",d:"Define an external indicated / intended-label cohort with comparable measures."},
          {t:"Quantify generalizability",d:"Compare RWD-measured baseline characteristics of participants against the benchmark to identify representativeness gaps."},
        ]},
        {emoji:"📈",label:"OUTPUT",sub:"Evidence generated",items:[
          "Evidence the enrolled population reflects the intended / labelled population",
          "Representativeness gaps by key subgroup — with post-hoc / sensitivity analyses to inform next steps",
        ],purpose:"For FDA, payer and HTA discussions — pre-empt underrepresentation concerns and support label defense."},
      ],
      bottomLine:"Understand representativeness early — and go into regulator / HTA discussions prepared, not reacting at submission.",
    },
    title:"Trial Representativeness",
    sub:"Show your cohort reflects the intended target (labelled) population",
    timing:"Mid-enrollment (50%, 75%) and at completion",
    headline:"Evaluate whether the enrolled trial population reflects the patient population who will be indicated to receive the drug, minimizing or helping to anticipate downstream regulatory requirements.",
    rwdWhy:"Linking the enrolled cohort to pre-trial RWD adds the longitudinal clinical history site reports lack — so teams can evaluate how well the enrolled population reflects the intended treated population, and spur post-hoc or sensitivity analyses to inform regulator and HTA discussions.",
    challenges:[
      "Site enrollment reports give limited clinical context — no longitudinal history",
      "Representativeness concerns from regulators, payers, and HTAs often surface near submission, when enrollment is locked",
      "Unaddressed gaps can trigger post-marketing requirements (PMRs) for subgroups",
    ],
    without:[
      "Rely on site reports with little longitudinal clinical context on enrolled patients",
      "Compare standardized CRF data vs. messy real-world measures — apples to oranges",
      "Get caught unprepared by a representativeness gap at submission review, with no chance to contextualize it",
    ],
    with:[
      "Link trial participants to pre-trial RWD for more comprehensive clinical and treatment history",
      "Measure both trial and RW cohort baseline characteristics in RWD for a true apples-to-apples comparison",
      "Surface representativeness gaps early — and spur post-hoc or sensitivity analyses to inform internal, regulatory and HTA discussions",
    ],
    value:{ levers:[
      {name:"Support label defense",type:"rev",feasibility:"Medium",detail:"Protect revenue tied to the proposed label by showing enrolled patients match the intended population"},
      {name:"Avoid sub-group PMR(C)",type:"cost",feasibility:"Medium",detail:"Avoid a post-marketing study by proactively addressing subgroup representativeness gaps"},
      {name:"Reduce approval friction",type:"cost",feasibility:"Low",detail:"Pre-empt external validity questions and prevent multi-month FDA review delays"},
    ]},
    discoveryQs:[
      "Has your regulatory team raised any concerns about enrollment representativeness for your labeled population?",
      "How do you currently assess whether your enrolled patients reflect your intended label population?",
      "Have you faced FDA comments about subgroup representativeness in past submissions?",
      "Do your payer or HTA teams have representativeness expectations you need to anticipate, not just FDA?",
    ],
    quizzes:[
      {
        q:"A sponsor's regulatory team is worried FDA may challenge their label population. When should Datavant's trial representativeness analysis ideally be run?",
        opts:["Only after FDA submission when regulators specifically request supporting evidence","Mid-way through enrollment (e.g., 50%, 75%) and at enrollment completion","At 100% enrollment","Only when a post-marketing requirement (PMR) is formally issued by FDA"],
        correct:1,
        explain:"Running the analysis mid-enrollment (50%, 75%) and at completion gives an early read on representativeness — time to prepare, run post-hoc / sensitivity analyses, and frame the story for regulators, payers and HTAs. Waiting until submission means gaps can only be raised reactively, risking multi-month review delays.",
      },
      {
        q:"Why link enrolled trial patients to their pre-trial real-world data?",
        opts:["To increase the trial's enrollment target","To see each patient's real-world clinical history and evaluate whether the enrolled population reflects the intended treated population","To replace the trial's case report forms","Because regulators require every trial to use real-world data"],
        correct:1,
        explain:"Linking to pre-trial RWD adds the longitudinal clinical history that site enrollment reports lack, so teams can evaluate — and, if needed, contextualize — how well the enrolled population reflects the intended treated population.",
      },
    ],
  },
  {
    id:"uc3", type:"usecase", num:3, emoji:"🛡️",
    how:{
      subtitle:"Use pre-trial RWD and external cohorts to contextualize unexpected safety imbalances when speed matters.",
      example:"an unexpected cardiac event rate shows up in an oncology trial — link patients to their pre-trial history to see whether they already carried higher baseline cardiac risk, and benchmark against a comparable real-world cohort.",
      flow:[
        {emoji:"🗂️",label:"INPUT",sub:"Data linked",items:[
          "Tokenized US trial participants — arm assignment/exposure, baseline dates, safety event definitions",
          "Real-world data: claims, EHR/labs, mortality, plus an external indicated cohort",
        ]},
        {emoji:"⚙️",label:"WHAT DATAVANT DOES",sub:"Datavant solutions",items:[
          {t:"Assess arm-level baseline risk",d:"Compare participants' pre-trial RWD across trial arms to find imbalance drivers not captured on CRFs."},
          {t:"Contextualize expected event rates",d:"Use a comparable external cohort to estimate background rates for the observed imbalance."},
          {t:"Prepare a rapid-response package",d:"Pre-map sources, definitions and harmonization so teams can respond in weeks."},
        ]},
        {emoji:"📈",label:"OUTPUT",sub:"Evidence generated",items:[
          "Whether a safety imbalance reflects baseline risk vs. treatment effect",
          "Real-world background rates for the event",
          "A traceable, ready-to-run evidence package",
        ],purpose:"For fast, credible responses to regulators — protecting trial momentum."},
      ],
      bottomLine:"Turn a safety fire drill into a fast, evidence-based answer — because the linkage is already in place.",
    },
    title:"Safety Contextualization",
    sub:"Contextualize unexpected safety signals fast",
    timing:"At 100% enrollment, interim and final analyses",
    headline:"Contextualize unexpected safety signals in weeks — not months — before they become program-threatening delays.",
    rwdWhy:"RWD linkage helps two ways: it lets you measure the trial population's real-world baseline risk, and it lets you build and confirm a comparable external cohort. Establishing that linkage in advance means you can contextualize an unexpected signal in weeks rather than starting data access from scratch.",
    challenges:[
      "Baseline data in the CRF may be too limited to tell whether a surprise safety difference reflects pre-existing patient differences",
      "A generic external benchmark may not be comparable to your trial population's real-world risk profile",
      "Without pre-established linkage, there's no fast way to tell whether a signal reflects the drug or the patients",
      "Starting RWD linkage only after a signal surfaces loses weeks in data access and harmonization",
    ],
    without:[
      "You can't tell if a surprise safety difference is caused by the drug or by patients who were sicker to begin with",
      "Off-the-shelf benchmarks may not look like your trial patients, so comparisons are easy to challenge",
      "After a signal appears, it takes weeks to get data access, link it, and line up definitions",
      "Enrollment can sit on hold while the response is assembled",
    ],
    with:[
      "See each patient's real-world history before the trial, so you can check whether baseline risk — not the drug — explains a signal",
      "Build and confirm an external cohort that actually resembles your trial population",
      "Because linkage is set up in advance, respond to regulators in weeks, not months",
      "Show whether a safety difference reflects patient baseline risk or a true treatment effect",
    ],
    value:{ levers:[
      {name:"Program protection",type:"rev",feasibility:"Medium",detail:"Evaluate whether a safety difference is treatment-related or related to unanticipated differences in patient baseline characteristics, protecting the program from avoidable delay or narrowing"},
      {name:"Avoid enrollment hold",type:"cost",feasibility:"Medium",detail:"Faster contextual response may prevent a hold or restart enrollment sooner, reducing site and vendor burn"},
      {name:"Avoid PMR(C)",type:"cost",feasibility:"Medium",detail:"Answer safety questions with existing linked data, potentially avoiding a new follow-up study"},
    ]},
    discoveryQs:[
      "If an unexpected safety signal emerged in your Phase III trial tomorrow, how quickly could your team contextualize it for regulators?",
      "Do you currently have pre-established RWD access for your late-stage programs, or would you need to start from scratch?",
      "Have you ever dealt with an enrollment hold or safety-related program delay?",
    ],
    quizzes:[
      {
        q:"An unexpected safety signal appears in a trial. What does linking the trial to RWD add beyond simply comparing to an external real-world cohort?",
        opts:["Nothing — an external cohort already answers every question","It lets you check whether the trial patients' own pre-existing baseline risk explains the signal, and confirm the external cohort is truly comparable","It replaces the need for a safety analysis","It guarantees regulators will not ask any questions"],
        correct:1,
        explain:"An external real-world cohort can give a background rate, but linkage is what lets you evaluate the trial patients' own baseline risk and confirm the external cohort is comparable — the added layer, not a requirement to contextualize at all.",
      },
      {
        q:"How does establishing RWD linkage in advance help contextualize an unexpected safety signal?",
        opts:["It files the regulatory response automatically","It lets the team measure the trial population's real-world baseline risk and confirm a comparable external cohort — quickly, because the linkage is already in place","It removes the need for a control arm in every trial","It lowers the trial's enrollment target"],
        correct:1,
        explain:"Linkage set up in advance means the team can immediately assess baseline risk and comparator comparability when a signal appears — turning a weeks-long scramble into a fast, evidence-based response.",
      },
      {
        q:"Why does establishing RWD linkage in advance matter most for late-stage Phase III programs?",
        opts:["Phase III trials have fewer patients, so RWD fills sample size gaps","Late-stage programs have the most to lose from an unexpected safety signal — delayed or narrowed approval has major downstream impact","Regulators only review RWD evidence for Phase III trials and above","Phase III is when CRF data quality deteriorates and RWD is needed as a backup"],
        correct:1,
        explain:"Late-stage Phase III programs represent years of investment and significant future revenue potential. An unexpected safety signal at this stage — without fast contextualization — can result in delayed approval, label narrowing, or enrollment holds. Pre-established linkage is the 'insurance policy' that enables a fast, evidence-based response.",
      },
    ],
  },
  {
    id:"uc4", type:"usecase", num:4, emoji:"⚖️",
    primer:{
      terms:[
        {t:"Single-arm trial",d:"A trial with no built-in control group — every participant receives the drug. Used when a randomized comparison isn't feasible or ethical (e.g., many rare diseases and some oncology settings)."},
        {t:"External control arm (ECA)",d:"A comparison group built from outside the trial — usually real-world data (claims, EHR, registries) — to stand in for the missing control arm and show the treatment's benefit."},
      ],
      note:"Datavant can build an ECA from RWD without tokenizing the trial. Tokenizing lets you measure the trial patients and the ECA on the same basis — which is what makes the comparison defensible to regulators.",
    },
    how:{
      subtitle:"Compare treated trial patients and external controls in RWD to strengthen ECA interpretability.",
      example:"for a single-arm oncology trial, link the treated patients to RWD and compare their baseline characteristics against the external control cohort to show the two are comparable before submission.",
      flow:[
        {emoji:"🗂️",label:"INPUT",sub:"Data linked",items:[
          "Tokenized US trial participants — index/baseline dates, treatment arm/exposure, ECA-relevant covariates",
          "Real-world data: the ECA source data, claims, EHR (+ abstraction), labs",
        ]},
        {emoji:"⚙️",label:"WHAT DATAVANT DOES",sub:"Datavant solutions",items:[
          {t:"Characterize trial participants in RWD",d:"Link tokenized participants to RWD to capture their baseline characteristics."},
          {t:"Assess ECA comparability",d:"Compare baseline characteristics between the linked trial cohort and the external control cohort to find comparability gaps."},
          {t:"Strengthen ECA interpretation",d:"Identify comparability gaps and guide the adjustment strategy."},
        ]},
        {emoji:"📈",label:"OUTPUT",sub:"Evidence generated",items:[
          "A defensible, apples-to-apples comparison of treated vs. external-control patients",
          "Comparability gaps identified before submission",
        ],purpose:"For FDA, payer and HTA review of single-arm and comparator-arm evidence."},
      ],
      bottomLine:"Show the external control really is comparable — before a reviewer asks.",
    },
    title:"ECA Comparability",
    sub:"Create an external control arm that is comparable to the treated arm",
    timing:"At 100% enrollment, interim and final analyses",
    headline:"Prove your external control patients are truly comparable to your trial patients — using the same RWD measurement basis for both.",
    rwdWhy:"A single-arm trial has no internal control group, so sponsors build an external control arm (ECA) from real-world data to show the treatment's benefit. Datavant can build that ECA from linked RWD without tokenizing the trial — but the ECA must be defensibly comparable to the treated patients. Tokenizing the trial lets both arms be measured on the same RWD basis, which is what makes that comparability credible to regulators, especially where the ECA is the only comparator.",
    challenges:[
      "CRF trial variables are standardized; external control RWD is captured in noisy routine care — inherently incomparable",
      "Sponsors conducting single-arm trials often lack the evidence depth regulators require to defend ECA populations",
      "Comparability gaps discovered during FDA review require expensive rework and resubmission",
    ],
    without:[
      "Compare standardized CRF data against routine-care RWD — apples to oranges",
      "Struggle to meet FDA's evidentiary bar for single-arm trial ECA populations",
      "Discover comparability gaps during review — leading to rework, delay, or resubmission",
    ],
    with:[
      "Link trial participants to RWD to characterize and balance both the treated arm and the RWD comparator cohort using harmonized baseline measures",
      "Create a true apples-to-apples comparison that is defensible to FDA and HTA bodies",
      "Identify and close comparability gaps before submission — no surprises at review",
    ],
    value:{ levers:[
      {name:"Program protection",type:"rev",feasibility:"Low",detail:"Stronger ECA comparability makes the evidence more credible, protecting approval and revenue potential"},
      {name:"Strengthen HTA submission",type:"rev",feasibility:"Low",detail:"Explaining why the external comparator is appropriate gives payers more confidence in treatment benefit"},
      {name:"Avoid approval delay",type:"cost",feasibility:"Low",detail:"Test comparability before submission to avoid emergency analyses, rework, and resubmission costs"},
    ]},
    discoveryQs:[
      "Are any of your pipeline assets planning a single-arm design with an external control arm?",
      "How are you currently planning to demonstrate that your external control patients are truly comparable to your trial patients?",
      "Has FDA ever challenged your ECA population or asked for additional comparability evidence?",
      "Have you checked whether any of your external control patients also appear in your trial cohort?",
    ],
    quizzes:[
      {
        q:"Why does comparing CRF trial data to RWD external control data create a fundamental challenge for regulators?",
        opts:["CRF data has too many missing values to be statistically useful for comparisons","CRF variables are standardized in controlled conditions while external control RWD is captured in routine care — creating an apples-to-oranges comparison","RWD data is not yet admissible as primary evidence in FDA submissions","Trial CRFs and external control RWD use incompatible patient ID formats"],
        correct:1,
        explain:"Standardized CRF data (controlled trial conditions) compared to real-world routine-care data (captured incidentally in clinical practice) creates a fundamental measurement incompatibility. Datavant solves this by measuring BOTH populations using the same RWD basis — a true apples-to-apples comparison.",
      },
      {
        q:"Which trial type benefits most from Datavant's ECA comparability offering, and why?",
        opts:["Large Phase III RCTs with 1,000+ patients in both arms — largest data footprint","Phase I dose-escalation trials — earliest opportunity to establish external control infrastructure","Single-arm trials where no concurrent control is feasible and the ECA is the only comparator","Phase II biomarker studies with no primary efficacy endpoint"],
        correct:2,
        explain:"Single-arm trials rely entirely on ECAs to demonstrate treatment benefit — it's their only comparator. Regulators require strong evidence that the ECA is truly comparable to the trial population. Datavant provides this by measuring both populations on the same RWD baseline.",
      },
    ],
  },
  {
    id:"uc5", type:"usecase", num:5, emoji:"🔍",
    how:{
      subtitle:"Detect and remove overlap across sites, trial phases, different trials and external cohorts before duplicate follow-up and skewed analyses accumulate.",
      example:"compare tokens across a sponsor's trials and sites to flag a participant enrolled in two studies at once, before duplicate follow-up and skewed analyses pile up.",
      flow:[
        {emoji:"🗂️",label:"INPUT",sub:"Tokens compared",items:[
          "Tokenized trial participants — site IDs, trial phase, ECA / registry tokens, cohort membership files",
          "Comparison set: other sites, phases and trials; external control and registry sources; multi-source RWD cohorts",
        ]},
        {emoji:"⚙️",label:"WHAT DATAVANT DOES",sub:"Datavant solutions",items:[
          {t:"Identify participant overlap",d:"Quantify overlap across sites, trials, phases and external cohorts."},
          {t:"Detect duplicate participants",d:"Find and flag multi-enrolled or professional patients across sites, trials, phases and sources."},
        ]},
        {emoji:"📈",label:"OUTPUT",sub:"Evidence generated",items:[
          "Duplicate and professional participants flagged across sites, trials and phases",
          "Clean, defensible analysis populations",
          "Follow-up spend avoided for patients who shouldn't be counted",
        ],purpose:"For study integrity and cost control — before analyses lock."},
      ],
      bottomLine:"Catch the same patient in two places early — before duplicate costs and skewed analyses add up.",
    },
    title:"Trial Patient Deduplication",
    sub:"Detect duplicate patients early",
    timing:"Periodically during enrollment (25/50/75/100%)",
    headline:"Detect the same participant enrolled across sites, trial phases and different trials before duplicate follow-up costs accumulate and evidence integrity is compromised",
    rwdWhy:"Without tokenized linkage across sites, trials, and phases, sponsors have no scalable way to detect participants enrolled in multiple studies. Professional trial participants deliberately conceal multi-enrollment. Manual site checks never span cross-trial or cross-program overlap.",
    challenges:[
      "Professional participants and duplicate enrollees rarely self-disclose overlapping trial participation",
      "Siloed site checks don't span across trials, phases, or programs",
      "Undetected duplicates distort eligibility, safety, and outcome analyses — creating regulatory risk",
    ],
    without:[
      "Rely on self-reporting — professional participants rarely disclose multi-enrollment",
      "Run siloed manual checks that don't span trials, phases, or programs",
      "Risk compromised evidence and regulatory scrutiny if duplicates skew results",
      "Pay per-patient follow-up costs for duplicate patients over years of follow-up",
    ],
    with:[
      "Detect the same participant across sites, trial phases and different trials — using tokens, not direct identifiers",
      "Identify multi-enrolled and professional participants before they affect analyses",
      "Protect study integrity with clean, defensible analysis populations for regulators",
      "Eliminate wasted follow-up spend by acting early — periodically during enrollment",
    ],
    value:{ levers:[
      {name:"Cost avoidance",type:"cost",feasibility:"High",detail:"Remove duplicate patients early — stop paying per-patient follow-up costs for patients who shouldn't be counted"},
      {name:"Program approval protection",type:"rev",feasibility:"Medium",detail:"Clean patient populations produce credible, defensible evidence that holds up to regulatory scrutiny"},
    ]},
    discoveryQs:[
      "How confident are you that patients in your current trials aren't enrolled in multiple arms or competing studies?",
      "What's your current process for detecting duplicate or professional trial participants across sites?",
      "How would you know today if the same patient enrolled at more than one of your trial sites?",
    ],
    quizzes:[
      {
        q:"How does Datavant's trial patient deduplication protect patient privacy while detecting duplicate enrollment across sites and trials?",
        opts:["All patient data is fully anonymized using k-anonymity techniques before sharing","Tokens can be used to detect overlap across sites without having to compare direct identifiers","A neutral third-party privacy auditor reviews all matching results before sharing","Only aggregate overlap statistics are shared — individual records are never identified"],
        correct:1,
        explain:"Datavant converts patient PII into a cryptographic token. Tokens can be compared across sites and studies to detect overlap without sharing or comparing direct identifiers across parties. This is the privacy-preserving advantage of tokenization.",
      },
      {
        q:"When is the best time to use tokens to detect duplicate patients, and what is the primary reason?",
        opts:["At Phase III completion — when all patients have completed follow-up and duplicates can be fully identified","After database lock — to ensure the cleanest possible analysis dataset for submission","Periodically during enrollment (e.g., at 25%, 50%, 75% and 100% enrollment), before duplicate follow-up costs accumulate and before trial analyses are finalized","During FDA review — to proactively respond to any integrity questions from reviewers"],
        correct:2,
        explain:"Mid-Phase I / Early Phase II is optimal because acting early prevents duplicate follow-up costs from compounding across years of the study. Early action also protects study integrity before duplicates can distort interim analyses or eligibility assessments.",
      },
    ],
  },
];

// ── Final Exam questions (10 total · 2 per use case) ──────────────────────────
// Pass threshold: 80% (8/10). Unlimited retakes.
const EXAM_QUESTIONS = [
  // UC1 · Long-Term Follow-Up
  {
    uc:"Long-Term Follow-Up",
    q:"After trial completion, a sponsor has several evidence questions to answer — payer HCRU, durability, and a safety sub-analysis. Why is linking the trial cohort to RWD once especially efficient here?",
    opts:[
      "Each question still requires a brand-new cohort linked from scratch",
      "One linked trial-RWD cohort can be reused across multiple evidence-generation studies, avoiding repeated linkage and setup",
      "RWD linkage can only ever answer a single research question per trial",
      "It removes the need for any statistical analysis plan",
    ],
    correct:1,
    explain:"Linking once creates a reusable trial-RWD foundation — the same linked cohort supports multiple analyses across the portfolio, avoiding repeated linkage and study-setup cost.",
  },
  {
    uc:"Long-Term Follow-Up",
    q:"A team is weighing whether to wait for post-launch real-world patients to accrue before generating long-term evidence. What does LTFU tokenization let them avoid?",
    opts:[
      "The need to ever collect any real-world data",
      "An 18–24 month wait for post-launch patients to accrue before evidence generation can begin",
      "FDA review of their long-term safety data",
      "The cost of running the primary trial itself",
    ],
    correct:1,
    explain:"Because tokenization links the existing trial participants to routine-care data at trial completion, teams begin generating long-term evidence immediately instead of waiting 18–24 months for post-launch accrual.",
  },
  // UC2 · Trial Representativeness
  {
    uc:"Trial Representativeness",
    q:"A sponsor ignores representativeness until regulatory submission, and a gap then surfaces for a key subgroup. What is a likely consequence?",
    opts:[
      "FDA approves automatically with no conditions",
      "A post-marketing requirement (PMR) to study the under-represented subgroup, plus possible review delay",
      "The trial must be re-run from Phase I",
      "Nothing — representativeness is not a regulatory concern",
    ],
    correct:1,
    explain:"Gaps discovered at submission — when enrollment is already locked — can trigger post-marketing requirements for the affected subgroup and add multi-month review delays.",
  },
  {
    uc:"Trial Representativeness",
    q:"What do site enrollment reports fail to provide that linking enrolled patients to pre-trial RWD supplies?",
    opts:[
      "The patients' full longitudinal clinical history and real-world context",
      "The trial's randomization schedule",
      "The site's monitoring-visit calendar",
      "The drug's manufacturing batch records",
    ],
    correct:0,
    explain:"Site reports show who enrolled but little clinical depth. Linking to pre-trial RWD adds the longitudinal medical history needed to judge whether the enrolled population reflects the label population.",
  },
  // UC3 · Safety Contextualization
  {
    uc:"Safety Contextualization",
    q:"An unexpected event rate looks higher in the treated arm. With pre-linked RWD, what can the team determine?",
    opts:[
      "Whether the difference reflects patients' pre-existing baseline risk rather than a true treatment effect",
      "The exact chemical cause of the event",
      "Whether the FDA reviewer will approve the drug",
      "The trial's future enrollment rate",
    ],
    correct:0,
    explain:"Pre-linked clinical history reveals baseline risk factors, so teams can show whether a safety difference is driven by the population's pre-existing risk or by the treatment itself.",
  },
  {
    uc:"Safety Contextualization",
    q:"How do indicated external RWD cohorts help when contextualizing a safety signal?",
    opts:[
      "They remove the need for a control arm in every trial",
      "They provide expected background event rates for a comparable real-world population",
      "They automatically file the regulatory response",
      "They lower the trial's enrollment target",
    ],
    correct:1,
    explain:"External cohorts matched to the indication give a real-world background rate for the event, so the trial's observed rate can be judged against what's expected in similar patients.",
  },
  // UC4 · ECA Comparability
  {
    uc:"ECA Comparability",
    q:"Besides satisfying the regulatory agency, who else gains confidence when a sponsor proves ECA comparability using the same RWD basis for both arms?",
    opts:[
      "The trial's clinical site coordinators",
      "Payers and HTA bodies evaluating the treatment's benefit",
      "The drug's packaging vendor",
      "No one else — it is purely an FDA concern",
    ],
    correct:1,
    explain:"A defensible, apples-to-apples external comparator also strengthens HTA and payer submissions, giving them more confidence in the estimated treatment benefit.",
  },
  {
    uc:"ECA Comparability",
    q:"What happens if a sponsor conducting a single-arm trial waits until regulatory review to discover their external control population isn't comparable?",
    opts:[
      "The regulatory agency adjusts the analysis for them at no cost",
      "They face expensive rework, delay, and possible resubmission",
      "The external control is accepted automatically anyway",
      "The trial retroactively converts to a randomized design",
    ],
    correct:1,
    explain:"Comparability gaps found during review force emergency re-analysis, rework, and potentially resubmission — all avoidable by testing comparability before submission.",
  },
  // UC5 · Trial Patient Deduplication
  {
    uc:"Trial Patient Deduplication",
    q:"Why can't manual, site-level checks reliably catch participants enrolled in multiple studies?",
    opts:[
      "Sites are not permitted to keep enrollment records",
      "They are siloed to one study and rely on self-disclosure — they don't span across trials, phases, and programs, and professional participants conceal multi-enrollment",
      "Duplicate enrollment is actually impossible",
      "Regulators prohibit checking for duplicates",
    ],
    correct:1,
    explain:"Site checks cover a single study and depend on honesty. Tokenized linkage detects overlap across trials, phases, and programs without moving PII — something manual checks cannot do.",
  },
  {
    uc:"Trial Patient Deduplication",
    q:"What is the risk of leaving duplicate or professional participants undetected in a trial?",
    opts:[
      "It has no effect on the analysis",
      "It distorts eligibility, safety, and outcome analyses and creates regulatory risk, while wasting per-patient follow-up spend",
      "It speeds up regulatory approval",
      "It only affects marketing, not the data",
    ],
    correct:1,
    explain:"Undetected duplicates skew eligibility, safety, and outcome analyses — undermining data integrity and inviting regulatory scrutiny — while the sponsor keeps paying follow-up costs for patients who shouldn't be counted.",
  },
];
const EXAM_TOTAL = EXAM_QUESTIONS.length;      // 10
const EXAM_PASS = Math.ceil(EXAM_TOTAL * 0.8); // 8 (80%)

const ALL_MODS = [INTRO, ...USE_CASES];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getSteps(mod) {
  if (mod.type === "intro") return ["overview"];
  const base = mod.how ? ["why","how","story","value"] : ["why","story","value"];
  return [...base, ...mod.quizzes.map((_,i) => `q${i}`)];
}
function isQuizStep(key){ return key.startsWith("q"); }
function qIdx(key){ return parseInt(key.slice(1)); }

function Feasibility({level}){
  const c={High:{bg:"#DCFCE7",color:"#166534"},Medium:{bg:"#FEF3C7",color:"#92400E"},Low:{bg:"#F1F5F9",color:"#6B7C93"}};
  return <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10,...c[level]}}>{level}</span>;
}

// ── Landing ──────────────────────────────────────────────────────────────────
const TOTAL_Q = USE_CASES.reduce((a,m)=>a+m.quizzes.length,0);

function Landing({onStart}){
  return(
    <div style={{minHeight:"100vh",background:DV.black,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"16px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <span style={{color:DV.white,fontWeight:800,fontSize:20,letterSpacing:"-.02em"}}>datavant</span>
        <span style={{color:"rgba(255,255,255,.35)",fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>Sales Enablement · Internal</span>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"5%",top:"10%",width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle at 35% 30%, #3B7BE8, #1B3490 50%, #050D1F)",opacity:.55,filter:"blur(3px)"}}/>
        <div style={{position:"absolute",right:"18%",bottom:"8%",width:110,height:110,borderRadius:"50%",background:"radial-gradient(circle at 30% 30%, #00C2D4, #1B3490, #050D1F)",opacity:.4,filter:"blur(2px)"}}/>
        <div style={{position:"relative",maxWidth:660}}>
          <div style={{display:"inline-block",border:"1px solid rgba(255,255,255,.18)",borderRadius:20,padding:"5px 18px",fontSize:11,color:"rgba(255,255,255,.55)",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:24}}>
            Trial Tokenization · 30-Min Sales Course
          </div>
          <h1 style={{fontSize:44,fontWeight:800,color:DV.white,lineHeight:1.12,letterSpacing:"-.03em",marginBottom:16}}>
            Trial Tokenization<br/>Value Manifesto
          </h1>
          <p style={{fontSize:16,color:"rgba(255,255,255,.55)",lineHeight:1.7,maxWidth:480,margin:"0 auto 40px"}}>
            Master Datavant's 5 trial tokenization use cases — what sponsors need, why RWD linkage solves it, and how to open the conversation.
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:40}}>
            {USE_CASES.map(uc=>(
              <div key={uc.id} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.14)",borderRadius:20,padding:"6px 14px",fontSize:13,color:"rgba(255,255,255,.75)",display:"flex",alignItems:"center",gap:6}}>
                <span>{uc.emoji}</span><span>{uc.title}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:0,background:"rgba(255,255,255,.06)",borderRadius:14,padding:"16px 0",maxWidth:400,margin:"0 auto 36px"}}>
            {[{icon:"🧩",val:"5",lbl:"Use Cases"},{icon:"✍️",val:TOTAL_Q,lbl:"Quiz Questions"},{icon:"⏱️",val:"~30 min",lbl:"Total Time"}].map((s,i)=>(
              <div key={i} style={{flex:1,textAlign:"center",borderRight:i<2?"1px solid rgba(255,255,255,.1)":"none"}}>
                <div style={{fontSize:18,marginBottom:2}}>{s.icon}</div>
                <div style={{fontSize:22,fontWeight:800,color:DV.white}}>{s.val}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{s.lbl}</div>
              </div>
            ))}
          </div>
          <button onClick={onStart} style={{background:DV.white,color:DV.cobalt,border:"none",padding:"15px 52px",borderRadius:10,fontSize:17,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,.3)",letterSpacing:"-.01em"}}>
            Start Course →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Overview Step — simple clickable cards ────────────────────────────────────
function OverviewStep({onJumpToUC}){
  return(
    <div className="step" style={{maxWidth:820,margin:"0 auto"}}>

      {/* Evidence problem summary */}
      <div style={{background:DV.navy,borderRadius:16,padding:"22px 28px",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.45)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Why Trial Tokenization?</div>
        <h2 style={{fontSize:18,fontWeight:800,color:DV.white,letterSpacing:"-.02em",marginBottom:10}}>Sponsors need evidence that clinical trials don't provide</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {INTRO.problems.map((p,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.07)",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid rgba(0,194,212,.5)"}}>
              <div style={{fontSize:12,fontWeight:700,color:DV.white,marginBottom:3}}>{p.t}</div>
              <p style={{fontSize:11,color:"rgba(255,255,255,.5)",lineHeight:1.5,margin:0}}>{p.b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clickable use case cards — original 3-col layout (reverted per feedback) */}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:DV.slate,letterSpacing:".08em",textTransform:"uppercase",marginBottom:10}}>
          5 Use Cases You'll Master · Click any to jump →
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {USE_CASES.map(uc=>(
            <div key={uc.id} onClick={()=>onJumpToUC(uc.id)} className="uc-card"
              style={{background:DV.card,borderRadius:12,padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,.06)",borderLeft:`4px solid ${DV.cobalt}`,cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontSize:24}}>{uc.emoji}</span>
                <span style={{fontSize:11,fontWeight:700,color:DV.cobalt}}>UC {uc.num}</span>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:DV.text,marginBottom:4}}>{uc.title}</div>
              <div style={{fontSize:12,color:DV.sub}}>{uc.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Separate trial-timeline visual (added per feedback) */}
      <div style={{background:DV.navy,borderRadius:14,padding:"16px 18px",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.55)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
          <span>Where each use case fits on the trial timeline</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[
            {ph:"During enrollment",ids:["uc2","uc5"]},
            {ph:"Interim / final analysis",ids:["uc3","uc4"]},
            {ph:"After trial completion",ids:["uc1"]},
          ].map((col,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{height:4,background:"linear-gradient(90deg,rgba(0,194,212,.6),rgba(27,52,144,.6))",borderRadius:3,marginBottom:8}}/>
              <div style={{fontSize:11,fontWeight:800,color:DV.teal,marginBottom:8}}>{col.ph}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
                {col.ids.map(id=>{ const uc=USE_CASES.find(u=>u.id===id); return(
                  <span key={id} onClick={()=>onJumpToUC(id)} style={{cursor:"pointer",background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.18)",borderRadius:16,padding:"4px 10px",fontSize:11,color:"#fff",display:"inline-flex",alignItems:"center",gap:5}}>
                    <span>{uc.emoji}</span><span>UC {uc.num} · {uc.title}</span>
                  </span>
                );})}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"rgba(255,255,255,.4)",marginTop:10}}>
          <span>Enrollment →</span><span>Analysis →</span><span>Post-completion</span>
        </div>
      </div>

      <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:12,padding:"13px 18px",display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{fontSize:18,flexShrink:0}}>💡</span>
        <p style={{fontSize:13,color:"#1E40AF",lineHeight:1.65,margin:0}}>Each use case covers <strong>what the problem is</strong>, <strong>why RWD linkage solves it</strong>, and <strong>discovery questions</strong> to open the conversation — followed by knowledge checks.</p>
      </div>
    </div>
  );
}

// ── Why Step ──────────────────────────────────────────────────────────────────
function WhyStep({mod}){
  return(
    <div className="step" style={{maxWidth:760,margin:"0 auto"}}>
      <div style={{background:`linear-gradient(135deg, ${DV.navy} 0%, ${DV.cobalt} 100%)`,borderRadius:16,padding:"32px",marginBottom:14,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:"-20px",top:"-20px",width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <span style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)",borderRadius:20,padding:"4px 12px",fontSize:11,color:"rgba(255,255,255,.8)",fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>Use Case {mod.num}</span>
          <span style={{background:"rgba(0,194,212,.2)",border:"1px solid rgba(0,194,212,.3)",borderRadius:20,padding:"4px 12px",fontSize:11,color:DV.teal,fontWeight:600}}>⏱️ {mod.timing}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
          <span style={{fontSize:44}}>{mod.emoji}</span>
          <h1 style={{fontSize:28,fontWeight:800,color:DV.white,letterSpacing:"-.02em",lineHeight:1.15}}>{mod.title}</h1>
        </div>
        <p style={{fontSize:15,color:"rgba(255,255,255,.75)",lineHeight:1.65,margin:0}}>{mod.headline}</p>
      </div>
      {mod.primer && (
        <div style={{background:"#FFF7E6",border:`1px solid #F5D98B`,borderRadius:12,padding:"14px 18px",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:800,color:"#92400E",letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>First, the basics</div>
          {mod.primer.terms.map((tm,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:i<mod.primer.terms.length-1?10:0,alignItems:"flex-start"}}>
              <span style={{fontSize:12.5,fontWeight:800,color:DV.cobalt,flexShrink:0,width:150}}>{tm.t}</span>
              <p style={{fontSize:13,color:DV.text,lineHeight:1.55,margin:0}}>{tm.d}</p>
            </div>
          ))}
          {mod.primer.note && <p style={{fontSize:13,color:"#78350F",lineHeight:1.55,margin:"12px 0 0",fontWeight:600}}>{mod.primer.note}</p>}
        </div>
      )}
      <div style={{background:DV.card,borderRadius:12,padding:"20px 24px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
        <div style={{fontSize:12,fontWeight:700,color:DV.slate,letterSpacing:".08em",textTransform:"uppercase",marginBottom:12}}>The Sponsor Challenge</div>
        {mod.challenges.map((c,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
            <span style={{fontSize:16,flexShrink:0,marginTop:1}}>⚠️</span>
            <p style={{fontSize:14,color:DV.sub,lineHeight:1.6,margin:0}}>{c}</p>
          </div>
        ))}
      </div>
      <div style={{background:`linear-gradient(120deg, rgba(0,194,212,.08) 0%, rgba(27,52,144,.08) 100%)`,border:`1px solid rgba(0,194,212,.3)`,borderRadius:12,padding:"20px 24px"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg, ${DV.teal}, ${DV.cobalt})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🔗</div>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:DV.cobalt,letterSpacing:".04em",textTransform:"uppercase",marginBottom:6}}>Why RWD Linkage?</div>
            <p style={{fontSize:14,color:DV.text,lineHeight:1.7,margin:0,fontWeight:500}}>{mod.rwdWhy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── How Step (rep-friendly "How this works")
function HowStep({mod}){
  const h=mod.how;
  const bar=[DV.cobalt,DV.teal,DV.mint];
  const tone=["#EEF4FF","#E8FBFD","#EAF7EE"];
  return(
    <div className="step" style={{maxWidth:900,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,color:DV.slate,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Use Case {mod.num} · {mod.title}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <h2 style={{fontSize:22,fontWeight:800,color:DV.text,letterSpacing:"-.02em"}}>How This Works</h2>
        </div>
        <p style={{fontSize:13.5,color:DV.sub,marginTop:4,maxWidth:640,marginLeft:"auto",marginRight:"auto"}}>{h.subtitle}</p>
      </div>

      <div style={{background:DV.bg,border:`1px solid ${DV.border}`,borderRadius:12,padding:"11px 16px",marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:800,color:DV.slate,letterSpacing:".08em",textTransform:"uppercase",marginBottom:3}}>Example</div>
        <p style={{fontSize:14,color:DV.text,lineHeight:1.55,margin:0,fontWeight:600}}>{h.example}</p>
      </div>

      <div style={{display:"flex",alignItems:"stretch",gap:6,marginBottom:16}}>
        {h.flow.map((col,i)=>(
          <React.Fragment key={i}>
            <div style={{flex:1,background:DV.card,border:`1px solid ${DV.border}`,borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.05)",display:"flex",flexDirection:"column"}}>
              <div style={{background:bar[i],padding:"9px 14px"}}>
                <div style={{fontSize:11,fontWeight:800,color:"#fff",letterSpacing:".06em"}}>{col.emoji} {col.label}</div>
                <div style={{fontSize:10.5,color:"rgba(255,255,255,.85)"}}>{col.sub}</div>
              </div>
              <div style={{padding:"13px",background:tone[i],flex:1}}>
                {col.items.map((it,j)=>(
                  <div key={j} style={{display:"flex",gap:8,marginBottom:j<col.items.length-1?9:0,alignItems:"flex-start"}}>
                    <span style={{color:bar[i],fontSize:11,marginTop:3,flexShrink:0}}>●</span>
                    {typeof it==="object"
                      ? <div><div style={{fontSize:12.5,fontWeight:800,color:DV.text,marginBottom:1}}>{it.t}</div><p style={{fontSize:12,color:DV.sub,lineHeight:1.45,margin:0}}>{it.d}</p></div>
                      : <p style={{fontSize:12.5,color:DV.text,lineHeight:1.5,margin:0}}>{it}</p>}
                  </div>
                ))}
                {col.purpose && (
                  <div style={{marginTop:11,paddingTop:9,borderTop:`1px dashed ${DV.border}`}}>
                    <div style={{fontSize:10,fontWeight:800,color:bar[i],letterSpacing:".06em",textTransform:"uppercase",marginBottom:3}}>For</div>
                    <p style={{fontSize:12.5,color:DV.text,lineHeight:1.5,margin:0,fontWeight:600}}>{col.purpose}</p>
                  </div>
                )}
              </div>
            </div>
            {i<h.flow.length-1 && <div style={{display:"flex",alignItems:"center",fontSize:22,color:DV.slate,fontWeight:800}}>→</div>}
          </React.Fragment>
        ))}
      </div>

      <div style={{background:DV.navy,borderRadius:12,padding:"12px 18px",display:"flex",gap:12,alignItems:"center"}}>
        <span style={{fontSize:11,fontWeight:800,color:DV.teal,letterSpacing:".08em",textTransform:"uppercase",flexShrink:0}}>Bottom line</span>
        <p style={{fontSize:13.5,color:"#fff",lineHeight:1.5,margin:0,fontWeight:600}}>{h.bottomLine}</p>
      </div>
    </div>
  );
}

// ── Story Step ────────────────────────────────────────────────────────────────
function StoryStep({mod}){
  return(
    <div className="step" style={{maxWidth:760,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,color:DV.slate,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Use Case {mod.num} · {mod.title}</div>
        <h2 style={{fontSize:22,fontWeight:800,color:DV.text,letterSpacing:"-.02em"}}>The RWD Linkage Advantage</h2>
      </div>

      {/* Without / With */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        <div style={{background:"#FFF5F5",border:"1px solid #FECACA",borderRadius:14,overflow:"hidden"}}>
          <div style={{background:"#FEE2E2",padding:"12px 18px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>❌</span>
            <span style={{fontSize:13,fontWeight:800,color:"#991B1B"}}>Without Datavant</span>
          </div>
          <div style={{padding:"18px"}}>
            {mod.without.map((w,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:i<mod.without.length-1?12:0,alignItems:"flex-start"}}>
                <span style={{color:DV.coral,fontSize:14,flexShrink:0,marginTop:2}}>✗</span>
                <p style={{fontSize:13,color:"#7F1D1D",lineHeight:1.55,margin:0}}>{w}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#F0FDF4",border:"1px solid #A7F3D0",borderRadius:14,overflow:"hidden"}}>
          <div style={{background:"#DCFCE7",padding:"12px 18px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>✅</span>
            <span style={{fontSize:13,fontWeight:800,color:"#166534"}}>With Datavant RWD Linkage</span>
          </div>
          <div style={{padding:"18px"}}>
            {mod.with.map((w,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:i<mod.with.length-1?12:0,alignItems:"flex-start"}}>
                <span style={{color:DV.mint,fontSize:14,flexShrink:0,marginTop:2}}>✓</span>
                <p style={{fontSize:13,color:"#166534",lineHeight:1.55,margin:0}}>{w}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discovery questions — expanded sales playbook */}
      <div style={{background:DV.navy,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>🎯</span>
          <span style={{fontSize:13,fontWeight:800,color:DV.white,letterSpacing:".02em"}}>Sales Playbook — Discovery Questions</span>
        </div>
        <div style={{padding:"16px 20px"}}>
          <p style={{fontSize:12,color:"rgba(255,255,255,.45)",marginBottom:12,lineHeight:1.5}}>
            Use these to open the conversation and surface this use case naturally:
          </p>
          {mod.discoveryQs.map((q,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:i<mod.discoveryQs.length-1?12:0,alignItems:"flex-start"}}>
              <span style={{width:22,height:22,borderRadius:"50%",background:"rgba(255,255,255,.12)",color:"rgba(255,255,255,.7)",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</span>
              <p style={{fontSize:13,color:"rgba(255,255,255,.85)",lineHeight:1.6,margin:0,fontStyle:"italic"}}>"{q}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Value Step ────────────────────────────────────────────────────────────────
function ValueStep({mod}){
  const v=mod.value;
  const revLevers=v.levers.filter(l=>l.type==="rev");
  const costLevers=v.levers.filter(l=>l.type==="cost");
  return(
    <div className="step" style={{maxWidth:760,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,color:DV.slate,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Use Case {mod.num} · {mod.title}</div>
        <h2 style={{fontSize:22,fontWeight:800,color:DV.text,letterSpacing:"-.02em"}}>Where Datavant Creates Value</h2>
        <p style={{fontSize:14,color:DV.sub,marginTop:4}}>Potential value levers to unlock — use these to frame the opportunity with your clients.</p>
      </div>

      {/* Revenue levers */}
      {revLevers.length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:"#166534",letterSpacing:".08em",textTransform:"uppercase",marginBottom:8,paddingLeft:4}}>📈 Revenue Levers</div>
          <div style={{background:DV.card,borderRadius:12,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            {revLevers.map((l,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr",padding:"13px 16px",borderBottom:i<revLevers.length-1?`1px solid ${DV.border}`:"none",background:DV.revBg,gap:12,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:DV.text,marginBottom:3}}>{l.name}</div>
                  <div style={{fontSize:12,color:DV.sub,lineHeight:1.5}}>{l.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost levers */}
      {costLevers.length>0&&(
        <div>
          <div style={{fontSize:11,fontWeight:700,color:"#92400E",letterSpacing:".08em",textTransform:"uppercase",marginBottom:8,paddingLeft:4}}>💰 Cost Levers</div>
          <div style={{background:DV.card,borderRadius:12,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            {costLevers.map((l,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr",padding:"13px 16px",borderBottom:i<costLevers.length-1?`1px solid ${DV.border}`:"none",background:DV.costBg,gap:12,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:DV.text,marginBottom:3}}>{l.name}</div>
                  <div style={{fontSize:12,color:DV.sub,lineHeight:1.5}}>{l.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Quiz Step ─────────────────────────────────────────────────────────────────
function QuizStep({quiz,qNum,total,selected,onSelect}){
  const answered=selected!==undefined;
  const correct=answered&&selected===quiz.correct;
  return(
    <div className="step" style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <div style={{background:DV.cobalt,color:DV.white,borderRadius:20,padding:"4px 14px",fontSize:12,fontWeight:700}}>Knowledge Check {qNum}/{total}</div>
        {answered&&<div style={{fontSize:13,fontWeight:700,color:correct?DV.mint:DV.coral}}>{correct?"Correct ✅":"Incorrect ❌"}</div>}
      </div>
      <div style={{background:DV.card,borderRadius:16,padding:"28px 28px 24px",boxShadow:"0 4px 20px rgba(0,0,0,.08)"}}>
        <p style={{fontSize:17,fontWeight:600,color:DV.text,lineHeight:1.5,marginBottom:22}}>{quiz.q}</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {quiz.opts.map((opt,i)=>{
            let bg=DV.card,border=`2px solid ${DV.border}`,color=DV.sub,iconBg="#F1F5F9",iconC=DV.slate,iconChar=String.fromCharCode(65+i);
            if(answered){
              if(i===quiz.correct){bg="#F0FDF4";border="2px solid #22C55E";color="#166534";iconBg=DV.mint;iconC="white";iconChar="✓";}
              else if(i===selected){bg="#FFF5F5";border="2px solid #EF4444";color="#991B1B";iconBg=DV.coral;iconC="white";iconChar="✗";}
            }
            return(
              <div key={i} className="opt" data-locked={answered||undefined} onClick={()=>!answered&&onSelect(i)}
                style={{padding:"13px 16px",borderRadius:10,background:bg,border,display:"flex",alignItems:"flex-start",gap:12,transition:"all .15s",color}}>
                <span style={{width:28,height:28,borderRadius:"50%",background:iconBg,color:iconC,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0,marginTop:1}}>{iconChar}</span>
                <span style={{fontSize:14,fontWeight:500,lineHeight:1.5,paddingTop:2}}>{opt}</span>
              </div>
            );
          })}
        </div>
        {answered&&(
          <div style={{padding:"16px 18px",borderRadius:10,background:correct?"#F0FDF4":"#FFFBEB",border:`1px solid ${correct?"#A7F3D0":"#FDE68A"}`,animation:"fadeIn .3s ease"}}>
            <div style={{fontWeight:700,color:correct?"#166534":"#92400E",marginBottom:6,fontSize:14}}>{correct?"✅ That's right!":"Here's the key insight:"}</div>
            <p style={{color:correct?"#047857":"#78350F",fontSize:13,lineHeight:1.65,margin:0}}>{quiz.explain}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Top Nav ───────────────────────────────────────────────────────────────────
function TopNav({modIdx,onJump,answeredQ,isModDone}){
  return(
    <div style={{background:DV.black,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
      <span style={{color:DV.white,fontWeight:800,fontSize:16,letterSpacing:"-.02em",marginRight:20,flexShrink:0}}>datavant</span>
      <div style={{display:"flex",gap:4,flex:1}}>
        {ALL_MODS.map((m,i)=>{
          const active=i===modIdx;
          const done=isModDone(m);
          return(
            <button key={m.id} onClick={()=>onJump(i)} className="tab"
              style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:8,border:"none",cursor:"pointer",background:active?"rgba(255,255,255,.12)":"transparent",transition:"background .15s"}}>
              <span style={{fontSize:m.type==="intro"?"12px":"16px"}}>{m.type==="intro"?"📋":m.emoji}</span>
              {active&&<span style={{fontSize:12,fontWeight:600,color:DV.white,whiteSpace:"nowrap",maxWidth:110,overflow:"hidden",textOverflow:"ellipsis"}}>{m.type==="intro"?"Overview":m.title}</span>}
              {done&&m.type!=="intro"&&<span style={{fontSize:12,color:DV.mint}}>✓</span>}
            </button>
          );
        })}
      </div>
      <div style={{background:"rgba(255,255,255,.08)",borderRadius:14,padding:"4px 12px",fontSize:12,color:"rgba(255,255,255,.55)",flexShrink:0}}>
        {answeredQ}/{TOTAL_Q} questions
      </div>
    </div>
  );
}

// ── Airtable submission ───────────────────────────────────────────────────────
// Sends a completion record to Airtable. Configured via Vercel env vars:
//   VITE_AIRTABLE_TOKEN, VITE_AIRTABLE_BASE_ID, VITE_AIRTABLE_TABLE (default "Completions")
// If env vars are missing (e.g. local dev), it no-ops gracefully instead of throwing.
async function submitToAirtable(email, score, question){
  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const table = import.meta.env.VITE_AIRTABLE_TABLE || "Completions";
  if(!token || !baseId){
    console.warn("Airtable not configured — skipping completion submission.");
    return { ok:false, skipped:true };
  }
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,{
    method:"POST",
    headers:{ "Authorization":`Bearer ${token}`, "Content-Type":"application/json" },
    body:JSON.stringify({ fields:{
      Email: email || "",
      Score: `${score}/${EXAM_TOTAL}`,
      "Completed At": new Date().toISOString(),
      Question: question || "",
    }}),
  });
  if(!res.ok){
    const body = await res.text().catch(()=>"");
    console.error("Airtable write failed:", res.status, body); // check the browser console for the reason
    throw new Error(`Airtable ${res.status}: ${body}`);
  }
  const data = await res.json().catch(()=>({}));
  console.log("Airtable write OK", data && data.id);
  return { ok:true, skipped:false, id:(data && data.id) || null };
}

// Adds the user's question to the completion record that was already created.
async function addQuestionToRecord(recordId, question){
  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const table = import.meta.env.VITE_AIRTABLE_TABLE || "Completions";
  if(!token || !baseId || !recordId) return { ok:false, skipped:true };
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}/${recordId}`,{
    method:"PATCH",
    headers:{ "Authorization":`Bearer ${token}`, "Content-Type":"application/json" },
    body:JSON.stringify({ fields:{ Question: question || "" } }),
  });
  if(!res.ok){
    const body = await res.text().catch(()=>"");
    throw new Error(`Airtable ${res.status}: ${body}`);
  }
  return { ok:true };
}

// ── Final Exam ────────────────────────────────────────────────────────────────
function ExamScreen({ onPass }){
  const [answers,setAnswers]=useState({}); // qIdx -> optIdx
  const [submitted,setSubmitted]=useState(false);
  const [attempt,setAttempt]=useState(1);
  const [started,setStarted]=useState(false);

  const answeredCount=Object.keys(answers).length;
  const allAnswered=answeredCount===EXAM_TOTAL;
  const score=EXAM_QUESTIONS.reduce((a,q,i)=>a+(answers[i]===q.correct?1:0),0);
  const passed=score>=EXAM_PASS;

  function pick(qi,oi){ if(!submitted) setAnswers(p=>({...p,[qi]:oi})); }
  function retake(){ setAnswers({}); setSubmitted(false); setAttempt(a=>a+1); window.scrollTo(0,0); }

  // Result view
  if(submitted){
    return(
      <div style={{minHeight:"100vh",background:DV.bg,fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:DV.black,padding:"14px 32px"}}><span style={{color:DV.white,fontWeight:800,fontSize:18,letterSpacing:"-.02em"}}>datavant</span></div>
        <div style={{maxWidth:600,margin:"48px auto",padding:"0 20px"}}>
          <div style={{background:DV.card,borderRadius:20,padding:"44px 40px",boxShadow:"0 8px 32px rgba(0,0,0,.1)",textAlign:"center"}}>
            <div style={{fontSize:60,marginBottom:10}}>{passed?"🎉":"📚"}</div>
            <h1 style={{fontSize:26,fontWeight:800,color:DV.text,marginBottom:6}}>{passed?"You Passed!":"Not Quite Yet"}</h1>
            <p style={{color:DV.slate,fontSize:14,marginBottom:24}}>Final Exam · Trial Tokenization Value Manifesto</p>
            <div style={{display:"inline-block",background:passed?"#F0FDF4":"#FFF5F5",border:`1px solid ${passed?"#A7F3D0":"#FECACA"}`,borderRadius:14,padding:"18px 40px",marginBottom:22}}>
              <div style={{fontSize:40,fontWeight:800,color:passed?"#166534":"#991B1B"}}>{score}/{EXAM_TOTAL}</div>
              <div style={{fontSize:13,color:passed?"#166534":"#991B1B",fontWeight:600}}>{Math.round(score/EXAM_TOTAL*100)}% · pass mark {EXAM_PASS}/{EXAM_TOTAL} (80%)</div>
            </div>
            <p style={{color:DV.sub,fontSize:14,lineHeight:1.6,marginBottom:26}}>
              {passed
                ? "Great work — you've demonstrated command of all five use cases. Continue to wrap up the course."
                : `You need ${EXAM_PASS}/${EXAM_TOTAL} to pass. Review the use cases where you missed questions, then retake the exam — there's no limit on attempts.`}
            </p>

            {/* Per-question breakdown */}
            <div style={{textAlign:"left",marginBottom:28}}>
              <div style={{fontSize:11,fontWeight:700,color:DV.slate,letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>Your Answers</div>
              {EXAM_QUESTIONS.map((q,i)=>{
                const ok=answers[i]===q.correct;
                return(
                  <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${DV.border}`,alignItems:"flex-start"}}>
                    <span style={{fontSize:14,flexShrink:0,color:ok?DV.mint:DV.coral,fontWeight:700}}>{ok?"✓":"✗"}</span>
                    <span style={{flex:1,fontSize:12,color:DV.sub,lineHeight:1.5}}><strong style={{color:DV.slate}}>Q{i+1} · {q.uc}</strong></span>
                  </div>
                );
              })}
            </div>

            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              {passed
                ? <button onClick={()=>onPass(score)} style={{background:DV.cobalt,color:"white",border:"none",padding:"12px 32px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer"}}>Finish Course →</button>
                : <button onClick={retake} style={{background:DV.cobalt,color:"white",border:"none",padding:"12px 32px",borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer"}}>Retake Exam</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Intro / section screen — shown before the exam questions
  if(!started){
    return(
      <div style={{minHeight:"100vh",background:DV.black,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <span style={{color:DV.white,fontWeight:800,fontSize:20,letterSpacing:"-.02em"}}>datavant</span>
          <span style={{color:"rgba(255,255,255,.35)",fontSize:12,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>Final Exam</span>
        </div>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 24px",textAlign:"center"}}>
          <div style={{maxWidth:560}}>
            <div style={{fontSize:56,marginBottom:18}}>📝</div>
            <div style={{display:"inline-block",border:"1px solid rgba(255,255,255,.18)",borderRadius:20,padding:"5px 18px",fontSize:11,color:"rgba(255,255,255,.55)",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:20}}>
              Final Section
            </div>
            <h1 style={{fontSize:38,fontWeight:800,color:DV.white,lineHeight:1.15,letterSpacing:"-.03em",marginBottom:16}}>Final Exam</h1>
            <p style={{fontSize:16,color:"rgba(255,255,255,.6)",lineHeight:1.7,maxWidth:460,margin:"0 auto 32px"}}>
              You've worked through all five use cases. This final exam confirms you're ready to lead trial tokenization conversations.
            </p>
            <div style={{display:"flex",justifyContent:"center",gap:0,background:"rgba(255,255,255,.06)",borderRadius:14,padding:"16px 0",maxWidth:420,margin:"0 auto 32px"}}>
              {[{val:EXAM_TOTAL,lbl:"Questions"},{val:"80%",lbl:"Pass Mark"},{val:"∞",lbl:"Retakes"}].map((s,i)=>(
                <div key={i} style={{flex:1,textAlign:"center",borderRight:i<2?"1px solid rgba(255,255,255,.1)":"none"}}>
                  <div style={{fontSize:24,fontWeight:800,color:DV.white}}>{s.val}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{s.lbl}</div>
                </div>
              ))}
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:28}}>
              Two questions per use case. Answer all {EXAM_TOTAL}, then submit. You need {EXAM_PASS}/{EXAM_TOTAL} to pass — retake as many times as you need.
            </p>
            <button onClick={()=>{ setStarted(true); window.scrollTo(0,0); }}
              style={{background:DV.white,color:DV.cobalt,border:"none",padding:"15px 52px",borderRadius:10,fontSize:17,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}>
              Begin Exam →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam-taking view
  return(
    <div style={{minHeight:"100vh",background:DV.bg,fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:DV.black,padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{color:DV.white,fontWeight:800,fontSize:18,letterSpacing:"-.02em"}}>datavant</span>
        <span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontWeight:600}}>Final Exam{attempt>1?` · Attempt ${attempt}`:""}</span>
      </div>
      <div style={{maxWidth:720,margin:"32px auto 120px",padding:"0 20px"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,color:DV.slate,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Final Exam</div>
          <h1 style={{fontSize:26,fontWeight:800,color:DV.text,letterSpacing:"-.02em",marginBottom:8}}>10 Questions · Pass Mark 80%</h1>
          <p style={{fontSize:14,color:DV.sub}}>Answer all {EXAM_TOTAL} questions, then submit. You need {EXAM_PASS}/{EXAM_TOTAL} to pass. Unlimited retakes.</p>
        </div>

        {EXAM_QUESTIONS.map((q,qi)=>(
          <div key={qi} style={{background:DV.card,borderRadius:14,padding:"22px 24px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            <div style={{fontSize:11,fontWeight:700,color:DV.cobalt,letterSpacing:".06em",textTransform:"uppercase",marginBottom:8}}>Q{qi+1} · {q.uc}</div>
            <p style={{fontSize:15,fontWeight:600,color:DV.text,lineHeight:1.5,marginBottom:16}}>{q.q}</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {q.opts.map((opt,oi)=>{
                const chosen=answers[qi]===oi;
                return(
                  <div key={oi} className="opt" onClick={()=>pick(qi,oi)}
                    style={{padding:"11px 14px",borderRadius:9,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:11,
                      background:chosen?"#EBF2FF":DV.card,border:`2px solid ${chosen?DV.blue:DV.border}`,transition:"all .12s"}}>
                    <span style={{width:26,height:26,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,
                      background:chosen?DV.cobalt:"#F1F5F9",color:chosen?"white":DV.slate}}>{String.fromCharCode(65+oi)}</span>
                    <span style={{fontSize:14,color:chosen?DV.text:DV.sub,lineHeight:1.5,paddingTop:3}}>{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky submit bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:DV.card,borderTop:`1px solid ${DV.border}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,zIndex:10}}>
        <span style={{fontSize:13,color:DV.slate,fontWeight:600}}>{answeredCount}/{EXAM_TOTAL} answered</span>
        <button onClick={()=>{ if(allAnswered){ setSubmitted(true); window.scrollTo(0,0);} }} disabled={!allAnswered}
          style={{background:allAnswered?DV.cobalt:DV.border,color:allAnswered?DV.white:DV.slate,border:"none",padding:"11px 32px",borderRadius:8,fontSize:14,fontWeight:700,cursor:allAnswered?"pointer":"default"}}>
          Submit Exam
        </button>
      </div>
    </div>
  );
}

// ── Closing Screen ────────────────────────────────────────────────────────────
function ClosingScreen({ score }){
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const [question,setQuestion]=useState("");
  const [status,setStatus]=useState("idle"); // idle | sending | done | error
  const [errMsg,setErrMsg]=useState("");
  // Auto-record state: completion is saved as soon as this screen is reached.
  const [recStatus,setRecStatus]=useState("saving"); // saving | saved | failed
  const [recErr,setRecErr]=useState("");
  const recordIdRef=useRef(null);
  const didRecordRef=useRef(false);

  // Record the completion immediately on arrival — no button click required.
  useEffect(()=>{
    if(didRecordRef.current) return;   // guard against double-run
    didRecordRef.current=true;
    (async()=>{
      try{
        const r=await submitToAirtable(email, score, "");
        recordIdRef.current=r.id;
        setRecStatus(r.skipped?"failed":"saved");
        if(r.skipped) setRecErr("Airtable is not configured (missing environment variables).");
      }catch(e){
        console.error(e);
        setRecErr(String(e && e.message ? e.message : e));
        setRecStatus("failed");
      }
    })();
  },[email,score]);

  async function finish(){
    setStatus("sending");
    try{
      if(question.trim()){
        // Attach the question to the record already created on arrival.
        if(recordIdRef.current) await addQuestionToRecord(recordIdRef.current, question);
        else await submitToAirtable(email, score, question); // fallback if the auto-record failed
      }
      setStatus("done");
    }catch(e){
      console.error(e);
      setErrMsg(String(e && e.message ? e.message : e));
      setStatus("error");
    }
  }

  if(status==="done"){
    return(
      <div style={{minHeight:"100vh",background:DV.bg,fontFamily:"system-ui,sans-serif"}}>
        <div style={{background:DV.black,padding:"14px 32px"}}><span style={{color:DV.white,fontWeight:800,fontSize:18,letterSpacing:"-.02em"}}>datavant</span></div>
        <div style={{maxWidth:560,margin:"72px auto",padding:"0 20px"}}>
          <div style={{background:DV.card,borderRadius:20,padding:"48px 44px",boxShadow:"0 8px 32px rgba(0,0,0,.1)",textAlign:"center"}}>
            <div style={{fontSize:60,marginBottom:12}}>🎓</div>
            <h1 style={{fontSize:26,fontWeight:800,color:DV.text,marginBottom:10}}>You're all set!</h1>
            <p style={{color:DV.slate,fontSize:15,lineHeight:1.65}}>{question?"Thanks for your question — we'll address it in the live session.":"See you at the live training session."}</p>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:DV.bg,fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:DV.black,padding:"14px 32px"}}><span style={{color:DV.white,fontWeight:800,fontSize:18,letterSpacing:"-.02em"}}>datavant</span></div>
      <div style={{maxWidth:600,margin:"48px auto",padding:"0 20px"}}>
        <div style={{background:DV.card,borderRadius:20,padding:"44px 40px",boxShadow:"0 8px 32px rgba(0,0,0,.1)"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{fontSize:60,marginBottom:12}}>🏆</div>
            <h1 style={{fontSize:28,fontWeight:800,color:DV.text,marginBottom:10}}>Congratulations!</h1>
            <p style={{color:DV.sub,fontSize:15,lineHeight:1.65}}>
              You've completed the Trial Tokenization Value Manifesto and passed the final exam with a score of <strong>{score}/{EXAM_TOTAL}</strong>. You're ready to lead trial tokenization conversations with pharma and biotech customers.
            </p>
          </div>

          {/* Auto-record status — completion is saved on arrival, no click needed */}
          <div style={{borderRadius:10,padding:"11px 16px",marginBottom:18,fontSize:13,fontWeight:600,
            background:recStatus==="saved"?"#F0FDF4":recStatus==="failed"?"#FFF5F5":"#F1F5F9",
            border:`1px solid ${recStatus==="saved"?"#A7F3D0":recStatus==="failed"?"#FECACA":DV.border}`,
            color:recStatus==="saved"?"#166534":recStatus==="failed"?"#991B1B":DV.slate}}>
            {recStatus==="saving"&&"Recording your completion…"}
            {recStatus==="saved"&&"✓ Your completion has been recorded."}
            {recStatus==="failed"&&<>Could not record your completion automatically. Please notify the training team.
              {recErr&&<div style={{marginTop:5,fontSize:11,fontWeight:400,color:"#B91C1C",wordBreak:"break-word"}}>{recErr}</div>}</>}
          </div>

          <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:12,padding:"18px 20px",marginBottom:22}}>
            <div style={{fontSize:13,fontWeight:700,color:DV.cobalt,marginBottom:8}}>💬 A question for the live session?</div>
            <p style={{fontSize:13,color:"#1E40AF",lineHeight:1.55,marginBottom:12}}>Optional — drop anything you'd like the team to cover live. We'll review submissions before the session.</p>
            <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Type your question here…"
              rows={4} style={{width:"100%",resize:"vertical",padding:"12px 14px",borderRadius:9,border:`1px solid ${DV.border}`,fontSize:14,fontFamily:"inherit",color:DV.text,boxSizing:"border-box"}}/>
          </div>

          {status==="error"&&(
            <div style={{background:"#FFF5F5",border:"1px solid #FECACA",borderRadius:9,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#991B1B"}}>
              Something went wrong recording your completion. Please try again.
              {errMsg&&<div style={{marginTop:6,fontSize:11,color:"#B91C1C",wordBreak:"break-word"}}>{errMsg}</div>}
            </div>
          )}

          <button onClick={finish} disabled={status==="sending"}
            style={{width:"100%",background:DV.cobalt,color:"white",border:"none",padding:"14px",borderRadius:9,fontSize:15,fontWeight:800,cursor:status==="sending"?"default":"pointer",opacity:status==="sending"?.7:1,marginBottom:26}}>
            {status==="sending"?"Sending…":(question.trim()?"Submit Question & Finish 🎓":"Finish 🎓")}
          </button>

          <div style={{borderTop:`1px solid ${DV.border}`,paddingTop:20}}>
            <div style={{fontSize:11,fontWeight:700,color:DV.slate,letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>Questions? Contact the team</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {["Ulka Campbell","Kathleen Gavin","My Nguyen"].map(n=>(
                <div key={n} style={{background:DV.bg,border:`1px solid ${DV.border}`,borderRadius:20,padding:"6px 14px",fontSize:13,color:DV.sub,fontWeight:600}}>{n}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("landing");
  const [modIdx,setModIdx]=useState(0);
  const [stepIdx,setStepIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [animKey,setAnimKey]=useState(0);
  const [examScore,setExamScore]=useState(0);
  // History stack: each entry = {modIdx, stepIdx} we came FROM.
  // navigate() pushes current location before moving; goBack() pops and restores.
  const [navHistory,setNavHistory]=useState([]);

  const mod=ALL_MODS[modIdx];
  const steps=getSteps(mod);
  const stepKey=steps[stepIdx];
  const isLastStep=stepIdx===steps.length-1;
  const isLastMod=modIdx===ALL_MODS.length-1;

  function navigate(mi,si){
    // Push where we currently are before moving
    setNavHistory(h=>[...h.slice(-30),{modIdx,stepIdx}]);
    setAnimKey(k=>k+1);
    setModIdx(mi);
    setStepIdx(si);
  }
  // All use-case knowledge checks answered? Required before the final exam unlocks.
  function allUseCasesDone(){
    return USE_CASES.every(m=>m.quizzes.every((_,i)=>getAnswer(m.id,i)!==undefined));
  }
  function firstIncompleteModIdx(){
    for(let i=0;i<ALL_MODS.length;i++){
      const m=ALL_MODS[i];
      if(m.type==="usecase" && !m.quizzes.every((_,j)=>getAnswer(m.id,j)!==undefined)) return i;
    }
    return -1;
  }
  function goNext(){
    if(!isLastStep){ navigate(modIdx,stepIdx+1); return; }
    // On a module's last step: once every use case is done, go straight to the exam
    // (no need to click back through a use case that was completed earlier).
    if(allUseCasesDone()){ window.scrollTo(0,0); setScreen("exam"); return; }
    // Otherwise route to the first unfinished use case, or advance to the next module.
    const i=firstIncompleteModIdx();
    if(i!==-1) navigate(i,0);
    else if(!isLastMod) navigate(modIdx+1,0);
  }
  function goBack(){
    if(navHistory.length===0) return;
    const prev=navHistory[navHistory.length-1];
    setNavHistory(h=>h.slice(0,-1));
    setAnimKey(k=>k+1);
    setModIdx(prev.modIdx);
    setStepIdx(prev.stepIdx);
  }
  function handleAnswer(qi,optIdx){
    const key=`${mod.id}-q${qi}`;
    if(answers[key]!==undefined) return;
    setAnswers(p=>({...p,[key]:optIdx}));
  }
  function getAnswer(modId,qi){ return answers[`${modId}-q${qi}`]; }
  function canContinue(){
    if(!isQuizStep(stepKey)) return true;
    return getAnswer(mod.id,qIdx(stepKey))!==undefined;
  }
  function isModDone(m){
    if(m.type==="intro") return modIdx>0;
    return m.quizzes.every((_,i)=>getAnswer(m.id,i)!==undefined);
  }
  const answeredQ=Object.keys(answers).length;

  // Jump to a use case by id (from lifecycle diagram)
  function jumpToUC(ucId){
    const idx=ALL_MODS.findIndex(m=>m.id===ucId);
    if(idx!==-1) navigate(idx,0);
  }

  function renderStep(){
    if(stepKey==="overview") return <OverviewStep onJumpToUC={jumpToUC}/>;
    if(stepKey==="why") return <WhyStep mod={mod}/>;
    if(stepKey==="how") return <HowStep mod={mod}/>;
    if(stepKey==="story") return <StoryStep mod={mod}/>;
    if(stepKey==="value") return <ValueStep mod={mod}/>;
    if(isQuizStep(stepKey)){
      const qi=qIdx(stepKey);
      return <QuizStep quiz={mod.quizzes[qi]} qNum={qi+1} total={mod.quizzes.length} selected={getAnswer(mod.id,qi)} onSelect={(i)=>handleAnswer(qi,i)}/>;
    }
  }

  function stepLabel(key){
    if(key==="overview") return "Overview";
    if(key==="why") return "Why";
    if(key==="how") return "How";
    if(key==="story") return "Approach";
    if(key==="value") return "Value";
    if(isQuizStep(key)) return `Q${qIdx(key)+1}`;
  }

  if(screen==="landing") return <><style>{CSS}</style><Landing onStart={()=>setScreen("course")}/></>;
  if(screen==="exam") return(
    <><style>{CSS}</style>
      <ExamScreen onPass={(s)=>{ setExamScore(s); window.scrollTo(0,0); setScreen("closing"); }}/>
    </>
  );
  if(screen==="closing") return <><style>{CSS}</style><ClosingScreen score={examScore}/></>;

  return(
    <><style>{CSS}</style>
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:DV.bg}}>
      <TopNav modIdx={modIdx} onJump={(i)=>navigate(i,0)} answeredQ={answeredQ} isModDone={isModDone}/>

      {/* Progress bar */}
      {answeredQ > 0 && (
        <div style={{background:DV.navyMd,padding:"6px 20px",flexShrink:0}}>
          <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,height:5,background:"rgba(255,255,255,.1)",borderRadius:3}}>
              <div style={{
                height:5,borderRadius:3,
                background:`linear-gradient(90deg, ${DV.cobalt}, ${DV.teal})`,
                width:`${Math.round(answeredQ/TOTAL_Q*100)}%`,
                transition:"width .5s ease",
              }}/>
            </div>
            <span style={{fontSize:11,color:"rgba(255,255,255,.5)",whiteSpace:"nowrap",fontWeight:600}}>
              {Math.round(answeredQ/TOTAL_Q*100)}% complete
            </span>
          </div>
        </div>
      )}
      <div style={{flex:1,overflowY:"auto",padding:"24px 16px 100px"}}>
        <div key={animKey}>{renderStep()}</div>
      </div>
      {/* Bottom bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:DV.card,borderTop:`1px solid ${DV.border}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,zIndex:10}}>
        <button onClick={goBack} disabled={navHistory.length===0}
          style={{background:"transparent",color:DV.slate,border:`1px solid ${DV.border}`,padding:"9px 18px",borderRadius:8,fontSize:14,cursor:navHistory.length===0?"default":"pointer",opacity:navHistory.length===0?.35:1}}>
          ←
        </button>
        {/* Step dots */}
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          {steps.map((s,i)=>(
            <div key={i} title={stepLabel(s)}
              style={{height:8,borderRadius:4,background:i<stepIdx?DV.cobalt:i===stepIdx?DV.blue:DV.border,width:i===stepIdx?24:8,transition:"all .25s ease",cursor:i<stepIdx?"pointer":"default",flexShrink:0}}
              onClick={()=>{ if(i<stepIdx) navigate(modIdx,i); }}/>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {isLastStep&&!isLastMod&&(
            <span style={{fontSize:12,color:DV.slate}}>
              Next: {ALL_MODS[modIdx+1].type==="intro"?"Overview":`UC ${ALL_MODS[modIdx+1].num}`}
            </span>
          )}
          <button onClick={goNext} disabled={!canContinue()}
            style={{background:canContinue()?DV.cobalt:DV.border,color:canContinue()?DV.white:DV.slate,border:"none",padding:"9px 24px",borderRadius:8,fontSize:14,fontWeight:700,cursor:canContinue()?"pointer":"default",whiteSpace:"nowrap"}}>
            {isLastStep&&isLastMod?(allUseCasesDone()?"Start Final Exam →":"Finish remaining use cases →"):"Continue →"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
