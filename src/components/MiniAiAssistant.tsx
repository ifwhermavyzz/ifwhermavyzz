import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Send, Sparkles, Star, X } from 'lucide-react';
import { COMMITTEES } from '../data/committees';

type ChatState =
  | 'welcome'
  | 'choose_committee'
  | 'committee_actions'
  | 'basics_explained'
  | 'awaiting_topic'
  | 'speech_generated'
  | 'awaiting_speech_review'
  | 'speech_reviewed'
  | 'experienced_menu';

type CommitteeId = 'UNEP' | 'UNCSW' | 'AIPPM' | 'IPL' | 'CBI' | 'IPC';
type SelectableCommitteeId = CommitteeId | 'UNHRC' | 'Surprise';

interface StructuredLine {
  label: string;
  body: string;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text?: string;
  lines?: StructuredLine[];
}

const COMMITTEE_BUTTONS: CommitteeId[] = ['UNEP', 'UNCSW', 'AIPPM', 'IPL', 'CBI', 'IPC'];

function getCommitteeProcedure(committeeId: CommitteeId): string {
  if (committeeId === 'UNCSW' || committeeId === 'UNEP') {
    return "Here is the flow: 1. Roll Call. 2. Setting the Agenda. 3. General Speakers' List (GSL). 4. Moderated & Unmoderated Caucuses. 5. Drafting Resolutions & Voting.";
  } else if (committeeId === 'AIPPM') {
    return 'AIPPM is domestic politics! The flow is: 1. Roll Call. 2. Opening Statements (instead of GSL). 3. Moderated/Unmoderated Caucuses to form alliances. 4. Crisis/Breaking News (sudden updates). 5. Drafting a Joint Communiqué or Bill.';
  } else if (committeeId === 'CBI') {
    return 'CBI is an investigation, no GSL! The flow is: 1. Roll Call & Case Briefing. 2. Round-Robin (initial theories). 3. Crisis Loop: Passing secret Chits/Directives and Unmoderated Caucuses. 4. Crisis Updates & Suspect Interrogations. 5. Drafting the Final Charge Sheet.';
  } else if (committeeId === 'IPL') {
    return 'IPL is a business simulation, no debates! The flow is: 1. Roll Call & Purse Verification (e.g., ₹100 Cr). 2. Marquee/Capped Player Sets. 3. Live Bidding (using placards). 4. Accelerated Round for unsold players. 5. Final Team Evaluation.';
  } else {
    return 'IPC is journalism! The flow is: 1. Beat Allocation (assigned a committee and news agency). 2. Committee Observation (note-taking). 3. Press Conferences (asking tough questions). 4. Drafting Articles/Editing Photos. 5. Newsletter Publication.';
  }
}

const EXPERIENCED_TOPICS = ['Mod/Unmod', 'GSL Rules', 'Draft Resolutions'] as const;

const EXPERIENCED_ANSWERS: Record<(typeof EXPERIENCED_TOPICS)[number], string> = {
  'Mod/Unmod':
    'Moderated Caucuses set a fixed total time and speaking time per delegate (e.g., 10 min / 60s) on a narrow sub-topic. Unmoderated Caucuses suspend formal procedure for direct lobbying and resolution drafting.',
  'GSL Rules':
    'The General Speakers’ List remains open throughout standard UN committees unless paused by a caucus. Standard turns run 90 seconds, and leftover time may be yielded to the Chair, Questions, or another delegate.',
  'Draft Resolutions':
    'Draft Resolutions require minimum sponsors and signatories, pair italicized Preambulatory clauses with numbered action-oriented Operative clauses, and pass by simple majority once formally introduced.',
};

function getCommitteeBasics(committeeId: SelectableCommitteeId): string {
  if (committeeId === 'UNEP' || committeeId === 'UNCSW') {
    return "Basics for UN Committees: It starts with Roll Call, then the General Speakers' List (GSL) for opening speeches. Then we move to Moderated Caucuses (formal debate on sub-topics) and Unmoderated Caucuses (informal alliances). Finally, you draft and vote on Resolutions.";
  } else if (committeeId === 'IPL') {
    return 'Basics for IPL Auction: There is NO GSL or debate here! You are a team owner. Basics mean understanding the Purse (budget), Base Price, Bidding increments, and using Right to Match (RTM) cards strategically.';
  } else if (committeeId === 'CBI') {
    return 'Basics for Crisis Committee: There is NO GSL here! Basics mean understanding how to write Directives/Chits to give orders to the Executive Board, reacting to sudden Crisis Updates, and interrogating suspects.';
  } else if (committeeId === 'AIPPM') {
    return 'Basics for AIPPM: It is Indian politics. There is no GSL, instead, you give Opening Statements. Basics include using Points of Order, arguing on bills, and drafting a Joint Communiqué.';
  } else if (committeeId === 'IPC') {
    return 'Basics for IPC: You are a journalist! Basics mean knowing your Beat (which committee you cover), writing articles/editorials before strict deadlines, and asking tough questions in Press Conferences.';
  } else {
    return 'That chamber is Classified. Wait for the reveal! 🌟';
  }
}

