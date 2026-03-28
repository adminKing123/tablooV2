'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import { createProjectAction } from '@/app/actions/project';
import Button from '@/components/ui/Button';
import { XMarkIcon, CheckIcon } from '@/assets/icons';

// ─── Config ───────────────────────────────────────────────────────────────────

const PROJECT_ICONS = ['📁', '🚀', '💡', '🎯', '⚡', '🔥', '🛠️', '🎨', '📊', '🌟', '🏆', '💎', '🔮', '🌈', '🦋', '🎪'];

const PROJECT_COLORS = [
  { value: '#6366f1', label: 'Indigo'  },
  { value: '#8b5cf6', label: 'Violet'  },
  { value: '#ec4899', label: 'Pink'    },
  { value: '#ef4444', label: 'Red'     },
  { value: '#f97316', label: 'Orange'  },
  { value: '#eab308', label: 'Yellow'  },
  { value: '#22c55e', label: 'Green'   },
  { value: '#14b8a6', label: 'Teal'    },
  { value: '#3b82f6', label: 'Blue'    },
  { value: '#64748b', label: 'Slate'   },
];

const VISIBILITY_OPTIONS = [
  {
    value: 'PRIVATE',
    label: 'Private',
    description: 'Only you can see this project',
    icon: '🔒',
  },
  {
    value: 'TEAM',
    label: 'Team',
    description: 'Everyone in your workspace can view',
    icon: '👥',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepDots({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            'rounded-full transition-all duration-200',
            i + 1 === current
              ? 'w-5 h-1.5 bg-indigo-500'
              : i + 1 < current
                ? 'w-1.5 h-1.5 bg-indigo-300 dark:bg-indigo-600'
                : 'w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * NewProjectModal — ClickUp-style 3-step project creation modal.
 *
 * Step 1 — Name & icon + colour picker
 * Step 2 — Description (optional)
 * Step 3 — Visibility
 *
 * On success the server action returns { success: true } and the modal closes.
 * The workspace page re-renders automatically via revalidatePath.
 */
export default function NewProjectModal({ onClose }) {
  const [step, setStep]               = useState(1);
  const [name, setName]               = useState('');
  const [icon, setIcon]               = useState('📁');
  const [color, setColor]             = useState('#6366f1');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility]   = useState('PRIVATE');

  const [state, formAction, pending] = useActionState(createProjectAction, null);
  const nameRef = useRef(null);

  // Close on success
  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  // Auto-focus name on open
  useEffect(() => { nameRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const canProceed = {
    1: name.trim().length > 0,
    2: true, // description is optional
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-black/40 border border-slate-200 dark:border-slate-700 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Create a new project
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step dots */}
        <div className="px-6 pt-4">
          <StepDots current={step} total={3} />
        </div>

        <form action={formAction}>
          {/* Hidden inputs carry data across steps */}
          <input type="hidden" name="name"        value={name} />
          <input type="hidden" name="icon"        value={icon} />
          <input type="hidden" name="color"       value={color} />
          <input type="hidden" name="description" value={description} />
          <input type="hidden" name="visibility"  value={visibility} />

          <div className="px-6 pb-6 space-y-5">

            {/* ── Step 1 — Name, icon & colour ────────────────────── */}
            {step === 1 && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Step 1 of 3</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Give your project a name and personality.</p>
                </div>

                {/* Name input */}
                <div className="space-y-1">
                  <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Project name
                  </label>
                  <input
                    ref={nameRef}
                    id="projectName"
                    type="text"
                    placeholder="e.g. Marketing Campaign, Backend API…"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={100}
                    name=""
                    className="block w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-400 dark:hover:border-slate-500 transition-all"
                  />
                </div>

                {/* Icon picker */}
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Icon</p>
                  <div className="grid grid-cols-8 gap-1.5">
                    {PROJECT_ICONS.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setIcon(em)}
                        className={[
                          'w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all',
                          icon === em
                            ? 'bg-indigo-100 dark:bg-indigo-950/60 ring-2 ring-indigo-500 scale-110'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700',
                        ].join(' ')}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colour picker */}
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Colour</p>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        title={c.label}
                        className={[
                          'w-7 h-7 rounded-full transition-all',
                          color === c.value ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 scale-110' : 'hover:scale-105',
                        ].join(' ')}
                        style={{ background: c.value }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  fullWidth
                  size="lg"
                  disabled={!canProceed[1]}
                  onClick={() => setStep(2)}
                >
                  Continue
                </Button>
              </>
            )}

            {/* ── Step 2 — Description ─────────────────────────────── */}
            {step === 2 && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Step 2 of 3</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">What is this project about? <span className="text-slate-400">(optional)</span></p>
                </div>

                {/* Preview chip */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: color }}
                  >
                    {icon}
                  </div>
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{name}</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe what this project is for, its goals, or any useful context…"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={500}
                    className="block w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-400 dark:hover:border-slate-500 transition-all"
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
                    {description.length}/500
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" fullWidth size="lg" onClick={() => setStep(3)}>Continue</Button>
                </div>
              </>
            )}

            {/* ── Step 3 — Visibility ──────────────────────────────── */}
            {step === 3 && (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Step 3 of 3</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Who can access this project?</p>
                </div>

                <div className="space-y-2.5">
                  {VISIBILITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setVisibility(opt.value)}
                      className={[
                        'w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all focus:outline-none',
                        visibility === opt.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600',
                      ].join(' ')}
                    >
                      <span className="text-2xl shrink-0">{opt.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{opt.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.description}</p>
                      </div>
                      {visibility === opt.value && (
                        <div className="ml-auto shrink-0 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                          <CheckIcon className="w-2.5" stroke="white" strokeWidth={1.5} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {state?.error && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{state.error}</p>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep(2)}>Back</Button>
                  <Button type="submit" fullWidth size="lg" loading={pending}>
                    Create Project
                  </Button>
                </div>
              </>
            )}

          </div>
        </form>
      </div>
    </div>
  );
}
