import React, { useCallback, useEffect, useState } from 'react';
import { Delete, History, Trash2 } from 'lucide-react';
import { WindowFrame } from './WindowFrame';
import { FluentSystemIcon } from './FluentIcons';
import { LanguageId, UI_TEXT, WindowId } from '../data/desktopData';
import { TaskbarPositionId, TaskbarStyleId } from '../data/customization';

interface CalculatorWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  language: LanguageId;
  taskbarPosition: TaskbarPositionId;
  taskbarStyle: TaskbarStyleId;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
}

interface CalcHistoryEntry {
  id: string;
  expression: string;
  result: string;
}

type Operator = '+' | '-' | '×' | '÷';

function formatNumberDisplay(num: number): string {
  if (!Number.isFinite(num)) return 'Error';
  const rounded = Math.round(num * 1e10) / 1e10;
  return String(rounded);
}

export const CalculatorWindow: React.FC<CalculatorWindowProps> = ({
  isOpen,
  isMinimized,
  zIndex,
  language,
  taskbarPosition,
  taskbarStyle,
  onFocus,
  onMinimize,
  onClose,
}) => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingNext, setWaitingNext] = useState(false);
  const [expression, setExpression] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CalcHistoryEntry[]>([]);

  const compute = useCallback((a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b === 0 ? Infinity : a / b;
    }
  }, []);

  const inputDigit = useCallback(
    (digit: string) => {
      if (display === 'Error') {
        setDisplay(digit);
        setWaitingNext(false);
        return;
      }
      if (waitingNext) {
        setDisplay(digit);
        setWaitingNext(false);
      } else {
        setDisplay((prev) => (prev === '0' ? digit : prev.length < 15 ? prev + digit : prev));
      }
    },
    [display, waitingNext]
  );

  const inputDecimal = useCallback(() => {
    if (waitingNext) {
      setDisplay('0.');
      setWaitingNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay((prev) => `${prev}.`);
    }
  }, [display, waitingNext]);

  const handleClearAll = useCallback(() => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingNext(false);
    setExpression('');
  }, []);

  const handleClearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  const handleBackspace = useCallback(() => {
    if (waitingNext || display === 'Error') return;
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  }, [waitingNext, display]);

  const handleOperator = useCallback(
    (nextOp: Operator) => {
      const current = parseFloat(display);
      if (!Number.isFinite(current)) return;

      if (prevValue !== null && operator && !waitingNext) {
        const result = compute(prevValue, current, operator);
        const formatted = formatNumberDisplay(result);
        setDisplay(formatted);
        setPrevValue(Number.isFinite(result) ? result : null);
        setExpression(`${formatted} ${nextOp}`);
      } else {
        setPrevValue(current);
        setExpression(`${formatNumberDisplay(current)} ${nextOp}`);
      }
      setOperator(nextOp);
      setWaitingNext(true);
    },
    [display, prevValue, operator, waitingNext, compute]
  );

  const handleEquals = useCallback(() => {
    if (prevValue === null || !operator) return;
    const current = parseFloat(display);
    if (!Number.isFinite(current)) return;

    const result = compute(prevValue, current, operator);
    const formatted = formatNumberDisplay(result);
    const fullExpr = `${formatNumberDisplay(prevValue)} ${operator} ${formatNumberDisplay(current)} =`;

    setHistory((prev) => [
      { id: `${Date.now()}-${Math.random()}`, expression: fullExpr, result: formatted },
      ...prev.slice(0, 19),
    ]);

    setDisplay(formatted);
    setExpression(fullExpr);
    setPrevValue(null);
    setOperator(null);
    setWaitingNext(true);
  }, [prevValue, operator, display, compute]);

  const applyUnary = (fn: (x: number) => number, label: (s: string) => string) => {
    const val = parseFloat(display);
    if (!Number.isFinite(val)) return;
    const res = fn(val);
    const formatted = formatNumberDisplay(res);
    setExpression(label(formatNumberDisplay(val)));
    setDisplay(formatted);
    setWaitingNext(true);
  };

  useEffect(() => {
    if (!isOpen || isMinimized) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (/^[0-9]$/.test(e.key)) {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClearAll();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isOpen,
    isMinimized,
    inputDigit,
    inputDecimal,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClearAll,
  ]);

  const numBtnClass =
    'win-card flex h-11 items-center justify-center rounded-xl text-base font-bold text-[var(--win-text-primary)] active:scale-96';
  const opBtnClass =
    'flex h-11 items-center justify-center rounded-xl bg-black/5 text-sm font-semibold text-[var(--win-text-primary)] transition-colors hover:bg-black/10 active:scale-96 dark:bg-white/8 dark:hover:bg-white/15';

  return (
    <WindowFrame
      id="calculator"
      title={UI_TEXT[language].apps.calculatorTitle}
      icon={<FluentSystemIcon type="calculator" size={18} />}
      isOpen={isOpen}
      isMinimized={isMinimized}
      zIndex={zIndex}
      width={isScientific || showHistory ? 560 : 360}
      height={540}
      showMaximize={false}
      initialOffset={{ x: 40, y: -20 }}
      taskbarPosition={taskbarPosition}
      taskbarStyle={taskbarStyle}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onClose={onClose}
    >
      <div className="flex h-full flex-col overflow-hidden p-3.5 select-none">
        {/* Mode & History Header */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/8">
            <button
              type="button"
              onClick={() => setIsScientific(false)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                !isScientific
                  ? 'bg-white text-[var(--win-text-primary)] shadow-xs dark:bg-white/20'
                  : 'text-[var(--win-text-secondary)]'
              }`}
            >
              {language === 'vi' ? 'Tiêu chuẩn' : 'Standard'}
            </button>
            <button
              type="button"
              onClick={() => setIsScientific(true)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                isScientific
                  ? 'bg-white text-[var(--win-text-primary)] shadow-xs dark:bg-white/20'
                  : 'text-[var(--win-text-secondary)]'
              }`}
            >
              {language === 'vi' ? 'Khoa học' : 'Scientific'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            title={language === 'vi' ? 'Lịch sử phép tính' : 'History'}
            className={`flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-colors ${
              showHistory
                ? 'bg-[var(--win-accent)]/15 text-[var(--win-accent)]'
                : 'text-[var(--win-text-secondary)] hover:bg-black/6 dark:hover:bg-white/10'
            }`}
          >
            <History size={14} />
            <span className="tabular-nums">{history.length}</span>
          </button>
        </div>

        {/* Body: Display + Keypad (+ optional History) */}
        <div className="flex flex-1 gap-3 overflow-hidden">
          <div className="flex flex-1 flex-col justify-between">
            {/* Digital Display */}
            <div className="mb-3 rounded-2xl border border-[var(--win-border-subtle)] bg-white/60 px-4 py-3 text-right dark:bg-black/30">
              <div className="h-5 truncate text-xs text-[var(--win-text-secondary)] tabular-nums">
                {expression || '\u00A0'}
              </div>
              <div className="mt-0.5 truncate text-3xl font-bold tracking-tight text-[var(--win-text-primary)] tabular-nums sm:text-4xl">
                {display}
              </div>
            </div>

            {/* Scientific Row when active */}
            {isScientific && (
              <div className="mb-1.5 grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyUnary((x) => Math.sin((x * Math.PI) / 180), (s) => `sin(${s})`)}
                  className={opBtnClass}
                >
                  sin
                </button>
                <button
                  type="button"
                  onClick={() => applyUnary((x) => Math.cos((x * Math.PI) / 180), (s) => `cos(${s})`)}
                  className={opBtnClass}
                >
                  cos
                </button>
                <button
                  type="button"
                  onClick={() => applyUnary((x) => Math.tan((x * Math.PI) / 180), (s) => `tan(${s})`)}
                  className={opBtnClass}
                >
                  tan
                </button>
                <button
                  type="button"
                  onClick={() => applyUnary((x) => Math.log10(x), (s) => `log(${s})`)}
                  className={opBtnClass}
                >
                  log
                </button>
                <button
                  type="button"
                  onClick={() => applyUnary((x) => Math.log(x), (s) => `ln(${s})`)}
                  className={opBtnClass}
                >
                  ln
                </button>
                <button
                  type="button"
                  onClick={() => setDisplay(formatNumberDisplay(Math.PI))}
                  className={opBtnClass}
                >
                  π
                </button>
                <button
                  type="button"
                  onClick={() => setDisplay(formatNumberDisplay(Math.E))}
                  className={opBtnClass}
                >
                  e
                </button>
                <button
                  type="button"
                  onClick={() => applyUnary((x) => x * x, (s) => `sqr(${s})`)}
                  className={opBtnClass}
                >
                  x²
                </button>
                <button
                  type="button"
                  onClick={() => applyUnary((x) => Math.sqrt(x), (s) => `√(${s})`)}
                  className={opBtnClass}
                >
                  √x
                </button>
                <button
                  type="button"
                  onClick={() => applyUnary((x) => 1 / x, (s) => `1/(${s})`)}
                  className={opBtnClass}
                >
                  1/x
                </button>
              </div>
            )}

            {/* Main Keypad */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => applyUnary((x) => x / 100, (s) => `${s}%`)}
                className={opBtnClass}
              >
                %
              </button>
              <button type="button" onClick={handleClearEntry} className={opBtnClass}>
                CE
              </button>
              <button type="button" onClick={handleClearAll} className={opBtnClass}>
                C
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                aria-label="Backspace"
                className={opBtnClass}
              >
                <Delete size={16} />
              </button>

              <button type="button" onClick={() => inputDigit('7')} className={numBtnClass}>
                7
              </button>
              <button type="button" onClick={() => inputDigit('8')} className={numBtnClass}>
                8
              </button>
              <button type="button" onClick={() => inputDigit('9')} className={numBtnClass}>
                9
              </button>
              <button type="button" onClick={() => handleOperator('÷')} className={opBtnClass}>
                ÷
              </button>

              <button type="button" onClick={() => inputDigit('4')} className={numBtnClass}>
                4
              </button>
              <button type="button" onClick={() => inputDigit('5')} className={numBtnClass}>
                5
              </button>
              <button type="button" onClick={() => inputDigit('6')} className={numBtnClass}>
                6
              </button>
              <button type="button" onClick={() => handleOperator('×')} className={opBtnClass}>
                ×
              </button>

              <button type="button" onClick={() => inputDigit('1')} className={numBtnClass}>
                1
              </button>
              <button type="button" onClick={() => inputDigit('2')} className={numBtnClass}>
                2
              </button>
              <button type="button" onClick={() => inputDigit('3')} className={numBtnClass}>
                3
              </button>
              <button type="button" onClick={() => handleOperator('-')} className={opBtnClass}>
                −
              </button>

              <button
                type="button"
                onClick={() =>
                  setDisplay((prev) =>
                    prev === '0' || prev === 'Error'
                      ? prev
                      : prev.startsWith('-')
                      ? prev.slice(1)
                      : `-${prev}`
                  )
                }
                className={numBtnClass}
              >
                +/-
              </button>
              <button type="button" onClick={() => inputDigit('0')} className={numBtnClass}>
                0
              </button>
              <button type="button" onClick={inputDecimal} className={numBtnClass}>
                .
              </button>
              <button type="button" onClick={() => handleOperator('+')} className={opBtnClass}>
                +
              </button>

              <button
                type="button"
                onClick={handleEquals}
                className="col-span-4 flex h-11 items-center justify-center rounded-xl bg-[var(--win-accent-bright)] text-lg font-bold text-white shadow-xs transition-opacity hover:opacity-95 active:scale-98"
              >
                =
              </button>
            </div>
          </div>

          {/* History Panel */}
          {showHistory && (
            <aside className="flex w-[180px] shrink-0 flex-col border-l border-[var(--win-border-subtle)] pl-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--win-text-primary)]">
                  {language === 'vi' ? 'Lịch sử' : 'History'}
                </span>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHistory([])}
                    title={language === 'vi' ? 'Xóa lịch sử' : 'Clear history'}
                    className="rounded-md p-1 text-rose-500 hover:bg-rose-500/12"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div className="win-scrollbar flex-1 space-y-1.5 overflow-y-auto pr-1">
                {history.length === 0 ? (
                  <p className="pt-8 text-center text-[11px] text-[var(--win-text-secondary)]">
                    {language === 'vi' ? 'Chưa có phép tính nào' : 'No history yet'}
                  </p>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setDisplay(item.result);
                        setExpression(item.expression);
                        setWaitingNext(true);
                      }}
                      className="win-card w-full rounded-xl p-2 text-right"
                    >
                      <div className="truncate text-[10px] text-[var(--win-text-secondary)] tabular-nums">
                        {item.expression}
                      </div>
                      <div className="truncate text-sm font-bold text-[var(--win-text-primary)] tabular-nums">
                        {item.result}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </WindowFrame>
  );
};
