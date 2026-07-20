import { useEffect, useRef, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { ChatBubble } from "@/components/assistant/ChatBubble";
import { TypewriterText } from "@/components/assistant/TypewriterText";
import { CaptureReveal } from "@/components/assistant/CaptureReveal";
import {
  QUICK_PROMPTS,
  CAPTURE_SCRIPTS,
  GREETING,
  FREE_TEXT_FALLBACK,
  routeFreeText,
  type QuickPrompt,
  type CaptureScript,
} from "@/lib/assistantScript";

/**
 * Assistant — the combined AI page (Assistant + Capture in one chat thread).
 * ---------------------------------------------------------------------------
 * A single conversation surface. Prompt chips produce instant, scripted answers
 * pulled from the same selectors as the dashboard/catalogo (numbers match). The
 * capture beat lets you "read" a sample order inline: a scripted reveal with
 * per-line confidence, a preview, and a Conferma that mutates nothing.
 *
 * NOTHING here parses text or calls a model. See src/lib/assistantScript.ts.
 */

// A thread turn. Assistant text turns carry `animate` so only the newest types.
type TextMsg = {
  key: number;
  role: "assistant" | "user";
  kind: "text";
  text: string;
  animate: boolean;
};
type CaptureMsg = { key: number; role: "assistant"; kind: "capture"; script: CaptureScript };
type ThreadMsg = TextMsg | CaptureMsg;
// New messages before a key is assigned (distributive over the union).
type NewMsg = Omit<TextMsg, "key"> | Omit<CaptureMsg, "key">;

export function Assistant() {
  // Seed the thread with the assistant greeting (types in gently on load).
  const [messages, setMessages] = useState<ThreadMsg[]>([
    { key: 0, role: "assistant", kind: "text", text: GREETING, animate: true },
  ]);
  const [draft, setDraft] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  // Textarea starts prefilled with a sample so "paste" is one tap in the demo.
  const [pasteText, setPasteText] = useState(CAPTURE_SCRIPTS[0].rawText);

  // Monotonic key generator for messages.
  const nextKey = useRef(1);
  const add = (msgs: NewMsg[]) =>
    setMessages((prev) => [
      ...prev,
      ...msgs.map((m) => ({ ...m, key: nextKey.current++ }) as ThreadMsg),
    ]);

  // Auto-scroll the thread to the newest message.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // --- handlers -------------------------------------------------------------

  function askPrompt(p: QuickPrompt) {
    add([
      { role: "user", kind: "text", text: p.question, animate: false },
      { role: "assistant", kind: "text", text: p.answer(), animate: true },
    ]);
  }

  function sendDraft(e?: FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    // Loose keyword routing to a scripted answer (NOT parsing); fallback if none.
    const routed = routeFreeText(text);
    add([
      { role: "user", kind: "text", text, animate: false },
      {
        role: "assistant",
        kind: "text",
        text: routed ? routed.answer() : FREE_TEXT_FALLBACK,
        animate: true,
      },
    ]);
    setDraft("");
  }

  function runCapture(script: CaptureScript) {
    add([
      { role: "user", kind: "text", text: script.rawText, animate: false },
      { role: "assistant", kind: "capture", script },
    ]);
    setShowPaste(false);
  }

  return (
    <>
      <PageHeader
        eyebrow="Vendite"
        title="Assistant"
        subtitle="Fai una domanda sulle tue giacenze e vendite, oppure incolla un ordine e lascialo leggere all'assistente."
      />

      {/* Chat panel: scrolling thread + a pinned composer. */}
      <div className="flex h-[70vh] min-h-[460px] flex-col overflow-hidden rounded-card border border-border bg-surface shadow-sm">
        {/* Thread */}
        <div ref={scrollRef} className="flex-1 space-y-s4 overflow-y-auto p-s5">
          {messages.map((m) => (
            <ChatBubble key={m.key} role={m.role}>
              {m.kind === "text" ? (
                <TypewriterText text={m.text} animate={m.animate} />
              ) : (
                <CaptureReveal script={m.script} />
              )}
            </ChatBubble>
          ))}
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-bg p-s4">
          {/* Quick-prompt chips */}
          <div className="mb-s3">
            <p className="mb-s2 text-[12px] font-bold uppercase tracking-[0.08em] text-ink-3">
              Domande rapide
            </p>
            <div className="flex flex-wrap gap-s2">
              {QUICK_PROMPTS.map((p) => (
                <Chip key={p.id} onClick={() => askPrompt(p)}>
                  {p.question}
                </Chip>
              ))}
            </div>
          </div>

          {/* Capture chips + paste affordance */}
          <div className="mb-s3">
            <p className="mb-s2 text-[12px] font-bold uppercase tracking-[0.08em] text-ink-3">
              Leggi un ordine
            </p>
            <div className="flex flex-wrap gap-s2">
              {CAPTURE_SCRIPTS.map((s) => (
                <Chip key={s.id} onClick={() => runCapture(s)}>
                  {s.label}
                </Chip>
              ))}
              <Chip onClick={() => setShowPaste((v) => !v)} emphasis>
                Incolla un ordine
              </Chip>
            </div>
          </div>

          {/* Paste box (scripted: the reveal ignores the actual text). */}
          {showPaste && (
            <div className="mb-s3 rounded-card border border-border bg-surface p-s3">
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-input border border-border-2 bg-bg px-s3 py-s2 text-[14px] leading-relaxed text-ink focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak"
                aria-label="Testo dell'ordine"
              />
              <div className="mt-s2 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => runCapture(CAPTURE_SCRIPTS[0])}>
                  Leggi ordine
                </Button>
              </div>
            </div>
          )}

          {/* Free-text input */}
          <form onSubmit={sendDraft} className="flex items-center gap-s3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Scrivi una domanda…"
              aria-label="Scrivi una domanda"
              className="min-h-[44px] flex-1 rounded-input border border-border-2 bg-bg px-s4 text-[15px] text-ink focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak"
            />
            <Button type="submit" variant="primary" disabled={!draft.trim()}>
              Invia
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

/**
 * Chip — a compact tap target for prompts/samples. Pill, bordered, on-theme.
 * `emphasis` gives the paste affordance a faint accent tint.
 */
function Chip({
  children,
  onClick,
  emphasis = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  emphasis?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex min-h-[40px] items-center rounded-pill border px-s4 text-[13px] font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        emphasis
          ? "border-accent-weak bg-accent-weak text-accent hover:brightness-95"
          : "border-border-2 bg-bg text-ink-2 hover:bg-surface hover:text-ink",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
