import { useState } from "react";

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
    {t:"Evidence gaps post-readout", b:"Primary trials don't answer long-term safety, durability, HCRU, or cost questions. Teams rely on costly extensions or wait years for post-launch data."},
    {t:"Costly site follow-up", b:"LTEs and registries keep sites and patients engaged long after the primary trial — expensive, burdensome, with significant risk of loss-to-follow-up."},
    {t:"Disconnected trial & RWD context", b:"Trial baseline data relies on anticipated needs. Linking to longitudinal RWD unlocks medical history and improves interpretation of trial results."},
    {t:"High-stake questions arriving late", b:"Safety or representativeness concerns often surface near submission. Starting linkage then creates avoidable delay and fire drills."},
  ],
};

const USE_CASES = [
  {
    id:"uc1", type:"usecase", num:1, emoji:"📅",
    title:"Long-Term Follow-Up",
    sub:"Follow patients post-readout via RWD",
    timing:"After trial read-out",
    headline:"Follow trial patients into routine care to capture long-term safety, HCRU, and durability evidence — without costly site extensions.",
    rwdWhy:"Once a trial protocol ends, sponsors lose all visibility of how patients fare in routine care. Site-based LTEs are prohibitively expensive and lose 20–40% of patients. RWD linkage is the only scalable path to long-term evidence.",
    challenges:[
      "Primary trials leave long-term safety, HCRU, and durability evidence unanswered",
      "Site-based LTEs cost millions and risk 20–40% patient loss-to-follow-up",
      "Waiting for post-launch accrual delays payer and HEOR evidence by 18–24 months",
    ],
    without:[
      "Maintain costly site follow-up for years post-trial",
      "Wait 18–24 months for real-world treated patients to accrue post-launch",
      "Run chart retrieval — high-touch, manual, impossible to scale",
      "Design each LTE study individually with no portfolio reuse",
    ],
    with:[
      "Link tokenized trial participants to claims/EHR/mortality immediately at readout",
      "Start evidence generation earlier — no need to wait for post-launch accrual",
      "Reuse one linked trial-RWD cohort across multiple evidence generation studies",
      "Build a reusable data foundation across the full portfolio",
    ],
    value:{ levers:[
      {name:"HEOR efficiency",type:"cost",feasibility:"High",detail:"Reuse one linked cohort across multiple analyses — avoid repeated linkage and study setup"},
      {name:"LT Outcome completeness",type:"cost",feasibility:"High",detail:"Claims and EHR fill evidence gaps beyond trial follow-up, reducing chart retrieval cost"},
      {name:"Lower LTE cost",type:"cost",feasibility:"Medium",detail:"Replace site follow-up with routine-care data for eligible long-term outcomes"},
      {name:"Expanded payer access",type:"rev",feasibility:"Low",detail:"Durability, HCRU, and cost evidence strengthens payer and HTA story"},
    ]},
    discoveryQs:[
      "When your trial reads out, what's your current plan for capturing long-term safety and HCRU evidence?",
      "How long does it typically take your team to stand up a post-launch real-world evidence study after readout?",
      "Are you planning any long-term extension (LTE) studies for current trials? What's driving that decision over an RWD approach?",
    ],
    quizzes:[
      {
        q:"A Phase III cardiovascular trial has just read out. The sponsor needs payer-ready HCRU and durability evidence. What does Datavant LTFU tokenization enable?",
        opts:["Wait 18–24 months for post-launch treated patients to accrue in RWD, then start a claims study","Extend the trial protocol with a 3-year site-based LTE","Link tokenized trial participants to claims/EHR/mortality immediately after protocol follow-up ends","Commission a systematic literature review of similar cardiovascular trials"],
        correct:2,
        explain:"LTFU tokenization links trial-defined patients to routine-care data (claims, EHR, mortality) immediately after protocol follow-up ends — starting evidence generation earlier than waiting for post-launch accrual, without running a separate LTE.",
      },
      {
        q:"A sponsor is weighing two options after their trial reads out: (A) maintain a site-based LTE, or (B) use Datavant LTFU tokenization. What is the key advantage of option B?",
        opts:["LTE extensions are always faster — they use existing site infrastructure already in place","LTFU tokenization follows patients in routine care without relying on sites, avoiding the cost and attrition of active site follow-up","Both options take the same amount of time and cost","Datavant LTFU only works for oncology trials with breakthrough designation"],
        correct:1,
        explain:"LTFU tokenization captures eligible long-term outcomes through routine-care data instead of continued site follow-up — eliminating site monitoring, retention, and patient-contact costs while reducing loss-to-follow-up risk. Unlike LTEs, patients don't need to return to sites.",
      },
    ],
  },
  {
    id:"uc2", type:"usecase", num:2, emoji:"📊",
    title:"Trial Representativeness",
    sub:"Prove your cohort matches the label population",
    timing:"Mid-enrollment (50%, 75%) and at completion",
    headline:"Prove that your enrolled trial population reflects the patients who will actually receive the drug — before FDA asks.",
    rwdWhy:"Without linking the trial cohort to RWD, sponsors only know who enrolled based on site reports with no longitudinal clinical context. External validity concerns surface near submission — when enrollment is locked and nothing can be fixed.",
    challenges:[
      "Site enrollment reports give limited clinical context — no longitudinal history",
      "FDA representativeness concerns often surface near submission, when enrollment is locked",
      "Unaddressed gaps can trigger post-marketing requirements (PMRs) for subgroups",
    ],
    without:[
      "Rely on site reports with little longitudinal clinical context on enrolled patients",
      "Compare standardized CRF data vs. messy real-world measures — apples to oranges",
      "Discover representativeness gaps during submission review — too late to adjust enrollment",
    ],
    with:[
      "Link trial participants to pre-trial RWD for full clinical history (target 90%+ overlap)",
      "Measure both trial and RW cohorts in RWD for a true apples-to-apples baseline",
      "Surface representativeness gaps mid-enrollment while teams can still adjust strategy",
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
    ],
    quizzes:[
      {
        q:"A sponsor's regulatory team is worried FDA may challenge their label population. When should Datavant's trial representativeness analysis ideally be run?",
        opts:["Only after FDA submission when regulators specifically request supporting evidence","Mid-way through enrollment (50%, 75%) and at enrollment completion","Only at Phase III readout once all data are locked","Only when a post-marketing requirement (PMR) is formally issued by FDA"],
        correct:1,
        explain:"Running analysis mid-enrollment (at 50% and 75%) gives sponsors time to identify gaps and adjust enrollment strategy while enrollment is still open. Waiting until submission means the population is locked — gaps can only be addressed reactively, risking multi-month review delays.",
      },
      {
        q:"Datavant targets 90%+ overlap when linking trial participants to pre-trial RWD. Why does this overlap rate matter?",
        opts:["It gives Datavant a larger dataset that increases statistical power for the comparison","It ensures the linked cohort credibly represents the full trial population — not just a subset that may be systematically different","FDA formally requires 90%+ overlap for all representativeness submissions","It reduces Datavant's cost of linkage by minimizing unmatched records"],
        correct:1,
        explain:"90%+ overlap is needed so the linked cohort credibly represents the entire trial population. If only 60% can be linked, the unlinked 40% may differ systematically — undermining the very analysis designed to prove representativeness.",
      },
    ],
  },
  {
    id:"uc3", type:"usecase", num:3, emoji:"🛡️",
    title:"Safety Contextualization",
    sub:"Contextualize unexpected safety signals fast",
    timing:"At 100% enrollment, interim and final analyses",
    headline:"Contextualize unexpected safety signals in weeks — not months — before they become program-threatening delays.",
    rwdWhy:"Without pre-established RWD linkage, when an unexpected safety signal emerges, teams scramble for weeks just to access, link, and harmonize data. Meanwhile, regulators are waiting and enrollment may be on hold.",
    challenges:[
      "CRFs rarely capture baseline risk factors for events that weren't anticipated at study design",
      "Generic external benchmarks may not match the trial population's specific risk profile",
      "Starting RWD linkage after a signal surfaces loses weeks in data access and harmonization",
    ],
    without:[
      "CRF data doesn't capture risk for surprise events — no trial-specific baseline context",
      "External benchmarks don't match the trial population risk profile",
      "Teams scramble for weeks after a signal: data access → linkage → harmonization → analysis",
      "Enrollment holds accumulate while the response is assembled",
    ],
    with:[
      "Pre-link trial participants to pre-trial clinical history and utilization data",
      "Use indicated external cohorts to contextualize expected event background rates",
      "Activate a pre-built rapid-response package — respond to regulators in weeks",
      "Show whether a safety difference reflects baseline risk vs. true treatment effect",
    ],
    value:{ levers:[
      {name:"Program protection",type:"rev",feasibility:"Medium",detail:"Contextualize whether a safety difference is treatment-related or pre-existing, protecting the program from avoidable delay or narrowing"},
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
        q:"A Phase III oncology trial flags an unexpected cardiac safety signal at interim analysis. Datavant RWD linkage was NOT pre-established. What happens?",
        opts:["The team immediately accesses linked RWD and prepares a regulatory response within 2 weeks","The team loses weeks to data access negotiations, linkage, harmonization, and protocol development before any analysis can begin","Datavant's existing ecosystem automatically contextualizes the signal without pre-established linkage","FDA grants an automatic extension for safety signals — standard regulatory practice"],
        correct:1,
        explain:"Without pre-established linkage, teams start from scratch: negotiating data access contracts, building linkage infrastructure, harmonizing event definitions. This process takes weeks to months — during which regulators are waiting and enrollment may be on hold.",
      },
      {
        q:"What is Datavant's 'rapid-response package' for safety contextualization?",
        opts:["A pre-approved FDA response letter template for common safety signals","Pre-mapped data sources, safety event definitions, and harmonization logic — ready to activate when a signal surfaces","A real-time safety monitoring dashboard for trial investigators and DSMBs","A pre-funded insurance policy that reimburses sponsors for enrollment hold costs"],
        correct:1,
        explain:"The rapid-response package pre-maps data sources, safety event definitions, and harmonization logic in advance. When a signal surfaces, teams activate within days rather than spending weeks building infrastructure. It turns a fire drill into a controlled, evidence-based regulatory response.",
      },
      {
        q:"Why does pre-established RWD linkage matter most for late-stage Phase III programs specifically?",
        opts:["Phase III trials have fewer patients, so RWD fills sample size gaps","Late-stage programs have the most to lose from an unexpected safety signal — delayed or narrowed approval has major downstream impact","Regulators only review RWD evidence for Phase III trials and above","Phase III is when CRF data quality deteriorates and RWD is needed as a backup"],
        correct:1,
        explain:"Late-stage Phase III programs represent years of investment and significant future revenue potential. An unexpected safety signal at this stage — without fast contextualization — can result in delayed approval, label narrowing, or enrollment holds. Pre-established linkage is the 'insurance policy' that enables a fast, evidence-based response.",
      },
    ],
  },
  {
    id:"uc4", type:"usecase", num:4, emoji:"⚖️",
    title:"ECA Comparability",
    sub:"Create apples-to-apples external controls",
    timing:"At 100% enrollment, interim and final analyses",
    headline:"Prove your external control patients are truly comparable to your trial patients — using the same RWD measurement basis for both.",
    rwdWhy:"Without linking the trial cohort to RWD, sponsors compare standardized CRF trial data against messy routine-care external control data. Regulators see this as apples-to-oranges — and challenge it, especially for single-arm trials where the ECA is the only comparator.",
    challenges:[
      "CRF trial variables are standardized; external control RWD is captured in noisy routine care — inherently incomparable",
      "Single-arm trial sponsors often lack the evidence depth FDA requires to defend ECA populations",
      "Comparability gaps discovered during FDA review require expensive rework and resubmission",
    ],
    without:[
      "Compare standardized CRF data against routine-care RWD — apples to oranges",
      "Struggle to meet FDA's evidentiary bar for single-arm trial ECA populations",
      "Discover comparability gaps during review — leading to rework, delay, or resubmission",
    ],
    with:[
      "Link trial participants to RWD, then measure both cohorts using the same RWD baseline",
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
        opts:["Large Phase III RCTs with 1,000+ patients in both arms — largest data footprint","Phase I dose-escalation trials — earliest opportunity to establish external control infrastructure","Single-arm trials in rare disease or oncology where no concurrent control is feasible and ECA is the only comparator","Phase II biomarker studies with no primary efficacy endpoint"],
        correct:2,
        explain:"Single-arm trials in rare disease or oncology rely entirely on ECAs to demonstrate treatment benefit — it's their only comparator. FDA requires strong evidence that the ECA is truly comparable to the trial population. Datavant uniquely provides this by measuring both populations using the same RWD baseline.",
      },
    ],
  },
  {
    id:"uc5", type:"usecase", num:5, emoji:"🔍",
    title:"Trial Patient Deduplication",
    sub:"Remove duplicate patients before they cost you",
    timing:"Mid-Phase I / Early Phase II",
    headline:"Detect participants enrolled in multiple trials before duplicate follow-up costs accumulate and evidence integrity is compromised.",
    rwdWhy:"Without tokenized linkage across sites, trials, and phases, sponsors have no scalable way to detect participants enrolled in multiple studies. Professional trial participants deliberately conceal multi-enrollment. Manual site checks never span cross-trial or cross-program overlap.",
    challenges:[
      "Professional participants and duplicate enrollees rarely self-disclose overlapping trial participation",
      "Siloed site checks don't span across trials, phases, programs, or ECA cohorts",
      "Undetected duplicates distort eligibility, safety, and outcome analyses — creating regulatory risk",
    ],
    without:[
      "Rely on self-reporting — professional participants rarely disclose multi-enrollment",
      "Run siloed manual checks that don't span trials, phases, or programs",
      "Risk compromised evidence and regulatory scrutiny if duplicates skew results",
      "Pay per-patient follow-up costs for duplicate patients over years of follow-up",
    ],
    with:[
      "Use tokens to find duplicates across all sites, trials, phases, and cohorts — without moving PII",
      "Identify multi-enrolled and professional participants before they affect analyses",
      "Protect study integrity with clean, defensible analysis populations for regulators",
      "Eliminate wasted follow-up spend by acting at Phase I / Early Phase II",
    ],
    value:{ levers:[
      {name:"Cost avoidance",type:"cost",feasibility:"High",detail:"Remove duplicate patients early — stop paying per-patient follow-up costs for patients who shouldn't be counted"},
      {name:"Program approval protection",type:"rev",feasibility:"Medium",detail:"Clean patient populations produce credible, defensible evidence that holds up to regulatory scrutiny"},
    ]},
    discoveryQs:[
      "How confident are you that patients in your current trials aren't enrolled in multiple arms or competing studies?",
      "What's your current process for detecting duplicate or professional trial participants across sites?",
      "Has your team ever found unexpected overlap between a trial cohort and an ECA cohort?",
    ],
    quizzes:[
      {
        q:"How does Datavant's trial patient deduplication protect patient privacy while detecting duplicate enrollment across sites and trials?",
        opts:["All patient data is fully anonymized using k-anonymity techniques before sharing","Tokens — cryptographic representations of patient identity — detect overlap across sites and trials without moving or revealing any identifiable data","A neutral third-party privacy auditor reviews all matching results before sharing","Only aggregate overlap statistics are shared — individual records are never identified"],
        correct:1,
        explain:"Datavant converts patient PII into a cryptographic token at the source. These tokens can be compared across sites, trials, and phases to identify overlap WITHOUT any identifiable data ever leaving its source system. This is the fundamental privacy-preserving advantage of Datavant's tokenization approach.",
      },
      {
        q:"When is the optimal time to run trial patient deduplication, and what is the primary reason?",
        opts:["At Phase III readout — when all patients have completed follow-up and duplicates can be fully identified","After database lock — to ensure the cleanest possible analysis dataset for submission","Mid-Phase I / Early Phase II — before duplicate follow-up costs accumulate and while analyses can still be adjusted","During FDA review — to proactively respond to any integrity questions from reviewers"],
        correct:2,
        explain:"Mid-Phase I / Early Phase II is optimal because acting early prevents duplicate follow-up costs from compounding across years of the study. Early action also protects study integrity before duplicates can distort interim analyses or eligibility assessments.",
      },
    ],
  },
];

