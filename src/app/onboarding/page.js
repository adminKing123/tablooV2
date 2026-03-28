'use client';

import { useState, useActionState, use } from 'react';
import { completeOnboardingAction, skipOnboardingAction } from '@/app/actions/onboarding';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import {
  BriefcaseIcon, UserIcon, AcademicCapIcon,
  UsersIcon, BuildingOfficeIcon, ArrowRightIcon, SparklesIcon, CheckCircleIcon,
} from '@/assets/icons';

// ─── Step data ────────────────────────────────────────────────────────────────

const ROLES = [
  { value: 'Developer / Engineer', icon: '💻' },
  { value: 'Designer',             icon: '🎨' },
  { value: 'Product Manager',      icon: '🗺️' },
  { value: 'Marketing',            icon: '📣' },
  { value: 'Sales',                icon: '💼' },
  { value: 'Founder / CEO',        icon: '🚀' },
  { value: 'Student',              icon: '🎓' },
  { value: 'Other',                icon: '✨' },
];

const USAGE_OPTIONS = [
  {
    value: 'WORK',
    label: 'Work',
    description: 'Manage projects, track tasks, and collaborate with your team',
    icon: BriefcaseIcon,
    color: 'indigo',
  },
  {
    value: 'PERSONAL',
    label: 'Personal',
    description: 'Organise your personal goals, side projects, and productivity',
    icon: UserIcon,
    color: 'violet',
  },
  {
    value: 'SCHOOL',
    label: 'School',
    description: 'Track coursework, deadlines, and study goals',
    icon: AcademicCapIcon,
    color: 'sky',
  },
];