function buildSpeechLines(committeeId: SelectableCommitteeId | null, topic: string): StructuredLine[] {
  const committee = COMMITTEES.find((c) => c.id === committeeId);
  const committeeLabel = committee ? `${committee.name} (${committee.acronym})` : 'this committee';

  return [
    {
      label: '1. Opening Hook',
      body: `Honorable Chair and fellow delegates—every delayed action on ${topic} carries a human and institutional cost we can no longer afford to overlook inside ${committeeLabel}.`,
    },
    {
      label: '2. Country Stance',
      body: `Our delegation firmly believes that addressing ${topic} demands binding transparency, equitable resource-sharing, and measurable accountability rather than non-binding pledges alone.`,
    },
    {
      label: '3. Solutions',
      body: `To resolve ${topic}, we propose: (1) an independent verification mechanism, (2) targeted capacity funding for vulnerable stakeholders, and (3) clear compliance timelines. Thank you—we yield the floor.`,
    },
  ];
}

function isClassifiedSeventhQuery(input: string): boolean {
  const q = input.toLowerCase();
  return (
    q.includes('unhrc') ||
    q.includes('7th chamber') ||
    q.includes('7th committee') ||
    q.includes('seventh chamber') ||
    q.includes('seventh committee')
  );
}

function isSurpriseCommitteesQuery(input: string): boolean {
  const q = input.toLowerCase();
  return q.includes('surprise') || q.includes('mystery');
}

function isVenueOrDateQuery(input: string): boolean {
  const q = input.toLowerCase();
  return (
    q.includes('venue') ||
    q.includes('date') ||
    q.includes('when is') ||
    q.includes('where is') ||
    q.includes('location')
  );
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    sender: 'assistant',
    text: "Hi! I'm Mini Aura. Is this your first MUN?",
  },
];

