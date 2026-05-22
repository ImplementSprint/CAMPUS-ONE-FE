'use client';

import Image, { type ImageProps } from 'next/image';
import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { getTigoAnimation, type TigoAnimationName } from './tigoAnimations';

type TigoImageProps = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>;

export interface TigoAnimationProps extends TigoImageProps {
  animation: TigoAnimationName;
  alt?: string;
  size?: number;
  width?: number;
  height?: number;
  frameDurationMs?: number;
  transitionDurationMs?: number;
  loop?: boolean;
  playing?: boolean;
  respectReducedMotion?: boolean;
  smooth?: boolean;
  imageClassName?: string;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') {
        return () => undefined;
      }

      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      query.addEventListener('change', callback);

      return () => query.removeEventListener('change', callback);
    },
    () => {
      if (typeof window === 'undefined') {
        return false;
      }

      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    () => false,
  );
}

function useTigoFrameState(frameCount: number, frameDurationMs: number, loop: boolean, shouldAnimate: boolean) {
  const [frameState, setFrameState] = useState({ current: 0, previous: 0 });

  useEffect(() => {
    if (!shouldAnimate || frameCount <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFrameState(({ current }) => {
        const nextFrame = current + 1;

        if (nextFrame < frameCount) {
          return { current: nextFrame, previous: current };
        }

        return loop ? { current: 0, previous: current } : { current, previous: current };
      });
    }, frameDurationMs);

    return () => window.clearInterval(intervalId);
  }, [frameCount, frameDurationMs, loop, shouldAnimate]);

  return frameState;
}

function usePreloadTigoFrames(frames: string[]) {
  useEffect(() => {
    frames.forEach((frame) => {
      const image = new window.Image();
      image.src = frame;
    });
  }, [frames]);
}

export function TigoAnimation({
  animation,
  alt,
  size = 320,
  width,
  height,
  frameDurationMs = 200,
  transitionDurationMs = 0,
  loop = true,
  playing = true,
  respectReducedMotion = true,
  smooth = false,
  imageClassName,
  className,
  priority,
  sizes,
  ...imageProps
}: TigoAnimationProps) {
  const definition = useMemo(() => getTigoAnimation(animation), [animation]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = playing && (!respectReducedMotion || !prefersReducedMotion);
  const frameState = useTigoFrameState(definition.frames.length, frameDurationMs, loop, shouldAnimate);
  const currentFrame = definition.frames[frameState.current] ?? definition.poster;
  const previousFrame = definition.frames[frameState.previous] ?? definition.poster;
  const imageAlt = alt ?? `Tigo ${definition.label.toLowerCase()} animation`;

  usePreloadTigoFrames(definition.frames);

  if (!smooth) {
    return (
      <Image
        {...imageProps}
        src={currentFrame}
        alt={imageAlt}
        width={width ?? size}
        height={height ?? size}
        priority={priority}
        sizes={sizes}
        className={cn('object-contain', imageClassName, className)}
      />
    );
  }

  return (
    <span
      className={cn('relative inline-grid place-items-center overflow-hidden', className)}
      style={{ width: width ?? size, height: height ?? size }}
    >
      {previousFrame !== currentFrame && (
        <Image
          {...imageProps}
          src={previousFrame}
          alt=""
          aria-hidden="true"
          width={width ?? size}
          height={height ?? size}
          sizes={sizes}
          className={cn('absolute inset-0 h-full w-full object-contain opacity-0', imageClassName)}
          style={{ transition: `opacity ${transitionDurationMs}ms linear` }}
        />
      )}
      <Image
        {...imageProps}
        src={currentFrame}
        alt={imageAlt}
        width={width ?? size}
        height={height ?? size}
        priority={priority}
        sizes={sizes}
        className={cn('relative h-full w-full object-contain opacity-100', imageClassName)}
        style={{ transition: `opacity ${transitionDurationMs}ms linear` }}
      />
    </span>
  );
}