const ALL_MODS = [INTRO, ...USE_CASES];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getSteps(mod) {
  if (mod.type === "intro") return ["overview"];
  return ["why", "story", "value", ...mod.quizzes.map((_,i) => `q${i}`)];
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
            {[{icon:"🧩",val:"5",lbl:"Use Cases"},{icon:"✍️",val:TOTAL_Q,lbl:"Quiz Questions"},{icon:"⏱",val:"~30 min",lbl:"Total Time"}].map((s,i)=>(
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
        <h2 style={{fontSize:18,fontWeight:800,color:DV.white,letterSpacing:"-.02em",marginBottom:10}}>Sponsors need evidence that primary trials don't provide</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {INTRO.problems.map((p,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.07)",borderRadius:8,padding:"10px 14px",borderLeft:"3px solid rgba(0,194,212,.5)"}}>
              <div style={{fontSize:12,fontWeight:700,color:DV.white,marginBottom:3}}>{p.t}</div>
              <p style={{fontSize:11,color:"rgba(255,255,255,.5)",lineHeight:1.5,margin:0}}>{p.b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clickable use case cards — original 3-col layout */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:DV.slate,letterSpacing:".08em",textTransform:"uppercase",marginBottom:10}}>
          5 Use Cases You'll Master · Click any to jump →
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {USE_CASES.map(uc=>(
            <div key={uc.id} onClick={()=>onJumpToUC(uc.id)}
              className="uc-card"
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
          <span style={{background:"rgba(0,194,212,.2)",border:"1px solid rgba(0,194,212,.3)",borderRadius:20,padding:"4px 12px",fontSize:11,color:DV.teal,fontWeight:600}}>⏱ {mod.timing}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
          <span style={{fontSize:44}}>{mod.emoji}</span>
          <h1 style={{fontSize:28,fontWeight:800,color:DV.white,letterSpacing:"-.02em",lineHeight:1.15}}>{mod.title}</h1>
        </div>
        <p style={{fontSize:15,color:"rgba(255,255,255,.75)",lineHeight:1.65,margin:0}}>{mod.headline}</p>
      </div>
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
        <p style={{fontSize:14,color:DV.sub,marginTop:4}}>Value levers and feasibility — use these to qualify and size opportunities with your clients.</p>
      </div>

      {/* Revenue levers */}
      {revLevers.length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:"#166534",letterSpacing:".08em",textTransform:"uppercase",marginBottom:8,paddingLeft:4}}>📈 Revenue Levers</div>
          <div style={{background:DV.card,borderRadius:12,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            {revLevers.map((l,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto",padding:"13px 16px",borderBottom:i<revLevers.length-1?`1px solid ${DV.border}`:"none",background:DV.revBg,gap:12,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:DV.text,marginBottom:3}}>{l.name}</div>
                  <div style={{fontSize:12,color:DV.sub,lineHeight:1.5}}>{l.detail}</div>
                </div>
                <Feasibility level={l.feasibility}/>
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
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto",padding:"13px 16px",borderBottom:i<costLevers.length-1?`1px solid ${DV.border}`:"none",background:DV.costBg,gap:12,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:DV.text,marginBottom:3}}>{l.name}</div>
                  <div style={{fontSize:12,color:DV.sub,lineHeight:1.5}}>{l.detail}</div>
                </div>
                <Feasibility level={l.feasibility}/>
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

// ── Completion ────────────────────────────────────────────────────────────────
function CompleteScreen({answers,onReview,onRetake}){
  const scoreQ=USE_CASES.reduce((a,m)=>a+m.quizzes.filter((_,i)=>answers[`${m.id}-q${i}`]===m.quizzes[i].correct).length,0);
  const pct=Math.round(scoreQ/TOTAL_Q*100);
  const tier=pct>=85?"Trial Tokenization Expert":pct>=65?"Certified Practitioner":"Sales Apprentice";
  return(
    <div style={{minHeight:"100vh",background:DV.bg,fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:DV.black,padding:"14px 32px"}}><span style={{color:DV.white,fontWeight:800,fontSize:18,letterSpacing:"-.02em"}}>datavant</span></div>
      <div style={{maxWidth:580,margin:"56px auto",padding:"0 20px"}}>
        <div style={{background:DV.card,borderRadius:20,padding:"48px 44px",boxShadow:"0 8px 32px rgba(0,0,0,.1)",textAlign:"center"}}>
          <div style={{fontSize:64,marginBottom:12}}>{pct>=85?"🏆":pct>=65?"🎓":"📚"}</div>
          <h1 style={{fontSize:28,fontWeight:800,color:DV.text,marginBottom:6}}>Course Complete</h1>
          <p style={{color:DV.slate,fontSize:14,marginBottom:28}}>Trial Tokenization Value Manifesto</p>
          <div style={{position:"relative",width:120,height:120,margin:"0 auto 20px"}}>
            <svg viewBox="0 0 120 120" style={{width:120,height:120,transform:"rotate(-90deg)"}}>
              <circle cx="60" cy="60" r="50" fill="none" stroke={DV.border} strokeWidth="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke={DV.cobalt} strokeWidth="10"
                strokeDasharray={`${2*Math.PI*50*pct/100} ${2*Math.PI*50}`} strokeLinecap="round"/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:24,fontWeight:800,color:DV.text}}>{pct}%</span>
              <span style={{fontSize:11,color:DV.slate}}>{scoreQ}/{TOTAL_Q}</span>
            </div>
          </div>
          <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:12,padding:"16px 20px",marginBottom:24}}>
            <div style={{fontSize:17,fontWeight:700,color:DV.cobalt,marginBottom:5}}>🏅 {tier}</div>
            <p style={{color:"#3B82F6",fontSize:13,lineHeight:1.55,margin:0}}>{pct>=85?"Outstanding. You're fully equipped to lead trial tokenization conversations.":pct>=65?"Solid foundation. Review use cases where you missed questions.":"Keep at it — revisit the content before your next client conversation."}</p>
          </div>
          <div style={{textAlign:"left",marginBottom:28}}>
            <div style={{fontSize:11,fontWeight:700,color:DV.slate,letterSpacing:".06em",textTransform:"uppercase",marginBottom:10}}>Results by Use Case</div>
            {USE_CASES.map(m=>{
              const s=m.quizzes.filter((_,i)=>answers[`${m.id}-q${i}`]===m.quizzes[i].correct).length;
              return(
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${DV.border}`}}>
                  <span style={{fontSize:16}}>{m.emoji}</span>
                  <span style={{flex:1,fontSize:13,color:DV.sub}}>{m.title}</span>
                  <span style={{fontSize:13,fontWeight:700,color:s===m.quizzes.length?DV.mint:DV.coral}}>{s}/{m.quizzes.length}</span>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center"}}>
            <button onClick={onReview} style={{background:"transparent",color:DV.cobalt,border:`2px solid ${DV.cobalt}`,padding:"11px 24px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>Review Course</button>
            <button onClick={onRetake} style={{background:DV.cobalt,color:"white",border:"none",padding:"11px 24px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>Retake Course</button>
          </div>
        </div>
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

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("landing");
  const [modIdx,setModIdx]=useState(0);
  const [stepIdx,setStepIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [animKey,setAnimKey]=useState(0);
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
  function goNext(){
    if(!isLastStep) navigate(modIdx,stepIdx+1);
    else if(!isLastMod) navigate(modIdx+1,0);
    else setScreen("complete");
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
    if(key==="story") return "Approach";
    if(key==="value") return "Value";
    if(isQuizStep(key)) return `Q${qIdx(key)+1}`;
  }

  if(screen==="landing") return <><style>{CSS}</style><Landing onStart={()=>setScreen("course")}/></>;
  if(screen==="complete") return(
    <><style>{CSS}</style>
      <CompleteScreen answers={answers}
        onReview={()=>{setModIdx(1);setStepIdx(0);setScreen("course");}}
        onRetake={()=>{setAnswers({});setModIdx(0);setStepIdx(0);setScreen("course");}}/>
    </>
  );

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
            {isLastStep&&isLastMod?"Finish 🎓":"Continue →"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
