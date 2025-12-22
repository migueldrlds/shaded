'use client';

import { gsap } from 'gsap';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text,
  className = '',
  delay = 500,
  duration = 1,
  ease = 'power4.out',
  splitType = 'words',
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  onLetterAnimationComplete
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitInstanceRef = useRef<ReturnType<typeof GSAPSplitText.create> | null>(null);
  const elementsToAnimateRef = useRef<HTMLElement[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.set(containerRef.current, {
      opacity: 0,
      visibility: 'hidden'
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || animatedRef.current) return;


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            setIsVisible(true);
            animatedRef.current = true;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [threshold, rootMargin]);


  useEffect(() => {
    if (typeof window !== 'undefined' && GSAPSplitText) {
      gsap.registerPlugin(GSAPSplitText);
    }
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const titleElement = containerRef.current;


    if (!GSAPSplitText || !GSAPSplitText.create) {
      console.warn('GSAP SplitText plugin not available');
      return;
    }


    if (splitInstanceRef.current) {
      splitInstanceRef.current.revert();
    }


    if (elementsToAnimateRef.current.length > 0) {
      gsap.killTweensOf(elementsToAnimateRef.current);
    }


    let splitInstance: ReturnType<typeof GSAPSplitText.create> | null = null;

    try {
      if (splitType === 'words') {
        splitInstance = GSAPSplitText.create(titleElement, {
          type: 'words',
          wordsClass: 'word',
          mask: 'words'
        });
      } else if (splitType === 'lines') {
        splitInstance = GSAPSplitText.create(titleElement, {
          type: 'lines',
          linesClass: 'line',
          mask: 'lines',
          reduceWhiteSpace: false
        });
      } else {

        splitInstance = GSAPSplitText.create(titleElement, {
          type: 'chars',
          charsClass: 'char'
        });
      }
    } catch (error) {
      console.error('Error creating SplitText:', error);
      return;
    }

    if (!splitInstance) return;

    splitInstanceRef.current = splitInstance;


    const elementsToAnimate = (splitType === 'words'
      ? splitInstance.words
      : splitType === 'lines'
        ? splitInstance.lines
        : splitInstance.chars) as HTMLElement[];

    if (!elementsToAnimate || elementsToAnimate.length === 0) return;

    elementsToAnimateRef.current = elementsToAnimate;


    gsap.set(titleElement, {
      opacity: 1,
      visibility: 'visible'
    });


    elementsToAnimate.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.setProperty('opacity', '0', 'important');
      }
    });


    gsap.set(elementsToAnimate, {
      y: '100%',
    });


    const timeoutId = setTimeout(() => {

      gsap.to(elementsToAnimate, {
        y: '0%',
        opacity: 1,
        duration,
        ease,
        stagger: 0.1,
        delay: delay / 1000,
        onComplete: () => {
          if (onLetterAnimationComplete) {
            onLetterAnimationComplete();
          }
        }
      });
    }, 100);


    return () => {
      clearTimeout(timeoutId);
      if (elementsToAnimateRef.current.length > 0) {
        gsap.killTweensOf(elementsToAnimateRef.current);
      }
      if (splitInstanceRef.current) {
        try {
          splitInstanceRef.current.revert();
        } catch (error) {
          console.error('Error reverting SplitText:', error);
        }
      }
    };
  }, [isVisible, text, splitType, delay, duration, ease, onLetterAnimationComplete]);

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[textAlign];

  return (
    <div
      ref={containerRef}
      className={`${className} ${alignClass}`}
      style={{ overflow: 'visible' }}
    >
      {text}
    </div>
  );
}

