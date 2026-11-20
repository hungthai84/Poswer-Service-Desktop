import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Square, X, Copy } from 'lucide-react';
import { WindowId } from '../data/desktopData';
import { TaskbarPositionId, TaskbarStyleId } from '../data/customization';
import { SavedWindowBounds, SnapZoneId } from '../data/osConfig';
import { useViewport } from '../hooks/useViewport';

interface WindowFrameProps {
  id: WindowId;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  width: number;
  height: number;
  maxHeight?: number;
  showMaximize?: boolean;
  initialOffset?: { x: number; y: number };
  savedBounds?: SavedWindowBounds;
  taskbarPosition?: TaskbarPositionId;
  taskbarStyle?: TaskbarStyleId;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onBoundsChange?: (id: WindowId, bounds: SavedWindowBounds) => void;
  children: React.ReactNode;
}

function getSnapRect(
  zone: SnapZoneId,
  vw: number,
  vh: number,
  insets: { top: number; bottom: number; left: number; right: number }
): { top: number; left: number; width: number; height: number } {
  const aw = vw - insets.left - insets.right;
  const ah = vh - insets.top - insets.bottom;
  const x0 = insets.left;
  const y0 = insets.top;

  switch (zone) {
    case 'left-half':
      return { left: x0, top: y0, width: aw / 2, height: ah };
    case 'right-half':
      return { left: x0 + aw / 2, top: y0, width: aw / 2, height: ah };
    case 'top-half':
      return { left: x0, top: y0, width: aw, height: ah / 2 };
    case 'bottom-half':
      return { left: x0, top: y0 + ah / 2, width: aw, height: ah / 2 };
    case 'left-70':
      return { left: x0, top: y0, width: aw * 0.68, height: ah };
    case 'right-30':
      return { left: x0 + aw * 0.68, top: y0, width: aw * 0.32, height: ah };
    case 'col-3-left':
      return { left: x0, top: y0, width: aw / 3, height: ah };
    case 'col-3-center':
      return { left: x0 + aw / 3, top: y0, width: aw / 3, height: ah };
    case 'col-3-right':
      return { left: x0 + (aw * 2) / 3, top: y0, width: aw / 3, height: ah };
    case 'quad-tl':
      return { left: x0, top: y0, width: aw / 2, height: ah / 2 };
    case 'quad-tr':
      return { left: x0 + aw / 2, top: y0, width: aw / 2, height: ah / 2 };
    case 'quad-bl':
      return { left: x0, top: y0 + ah / 2, width: aw / 2, height: ah / 2 };
    case 'quad-br':
      return { left: x0 + aw / 2, top: y0 + ah / 2, width: aw / 2, height: ah / 2 };
  }
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  zIndex,
  width,
  height,
  showMaximize = true,
  initialOffset = { x: 0, y: 0 },
  savedBounds,
  taskbarPosition = 'bottom',
  taskbarStyle = 'floating',
  onFocus,
  onMinimize,
  onClose,
  onBoundsChange,
  children,
}) => {
  const viewport = useViewport();
  const [position, setPosition] = useState<{ x: number; y: number }>(() =>
    savedBounds ? { x: savedBounds.x, y: savedBounds.y } : initialOffset
  );
  const [customSize, setCustomSize] = useState<{ width: number; height: number }>(() => ({
    width: savedBounds?.width ?? width,
    height: savedBounds?.height ?? height,
  }));
  const [isMaximized, setIsMaximized] = useState(false);
  const [snapZone, setSnapZone] = useState<SnapZoneId | null>(savedBounds?.snapZone ?? null);
  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const [dragEdgeHint, setDragEdgeHint] = useState<SnapZoneId | null>(null);
  const snapHideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (viewport.isMobile) return;
    const maxOffsetX = Math.max(80, viewport.width / 2 - 90);
    const maxOffsetY = Math.max(60, viewport.height / 2 - 90);
    setPosition((prev) => {
      const cx = Math.max(-maxOffsetX, Math.min(maxOffsetX, prev.x));
      const cy = Math.max(-maxOffsetY, Math.min(maxOffsetY, prev.y));
      return cx === prev.x && cy === prev.y ? prev : { x: cx, y: cy };
    });
  }, [viewport.width, viewport.height, viewport.isMobile]);

  const draggingRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  const resizingRef = useRef<{
    active: boolean;
    dir: 'e' | 's' | 'se';
    startX: number;
    startY: number;
    originW: number;
    originH: number;
  }>({ active: false, dir: 'se', startX: 0, startY: 0, originW: width, originH: height });

  useEffect(() => {
    setCustomSize((prev) => ({
      width: savedBounds?.width ?? Math.max(prev.width, width),
      height: savedBounds?.height ?? Math.max(prev.height, height),
    }));
  }, [width, height, savedBounds?.width, savedBounds?.height]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (resizingRef.current.active) {
        const dx = e.clientX - resizingRef.current.startX;
        const dy = e.clientY - resizingRef.current.startY;
        const nextW =
          resizingRef.current.dir === 's'
            ? resizingRef.current.originW
            : Math.max(320, Math.min(window.innerWidth - 24, resizingRef.current.originW + dx));
        const nextH =
          resizingRef.current.dir === 'e'
            ? resizingRef.current.originH
            : Math.max(260, Math.min(window.innerHeight - 64, resizingRef.current.originH + dy));
        setSnapZone(null);
        setCustomSize({ width: nextW, height: nextH });
        return;
      }

      if (!draggingRef.current.active) return;
      const dx = e.clientX - draggingRef.current.startX;
      const dy = e.clientY - draggingRef.current.startY;
      const maxOffsetX = Math.max(120, window.innerWidth / 2 - 80);
      const maxOffsetY = Math.max(80, window.innerHeight / 2 - 80);
      setPosition({
        x: Math.max(-maxOffsetX, Math.min(maxOffsetX, draggingRef.current.originX + dx)),
        y: Math.max(-maxOffsetY, Math.min(maxOffsetY, draggingRef.current.originY + dy)),
      });

      if (showMaximize) {
        if (e.clientX <= 16) setDragEdgeHint('left-half');
        else if (e.clientX >= window.innerWidth - 16) setDragEdgeHint('right-half');
        else if (e.clientY <= 12) setDragEdgeHint('top-half');
        else setDragEdgeHint(null);
      }
    };

    const handlePointerUp = () => {
      if (draggingRef.current.active) {
        draggingRef.current.active = false;
        if (dragEdgeHint && showMaximize) {
          setSnapZone(dragEdgeHint);
          setIsMaximized(false);
          onBoundsChange?.(id, {
            x: position.x,
            y: position.y,
            width: customSize.width,
            height: customSize.height,
            snapZone: dragEdgeHint,
          });
        } else {
          onBoundsChange?.(id, {
            x: position.x,
            y: position.y,
            width: customSize.width,
            height: customSize.height,
            snapZone,
          });
        }
        setDragEdgeHint(null);
      }
      if (resizingRef.current.active) {
        resizingRef.current.active = false;
        onBoundsChange?.(id, {
          x: position.x,
          y: position.y,
          width: customSize.width,
          height: customSize.height,
          snapZone: null,
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragEdgeHint, showMaximize, id, position.x, position.y, customSize.width, customSize.height, snapZone, onBoundsChange]);

  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMaximized || viewport.isMobile) return;
    if ((e.target as HTMLElement).closest('button')) return;
    onFocus(id);
    if (snapZone) {
      setSnapZone(null);
    }
    draggingRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  const applySnapZone = (zone: SnapZoneId) => {
    setIsMaximized(false);
    setSnapZone(zone);
    setShowSnapMenu(false);
    onBoundsChange?.(id, {
      x: position.x,
      y: position.y,
      width: customSize.width,
      height: customSize.height,
      snapZone: zone,
    });
  };

  const visible = isOpen && !isMinimized;
  const barThickness = taskbarStyle === 'full' ? 48 : taskbarStyle === 'compact' ? 54 : 66;
  const sideThickness = taskbarStyle === 'full' ? 56 : taskbarStyle === 'compact' ? 58 : 66;

  const insets = {
    top: taskbarPosition === 'top' ? barThickness : 0,
    bottom: taskbarPosition === 'bottom' ? barThickness : 0,
    left: taskbarPosition === 'left' ? sideThickness : 0,
    right: taskbarPosition === 'right' ? sideThickness : 0,
  };

  const maximizedStyle: React.CSSProperties = {
    width: `calc(100vw - ${insets.left + insets.right}px)`,
    height: `calc(100dvh - ${insets.top + insets.bottom}px)`,
    top: `${insets.top}px`,
    left: `${insets.left}px`,
    transform: 'none',
    borderRadius: 0,
  };

  const mobileSheetStyle: React.CSSProperties = {
    left: `${insets.left + 6}px`,
    top: `${insets.top + 6}px`,
    width: `${Math.max(280, viewport.width - insets.left - insets.right - 12)}px`,
    height: `${Math.max(240, viewport.height - insets.top - insets.bottom - 12)}px`,
    borderRadius: 'var(--win-radius, 14px)',
  };

  const snappedRect = snapZone
    ? getSnapRect(snapZone, viewport.width, viewport.height, insets)
    : null;

  const dragPreviewRect = dragEdgeHint
    ? getSnapRect(dragEdgeHint, viewport.width, viewport.height, insets)
    : null;

  const centerShiftX =
    taskbarPosition === 'left' ? sideThickness / 2 : taskbarPosition === 'right' ? -sideThickness / 2 : 0;
  const centerShiftY =
    taskbarPosition === 'top' ? barThickness / 2 : taskbarPosition === 'bottom' ? -barThickness / 2 : 0;

  return (
    <>
      {dragPreviewRect && (
        <div
          aria-hidden="true"
          style={{
            left: dragPreviewRect.left + 6,
            top: dragPreviewRect.top + 6,
            width: dragPreviewRect.width - 12,
            height: dragPreviewRect.height - 12,
            zIndex: zIndex - 1,
          }}
          className="pointer-events-none fixed rounded-2xl border-2 border-[var(--win-accent-bright)] bg-[var(--win-accent)]/20 backdrop-blur-md transition-all duration-150"
        />
      )}

      <AnimatePresence>
        {visible && (
          <motion.section
            key={id}
            aria-label={title}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onPointerDown={() => onFocus(id)}
            style={{
              zIndex,
              ...(isMaximized
                ? maximizedStyle
                : viewport.isMobile
                ? mobileSheetStyle
                : snappedRect
                ? {
                    left: snappedRect.left + 4,
                    top: snappedRect.top + 4,
                    width: snappedRect.width - 8,
                    height: snappedRect.height - 8,
                  }
                : {
                    width: `min(${customSize.width}px, ${
                      taskbarPosition === 'left' || taskbarPosition === 'right'
                        ? `calc(100vw - ${sideThickness + 16}px)`
                        : '95vw'
                    })`,
                    height: `min(${customSize.height}px, ${
                      taskbarPosition === 'top' || taskbarPosition === 'bottom'
                        ? `calc(100dvh - ${barThickness + 24}px)`
                        : 'calc(100dvh - 24px)'
                    })`,
                    left: `calc(50% + ${centerShiftX}px)`,
                    top: `calc(50% + ${centerShiftY}px)`,
                    marginLeft: `calc(-1 * min(${customSize.width}px, ${
                      taskbarPosition === 'left' || taskbarPosition === 'right'
                        ? `calc(100vw - ${sideThickness + 16}px)`
                        : '95vw'
                    }) / 2 + ${position.x}px)`,
                    marginTop: `calc(-1 * min(${customSize.height}px, ${
                      taskbarPosition === 'top' || taskbarPosition === 'bottom'
                        ? `calc(100dvh - ${barThickness + 24}px)`
                        : 'calc(100dvh - 24px)'
                    }) / 2 + ${position.y}px)`,
                    borderRadius: 'var(--win-radius, 16px)',
                  }),
            }}
            className={`win-acrylic fixed flex flex-col overflow-hidden ${
              isMaximized ? 'rounded-none' : 'rounded-2xl'
            }`}
          >
            {/* Windows 11/12 Fluent Header */}
            <div
              onPointerDown={handleHeaderPointerDown}
              onDoubleClick={() => {
                if (!showMaximize) return;
                if (snapZone) setSnapZone(null);
                else setIsMaximized((prev) => !prev);
              }}
              className={`relative flex h-10 shrink-0 items-center justify-between pr-1.5 pl-4 select-none ${
                isMaximized ? 'cursor-default' : 'cursor-move'
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-[var(--win-text-primary)]">
                <span className="flex shrink-0 items-center justify-center">{icon}</span>
                <span className="truncate text-[14px] font-bold tracking-tight">{title}</span>
              </div>

              <div className="relative flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`Minimize ${title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMinimize(id);
                  }}
                  className="flex h-7 w-9 items-center justify-center rounded-lg text-[var(--win-text-secondary)] transition-colors hover:bg-black/8 hover:text-[var(--win-text-primary)] dark:hover:bg-white/10"
                >
                  <Minus size={14} strokeWidth={1.85} />
                </button>

                {showMaximize && (
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      if (snapHideTimerRef.current) clearTimeout(snapHideTimerRef.current);
                      setShowSnapMenu(true);
                    }}
                    onMouseLeave={() => {
                      snapHideTimerRef.current = window.setTimeout(() => setShowSnapMenu(false), 220);
                    }}
                  >
                    <button
                      type="button"
                      aria-label={isMaximized || snapZone ? `Restore ${title}` : `Maximize ${title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSnapMenu(false);
                        if (snapZone) {
                          setSnapZone(null);
                        } else {
                          setIsMaximized((prev) => !prev);
                        }
                      }}
                      className="flex h-7 w-9 items-center justify-center rounded-lg text-[var(--win-text-secondary)] transition-colors hover:bg-black/8 hover:text-[var(--win-text-primary)] dark:hover:bg-white/10"
                    >
                      {isMaximized || snapZone ? (
                        <Copy size={12} strokeWidth={1.85} />
                      ) : (
                        <Square size={12} strokeWidth={1.85} />
                      )}
                    </button>

                    {/* Windows 11 Snap Layout Popover */}
                    {showSnapMenu && !viewport.isMobile && (
                      <div
                        onPointerDown={(e) => e.stopPropagation()}
                        className="win-acrylic absolute top-8 right-0 z-[50] grid w-[224px] grid-cols-2 gap-2 rounded-2xl p-2.5 shadow-xl"
                      >
                        {/* 50/50 2 cols */}
                        <div className="flex h-11 gap-1 rounded-lg bg-black/5 p-1 dark:bg-white/8">
                          <button
                            type="button"
                            title="50% Left"
                            onClick={() => applySnapZone('left-half')}
                            className="flex-1 rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                          <button
                            type="button"
                            title="50% Right"
                            onClick={() => applySnapZone('right-half')}
                            className="flex-1 rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                        </div>

                        {/* 70/30 2 cols */}
                        <div className="flex h-11 gap-1 rounded-lg bg-black/5 p-1 dark:bg-white/8">
                          <button
                            type="button"
                            title="70% Left"
                            onClick={() => applySnapZone('left-70')}
                            className="w-[66%] rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                          <button
                            type="button"
                            title="30% Right"
                            onClick={() => applySnapZone('right-30')}
                            className="flex-1 rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                        </div>

                        {/* 3 cols */}
                        <div className="flex h-11 gap-1 rounded-lg bg-black/5 p-1 dark:bg-white/8">
                          <button
                            type="button"
                            title="Column 1"
                            onClick={() => applySnapZone('col-3-left')}
                            className="flex-1 rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                          <button
                            type="button"
                            title="Column 2"
                            onClick={() => applySnapZone('col-3-center')}
                            className="flex-1 rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                          <button
                            type="button"
                            title="Column 3"
                            onClick={() => applySnapZone('col-3-right')}
                            className="flex-1 rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                        </div>

                        {/* 4 quadrants */}
                        <div className="grid h-11 grid-cols-2 gap-1 rounded-lg bg-black/5 p-1 dark:bg-white/8">
                          <button
                            type="button"
                            title="Top Left"
                            onClick={() => applySnapZone('quad-tl')}
                            className="rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                          <button
                            type="button"
                            title="Top Right"
                            onClick={() => applySnapZone('quad-tr')}
                            className="rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                          <button
                            type="button"
                            title="Bottom Left"
                            onClick={() => applySnapZone('quad-bl')}
                            className="rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                          <button
                            type="button"
                            title="Bottom Right"
                            onClick={() => applySnapZone('quad-br')}
                            className="rounded bg-slate-400/50 transition-colors hover:bg-[var(--win-accent-bright)]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  aria-label={`Close ${title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMaximized(false);
                    setSnapZone(null);
                    onClose(id);
                  }}
                  className="flex h-7 w-9 items-center justify-center rounded-lg text-[var(--win-text-secondary)] transition-colors hover:bg-[#e81123] hover:text-white"
                >
                  <X size={14} strokeWidth={1.85} />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-hidden">{children}</div>

            {/* Edge & Corner Resize Handles when floating */}
            {!isMaximized && !snapZone && !viewport.isMobile && showMaximize && (
              <>
                <div
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onFocus(id);
                    e.currentTarget.setPointerCapture(e.pointerId);
                    resizingRef.current = {
                      active: true,
                      dir: 'e',
                      startX: e.clientX,
                      startY: e.clientY,
                      originW: customSize.width,
                      originH: customSize.height,
                    };
                  }}
                  className="absolute top-10 right-0 bottom-3 w-1.5 cursor-ew-resize"
                />
                <div
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onFocus(id);
                    e.currentTarget.setPointerCapture(e.pointerId);
                    resizingRef.current = {
                      active: true,
                      dir: 's',
                      startX: e.clientX,
                      startY: e.clientY,
                      originW: customSize.width,
                      originH: customSize.height,
                    };
                  }}
                  className="absolute right-3 bottom-0 left-3 h-1.5 cursor-ns-resize"
                />
                <div
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    onFocus(id);
                    e.currentTarget.setPointerCapture(e.pointerId);
                    resizingRef.current = {
                      active: true,
                      dir: 'se',
                      startX: e.clientX,
                      startY: e.clientY,
                      originW: customSize.width,
                      originH: customSize.height,
                    };
                  }}
                  className="absolute right-0 bottom-0 h-3.5 w-3.5 cursor-nwse-resize"
                />
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};