const TEAM_SIZES = [
  { value: 'SOLO',  label: 'Just me',  icon: '🙋' },
  { value: '2-5',   label: '2 – 5',    icon: '👥' },
  { value: '6-15',  label: '6 – 15',   icon: '👨‍👩‍👧‍👦' },
  { value: '16-50', label: '16 – 50',  icon: '🏢' },
  { value: '50+',   label: '50+',      icon: '🏙️' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Clickable card used in all selection steps. */
function SelectCard({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
        selected
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 shadow-sm'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

/** Step progress indicator at the top. */
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            'h-1.5 rounded-full transition-all duration-300',
            i + 1 <= current
              ? 'bg-indigo-500 flex-1'
              : 'bg-slate-200 dark:bg-slate-700 flex-1',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * OnboardingPage — 4-step profile completion wizard.
 *
 * Steps:
 *  1 — What's your role?
 *  2 — What will you use Tabloo for?
 *  3 — How big is your team?
 *  4 — Name your workspace
 *
 * All state is local; a single <form> submits everything to the server action
 * on the final step. Hidden inputs carry data from previous steps.
 */
export default function OnboardingPage({ searchParams }) {
  const params    = use(searchParams);
  const firstName = params?.name ?? 'there';

  const [step, setStep]                = useState(1);
  const [jobTitle, setJobTitle]        = useState('');
  const [customRole, setCustomRole]    = useState('');
  const [usageType, setUsageType]      = useState('');
  const [teamSize, setTeamSize]        = useState('');
  const [workspaceName, setWorkspaceName] = useState(
    firstName !== 'there' ? `${firstName}'s Workspace` : ''
  );

  const [state, formAction, pending] = useActionState(completeOnboardingAction, null);
  const [skipping, setSkipping]      = useState(false);

  // If the server action returns a step hint, jump back to that step
  const errorStep = state?.step ?? null;
  if (errorStep && errorStep !== step) setStep(errorStep);

  const resolvedRole = jobTitle === 'Other' ? customRole.trim() : jobTitle;

  const canAdvance = {
    1: resolvedRole.length > 0,
    2: usageType.length > 0,
    3: teamSize.length > 0,
    4: workspaceName.trim().length > 0,
  };

  const handleSkip = async () => {
    setSkipping(true);
    const formData = new FormData();
    await skipOnboardingAction(null, formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white text-sm">Tabloo</span>
        </div>

        {/* Skip */}
        <button
          type="button"
          onClick={handleSkip}
          disabled={skipping}
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
        >
          {skipping ? 'Skipping…' : 'Skip for now'}
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 pt-8 pb-16">
        <div className="w-full max-w-lg">

          <StepIndicator current={step} total={4} />

          <form action={formAction}>
            {/* Hidden inputs for all collected data */}
            <input type="hidden" name="jobTitle"      value={resolvedRole} />
            <input type="hidden" name="usageType"     value={usageType} />
            <input type="hidden" name="teamSize"      value={teamSize} />
            <input type="hidden" name="workspaceName" value={workspaceName} />

            {/* ── Step 1 — Role ──────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">Step 1 of 4</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                    What&apos;s your role?
                  </h1>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    This helps us personalise your experience.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(role => (
                    <SelectCard
                      key={role.value}
                      selected={jobTitle === role.value}
                      onClick={() => setJobTitle(role.value)}
                    >
                      <span className="text-lg mr-2">{role.icon}</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {role.value}
                      </span>
                    </SelectCard>
                  ))}
                </div>

                {jobTitle === 'Other' && (
                  <Input
                    id="customRole"
                    label="Tell us your role"
                    placeholder="e.g. Data Analyst, DevOps Engineer…"
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value)}
                    autoFocus
                  />
                )}

                <Button
                  type="button"
                  fullWidth
                  size="lg"
                  disabled={!canAdvance[1]}
                  onClick={() => setStep(2)}
                  className="mt-2"
                >
                  Continue
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* ── Step 2 — Usage type ────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">Step 2 of 4</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                    What will you use Tabloo for?
                  </h1>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    We&apos;ll tailor your dashboard to fit your needs.
                  </p>
                </div>

                <div className="space-y-3">
                  {USAGE_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <SelectCard
                        key={opt.value}
                        selected={usageType === opt.value}
                        onClick={() => setUsageType(opt.value)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={[
                            'shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                            usageType === opt.value
                              ? 'bg-indigo-100 dark:bg-indigo-900/60'
                              : 'bg-slate-100 dark:bg-slate-700/60',
                          ].join(' ')}>
                            <Icon className={[
                              'w-5 h-5',
                              usageType === opt.value
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-500 dark:text-slate-400',
                            ].join(' ')} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-white">{opt.label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.description}</p>
                          </div>
                          {usageType === opt.value && (
                            <CheckCircleIcon className="w-5 h-5 text-indigo-500 ml-auto shrink-0" />
                          )}
                        </div>
                      </SelectCard>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    size="lg"
                    disabled={!canAdvance[2]}
                    onClick={() => setStep(3)}
                  >
                    Continue
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 3 — Team size ─────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">Step 3 of 4</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                    How big is your team?
                  </h1>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Helps us suggest the right setup for you.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TEAM_SIZES.map(ts => (
                    <SelectCard
                      key={ts.value}
                      selected={teamSize === ts.value}
                      onClick={() => setTeamSize(ts.value)}
                      className="text-center"
                    >
                      <div className="flex flex-col items-center gap-1 py-1">
                        <span className="text-2xl">{ts.icon}</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{ts.label}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    fullWidth
                    size="lg"
                    disabled={!canAdvance[3]}
                    onClick={() => setStep(4)}
                  >
                    Continue
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 4 — Workspace name ────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">Step 4 of 4</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                    Name your workspace
                  </h1>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    This is how your workspace will appear to you and your team.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shrink-0">
                      <BuildingOfficeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {workspaceName || 'Your Workspace'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Live preview</p>
                    </div>
                  </div>

                  <Input
                    id="workspaceNameInput"
                    label="Workspace name"
                    placeholder="e.g. Acme Corp, My Projects…"
                    value={workspaceName}
                    onChange={e => setWorkspaceName(e.target.value)}
                    autoFocus
                    name=""
                  />
                </div>

                {state?.error && (
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{state.error}</p>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" size="lg" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={pending}
                    disabled={!canAdvance[4]}
                  >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Let&apos;s go!
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Step summary chips — visible once past step 1 */}
          {step > 1 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {resolvedRole && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-900/50">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  {resolvedRole}
                </span>
              )}
              {step > 2 && usageType && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 text-xs font-medium border border-violet-100 dark:border-violet-900/50">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  {USAGE_OPTIONS.find(u => u.value === usageType)?.label}
                </span>
              )}
              {step > 3 && teamSize && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-medium border border-sky-100 dark:border-sky-900/50">
                  <UsersIcon className="w-3.5 h-3.5" />
                  {TEAM_SIZES.find(t => t.value === teamSize)?.label} people
                </span>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
