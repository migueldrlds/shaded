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

    // Intersection Observer para animar cuando el elemento sea visible
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

  // Registrar el plugin SplitText una vez
  useEffect(() => {
    if (typeof window !== 'undefined' && GSAPSplitText) {
      gsap.registerPlugin(GSAPSplitText);
    }
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const titleElement = containerRef.current;

    // Verificar que SplitText esté disponible
    if (!GSAPSplitText || !GSAPSplitText.create) {
      console.warn('GSAP SplitText plugin not available');
      return;
    }

    // Revertir SplitText anterior si existe
    if (splitInstanceRef.current) {
      splitInstanceRef.current.revert();
    }

    // Limpiar animaciones previas
    if (elementsToAnimateRef.current.length > 0) {
      gsap.killTweensOf(elementsToAnimateRef.current);
    }

    // Crear SplitText usando el plugin oficial de GSAP
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
        // chars
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

    // Seleccionar elementos a animar basado en el tipo
    const elementsToAnimate = (splitType === 'words' 
      ? splitInstance.words 
      : splitType === 'lines'
      ? splitInstance.lines
      : splitInstance.chars) as HTMLElement[];
    
    if (!elementsToAnimate || elementsToAnimate.length === 0) return;
    
    elementsToAnimateRef.current = elementsToAnimate;

    // Asegurar que el contenedor sea visible justo antes de animar
    gsap.set(titleElement, {
      opacity: 1,
      visibility: 'visible'
    });

    // Forzar opacity inicial con inline style (como en el portfolio)
    elementsToAnimate.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.setProperty('opacity', '0', 'important');
      }
    });

    // Configurar posición inicial: y: "100%" (como en el portfolio)
    gsap.set(elementsToAnimate, {
      y: '100%',
      force3d: true,
    });

    // Esperar un poco antes de animar (como en el portfolio)
    const timeoutId = setTimeout(() => {
      // Animar elementos: y: "0%", opacity: 1, con stagger fijo (como en el portfolio)
      gsap.to(elementsToAnimate, {
        y: '0%',
        opacity: 1,
        duration,
        ease,
        stagger: 0.1, // Stagger fijo como en el portfolio
        force3d: true,
        delay: delay / 1000,
        onComplete: () => {
          if (onLetterAnimationComplete) {
            onLetterAnimationComplete();
          }
        }
      });
    }, 100);

    // Cleanup
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