export const MiniAiAssistant = React.memo(function MiniAiAssistant() {
  const [open, setOpen] = useState(false);
  const [chatState, setChatState] = useState<ChatState>('welcome');
  const [selectedCommittee, setSelectedCommittee] = useState<SelectableCommitteeId | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [speechDraft, setSpeechDraft] = useState('');

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, chatState, open]);

  const appendExchange = (userText: string, botReply: Omit<ChatMessage, 'id' | 'sender'>) => {
    const now = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: `user-${now}`, sender: 'user', text: userText },
      { id: `bot-${now + 1}`, sender: 'assistant', ...botReply },
    ]);
  };

  const handleReset = () => {
    setChatState('welcome');
    setSelectedCommittee(null);
    setMessages(INITIAL_MESSAGES);
    setInput('');
    setSpeechDraft('');
  };

  const handleBeginnerSelect = () => {
    appendExchange("Yes, I'm a beginner", {
      text: 'Awesome! Which committee are you in?',
    });
    setChatState('choose_committee');
  };

  const handleExperiencedSelect = () => {
    appendExchange('No, I have experience', {
      text: 'Welcome back to the floor, seasoned delegate! Which tactical brief do you need?',
    });
    setChatState('experienced_menu');
  };

  const handleCommitteeSelect = (id: CommitteeId) => {
    const committee = COMMITTEES.find((c) => c.id === id);
    if (!committee) return;

    setSelectedCommittee(id);
    appendExchange(id, {
      lines: [
        { label: 'Full Form', body: committee.name },
        { label: 'Agenda', body: committee.agenda },
        { label: 'How it works', body: getCommitteeProcedure(id) },
      ],
    });
    setChatState('committee_actions');
  };

  const handleClearBasics = () => {
    if (!selectedCommittee) {
      appendExchange('Clear my Basics', {
        text: 'Which committee are you in? Select your committee first so I can explain the exact basics for your chamber!',
      });
      setChatState('choose_committee');
      return;
    }

    appendExchange('Clear my Basics', {
      text: getCommitteeBasics(selectedCommittee),
    });
    setChatState('basics_explained');
  };

  const handlePromptSpeechTopic = () => {
    const label = selectedCommittee ? ` for ${selectedCommittee}` : '';
    appendExchange('Generate a Speech', {
      text: `Sure! What Topic${label} would you like to speak on? Type your topic below.`,
    });
    setChatState('awaiting_topic');
  };

  const handleOpenSpeechReview = () => {
    appendExchange('Review my Speech', {
      text: 'Paste your draft speech below and submit it—I’ll give you instant diplomatic feedback!',
    });
    setChatState('awaiting_speech_review');
  };

  const handleSubmitSpeechReview = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = speechDraft.trim();
    if (!trimmed) return;

    if (isClassifiedSeventhQuery(trimmed)) {
      appendExchange(trimmed, {
        text: 'That chamber is Classified. Wait for the reveal! 🌟',
      });
      setSpeechDraft('');
      return;
    }

    if (isSurpriseCommitteesQuery(trimmed)) {
      appendExchange(trimmed, {
        text: 'We have 1 confirmed mystery chamber, and 3-4 more surprise committees will be revealed based on the number of delegates! Register now to unlock them. 🌟',
      });
      setSpeechDraft('');
      return;
    }

    if (isVenueOrDateQuery(trimmed)) {
      appendExchange(trimmed, {
        text: 'The official venue and dates are currently To Be Announced (TBA). Follow our Instagram for the big reveal! 📅',
      });
      setSpeechDraft('');
      return;
    }

    const preview = trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
    appendExchange(`Submitted speech: "${preview}"`, {
      text: 'Great effort! Make sure to use third-person diplomatic language (e.g., "The delegation of India believes...") and keep it under 60 seconds.',
    });
    setSpeechDraft('');
    setChatState('speech_reviewed');
  };

  const handleExperiencedTopic = (topic: (typeof EXPERIENCED_TOPICS)[number]) => {
    appendExchange(topic, {
      lines: [{ label: topic, body: EXPERIENCED_ANSWERS[topic] }],
    });
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');

    // Guard classified UNHRC / 7th chamber across every state
    if (isClassifiedSeventhQuery(trimmed)) {
      appendExchange(trimmed, {
        text: 'That chamber is Classified. Wait for the reveal! 🌟',
      });
      return;
    }

    // Surprise Committees query
    if (isSurpriseCommitteesQuery(trimmed)) {
      appendExchange(trimmed, {
        text: 'We have 1 confirmed mystery chamber, and 3-4 more surprise committees will be revealed based on the number of delegates! Register now to unlock them. 🌟',
      });
      return;
    }

    // Venue & Dates query
    if (isVenueOrDateQuery(trimmed)) {
      appendExchange(trimmed, {
        text: 'The official venue and dates are currently To Be Announced (TBA). Follow our Instagram for the big reveal! 📅',
      });
      return;
    }

    // Topic capture step for Generate a Speech
    if (chatState === 'awaiting_topic') {
      appendExchange(trimmed, {
        text: `Here is your 3-paragraph ${selectedCommittee ?? 'MUN'} speech structure on "${trimmed}":`,
        lines: buildSpeechLines(selectedCommittee, trimmed),
      });
      setChatState('speech_generated');
      return;
    }

    const lower = trimmed.toLowerCase();

    // Direct or mentioned committee match
    const matchedCommittee = COMMITTEE_BUTTONS.find(
      (id) =>
        lower === id.toLowerCase() ||
        new RegExp(`\\b${id.toLowerCase()}\\b`).test(lower)
    );
    if (matchedCommittee) {
      handleCommitteeSelect(matchedCommittee);
      return;
    }

    if (lower.includes('beginner') || lower === 'yes') {
      handleBeginnerSelect();
      return;
    }
    if (lower.includes('experience') || lower === 'no') {
      handleExperiencedSelect();
      return;
    }
    if (lower.includes('basic') || lower.includes('gsl') || lower.includes('unmod')) {
      handleClearBasics();
      return;
    }
    if (lower.includes('generate') || lower.includes('speech')) {
      handlePromptSpeechTopic();
      return;
    }
    if (lower.includes('review')) {
      handleOpenSpeechReview();
      return;
    }
    if (
      lower.includes('founder') ||
      lower.includes('trisha') ||
      lower.includes('navya') ||
      lower.includes('ishana') ||
      lower.includes('mayank') ||
      lower.includes('contact')
    ) {
      appendExchange(trimmed, {
        text: 'You can reach our Secretariat Heads via WhatsApp in the Contact section above the footer: Trisha Goyal (Founder & Director: +91 9625048317), Navya (Director General: +91 7292070031), Ishana (President: +91 8287139193), and Mayank (Head of Tech: +91 8178026845).',
      });
      return;
    }

    appendExchange(trimmed, {
      text: 'Use the interactive chips above to navigate your MUN prep, pick a committee (UNEP, UNCSW, AIPPM, IPL, CBI, IPC), or ask about Surprise Committees, Venue, or Dates!',
    });
  };

  const chipClass =
    'rounded-full border border-[#D4AF37]/40 bg-[#24160E]/90 px-3 py-1.5 text-[11px] font-medium text-[#F3E5AB] transition-all duration-150 hover:border-[#D4AF37] hover:bg-[#D4AF37]/18 hover:text-white hover:shadow-[0_0_16px_rgba(212,175,55,0.3)]';

  return (
    <div className="pb-safe mb-safe fixed right-4 bottom-4 z-[9990] flex max-w-[calc(100vw-2rem)] flex-col items-end sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.div
            key="mini-aura-window"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Mini Aura MUN Guide"
            className="relative mb-3 flex max-h-[calc(100dvh-6.5rem)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-[#D4AF37]/45 bg-[#1A100A]/96 shadow-[0_24px_80px_-10px_rgba(0,0,0,0.92),0_0_34px_-8px_rgba(212,175,55,0.3)] backdrop-blur-md will-change-transform md:bg-[#1A100A]/94 md:backdrop-blur-xl"
          >
            {/* Sci-Fi Golden Top Hairline */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F3E5AB]/85 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 right-4 h-32 w-32 rounded-full bg-[#D4AF37]/12 blur-2xl"
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-[#D4AF37]/25 bg-[#1A100A]/95 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-gradient-to-br from-[#D4AF37]/25 to-[#1A100A] shadow-[0_0_18px_rgba(212,175,55,0.45)]">
                  <Star className="h-4 w-4 fill-[#F3E5AB] text-[#F3E5AB]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold tracking-wide text-white">
                    Mini Aura
                  </h3>
                  <p className="flex items-center gap-1 text-[11px] tracking-wide text-[#D4AF37]">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    <span>Interactive MUN Guide</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Restart Mini Aura conversation"
                  title="Start Over"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[#D6C7B2] transition-colors hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close Mini Aura"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[#D6C7B2] transition-colors hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div
              ref={listRef}
              data-lenis-prevent
              className="relative z-10 flex min-h-[150px] max-h-[42dvh] flex-1 flex-col gap-3 overflow-y-auto px-3.5 py-3.5 sm:max-h-72 sm:min-h-[220px] sm:px-4 sm:py-4"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C667] font-medium text-[#1A100A] shadow-[0_6px_18px_-4px_rgba(212,175,55,0.45)]'
                        : 'border border-[#D4AF37]/25 bg-[#120A06]/85 text-[#FAF6EE]'
                    }`}
                  >
                    {msg.text && <p>{msg.text}</p>}
                    {msg.lines && (
                      <div className={msg.text ? 'mt-2.5 space-y-2' : 'space-y-2'}>
                        {msg.lines.map((line) => (
                          <div
                            key={line.label}
                            className="rounded-xl border border-[#D4AF37]/15 bg-[#1A100A]/75 px-2.5 py-2"
                          >
                            <span className="block text-[11px] font-semibold tracking-wide text-[#F3E5AB]">
                              {line.label}
                            </span>
                            <span className="mt-0.5 block text-[11.5px] leading-relaxed text-[#E6DAC6]">
                              {line.body}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* State-Driven Interactive Chip Tray / Speech Input */}
            <div className="relative z-10 border-t border-[#D4AF37]/20 bg-[#120A06]/75 px-3.5 py-3">
              <AnimatePresence mode="wait">
                {chatState === 'welcome' && (
                  <motion.div
                    key="state-welcome"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap gap-2"
                  >
                    <motion.button
                      type="button"
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleBeginnerSelect}
                      className={chipClass}
                    >
                      Yes, I&apos;m a beginner
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleExperiencedSelect}
                      className={chipClass}
                    >
                      No, I have experience
                    </motion.button>
                  </motion.div>
                )}

                {chatState === 'choose_committee' && (
                  <motion.div
                    key="state-committees"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {COMMITTEE_BUTTONS.map((id) => (
                      <motion.button
                        key={id}
                        type="button"
                        whileHover={{ y: -1, scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCommitteeSelect(id)}
                        className={chipClass}
                      >
                        {id}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {(chatState === 'committee_actions' ||
                  chatState === 'basics_explained' ||
                  chatState === 'speech_generated' ||
                  chatState === 'speech_reviewed') && (
                  <motion.div
                    key="state-actions"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    <motion.button
                      type="button"
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleClearBasics}
                      className={chipClass}
                    >
                      Clear my Basics
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handlePromptSpeechTopic}
                      className={chipClass}
                    >
                      Generate a Speech
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleOpenSpeechReview}
                      className={chipClass}
                    >
                      Review my Speech
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setChatState('choose_committee')}
                      className="rounded-full border border-[#D4AF37]/20 bg-transparent px-2.5 py-1.5 text-[11px] text-[#C5B49A] transition-colors hover:border-[#D4AF37]/45 hover:text-[#F3E5AB]"
                    >
                      Switch Committee
                    </motion.button>
                  </motion.div>
                )}

                {chatState === 'awaiting_topic' && (
                  <motion.div
                    key="state-awaiting-topic"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between gap-2 text-[11px] text-[#D6C7B2]"
                  >
                    <span>Type your speech topic below and hit Send.</span>
                    <button
                      type="button"
                      onClick={() => setChatState('committee_actions')}
                      className="shrink-0 text-[#D4AF37] underline underline-offset-2 hover:text-[#F3E5AB]"
                    >
                      Back
                    </button>
                  </motion.div>
                )}

                {chatState === 'awaiting_speech_review' && (
                  <motion.form
                    key="state-speech-review"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmitSpeechReview}
                    className="space-y-2"
                  >
                    <textarea
                      rows={3}
                      value={speechDraft}
                      onChange={(e) => setSpeechDraft(e.target.value)}
                      placeholder="Paste your MUN speech here for instant feedback..."
                      className="w-full resize-none rounded-2xl border border-[#D4AF37]/35 bg-[#1A100A]/90 px-3 py-2 text-base text-white placeholder-[#C5B49A]/65 outline-none focus:border-[#D4AF37] sm:text-xs"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setChatState(selectedCommittee ? 'committee_actions' : 'welcome')
                        }
                        className="rounded-full px-3 py-1.5 text-[11px] text-[#C5B49A] hover:text-white"
                      >
                        Cancel
                      </button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C667] px-4 py-1.5 text-[11px] font-semibold text-[#1A100A] shadow-[0_0_16px_rgba(212,175,55,0.4)]"
                      >
                        Submit for Review
                      </motion.button>
                    </div>
                  </motion.form>
                )}

                {chatState === 'experienced_menu' && (
                  <motion.div
                    key="state-experienced"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap gap-1.5"
                  >
                    {EXPERIENCED_TOPICS.map((topic) => (
                      <motion.button
                        key={topic}
                        type="button"
                        whileHover={{ y: -1, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleExperiencedTopic(topic)}
                        className={chipClass}
                      >
                        {topic}
                      </motion.button>
                    ))}
                    <motion.button
                      type="button"
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setChatState('choose_committee')}
                      className="rounded-full border border-[#D4AF37]/20 bg-transparent px-2.5 py-1.5 text-[11px] text-[#C5B49A] transition-colors hover:border-[#D4AF37]/45 hover:text-[#F3E5AB]"
                    >
                      Explore Committees
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Text Input */}
            <form
              onSubmit={handleTextSubmit}
              className="relative z-10 flex items-center gap-2 border-t border-[#D4AF37]/25 bg-[#1A100A]/95 px-3 py-2.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  chatState === 'awaiting_topic'
                    ? 'Enter your speech topic (e.g., Marine Plastics)...'
                    : 'Ask about committees, venue, dates...'
                }
                className="min-w-0 flex-1 bg-transparent px-2 py-1 text-base text-white placeholder-[#C5B49A]/70 outline-none sm:text-xs"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label="Send message to Mini Aura"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C667] text-[#1A100A] shadow-[0_0_16px_rgba(212,175,55,0.5)] sm:h-8 sm:w-8"
              >
                <Send className="h-3.5 w-3.5" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button with Glowing Golden Star Icon */}
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ y: -2, scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={open}
        aria-label={open ? 'Close Mini Aura' : 'Open Mini Aura'}
        className="aurora-glass-pill group relative inline-flex h-12 items-center gap-2 rounded-full border border-[#D4AF37]/55 bg-[#1A100A]/92 px-3.5 text-xs font-semibold tracking-wide text-[#F3E5AB] shadow-[0_12px_36px_-6px_rgba(212,175,55,0.5)] transition-all duration-200 will-change-transform hover:border-[#D4AF37] hover:shadow-[0_0_32px_rgba(212,175,55,0.75)] sm:h-[52px] sm:gap-2.5 sm:px-4"
      >
        <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#B57E28] text-[#1A100A] shadow-[0_0_18px_rgba(243,229,171,0.85)]">
          {open ? (
            <X className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4 fill-[#1A100A] text-[#1A100A]" />
          )}
        </span>
        <span className="whitespace-nowrap text-white">Mini Aura</span>
      </motion.button>
    </div>
  );
});
