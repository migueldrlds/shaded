'use client';

import LinkWithTransition from "components/link-with-transition";
import { useLanguage } from "components/providers/language-provider";
import SplitText from "components/SplitText";
import { gsap } from 'gsap';
import { useLenis } from 'lenis/react';
import shopifyLoader from "lib/image-loader";
import { subscribeToNewsletter } from "lib/shopify/actions";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiArrowRight, FiArrowUpRight, FiCheck, FiRefreshCw, FiShield, FiTruck } from "react-icons/fi";

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface HomeClientProps {
  latestCollection: {
    title: string;
    handle: string;
  };
  trendingProducts: Product[];
}

export default function HomeClient({ latestCollection, trendingProducts }: HomeClientProps) {

  const { t } = useLanguage();
  const lenis = useLenis();

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const originalRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';

      const resetScroll = () => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        if (lenis) {
          lenis.scrollTo(0, { immediate: true, force: true });
        }
      };

      resetScroll();

      setTimeout(resetScroll, 10);
      setTimeout(resetScroll, 50);
      setTimeout(resetScroll, 150);

      const timer = setTimeout(() => {
        resetScroll();
        window.history.scrollRestoration = originalRestoration;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [lenis]);


  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const collectionVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const secondCardRef = useRef<HTMLDivElement>(null);
  const discountCardRef = useRef<HTMLDivElement>(null);
  const movementCardRef = useRef<HTMLDivElement>(null);
  const viewCollectionButtonRef = useRef<HTMLAnchorElement>(null);
  const secondCardWrapperRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const featuredProductsRef = useRef<HTMLDivElement>(null);
  const socialProofRef = useRef<HTMLDivElement>(null);

  const [newsletterState, setNewsletterState] = useState<'idle' | 'interacting' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [communityNewsletterState, setCommunityNewsletterState] = useState<'idle' | 'interacting' | 'success' | 'error'>('idle');
  const [communityEmail, setCommunityEmail] = useState('');
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityErrorMessage, setCommunityErrorMessage] = useState('');

  const [activeTrendingIndex, setActiveTrendingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTrendingIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleDiscountClick = () => {
    if (newsletterState === 'idle') {
      setNewsletterState('interacting');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setNewsletterState('success');
      } else {
        setErrorMessage(result.error || 'Something went wrong');
      }
    } catch (err) {
      setErrorMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityClick = () => {
    if (communityNewsletterState === 'idle') {
      setCommunityNewsletterState('interacting');
    }
  };

  const handleCommunityNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (communityLoading) return;

    setCommunityLoading(true);
    setCommunityErrorMessage('');

    try {
      const result = await subscribeToNewsletter(communityEmail);
      if (result.success) {
        setCommunityNewsletterState('success');
      } else {
        setCommunityErrorMessage(result.error || 'Something went wrong');
      }
    } catch (err) {
      setCommunityErrorMessage('Network error');
    } finally {
      setCommunityLoading(false);
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const syncVideos = () => {
      if (backgroundVideoRef.current && collectionVideoRef.current) {
        const bgVideo = backgroundVideoRef.current;
        const cardVideo = collectionVideoRef.current;

        if (!bgVideo.paused && !cardVideo.paused && bgVideo.readyState >= 3 && cardVideo.readyState >= 3) {
          const timeDiff = Math.abs(bgVideo.currentTime - cardVideo.currentTime);

          if (timeDiff > 0.1) {
            cardVideo.currentTime = bgVideo.currentTime;
          }
        }

        animationFrameId = requestAnimationFrame(syncVideos);
      }
    };

    const handleMasterPlay = () => {
      collectionVideoRef.current?.play().catch(() => { });
      animationFrameId = requestAnimationFrame(syncVideos);
    };

    const handleMasterPause = () => {
      collectionVideoRef.current?.pause();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };

    const handleMasterWaiting = () => {
      collectionVideoRef.current?.pause();
    };

    const handleMasterPlaying = () => {
      collectionVideoRef.current?.play().catch(() => { });
    };

    const handleLoadedMetadata = () => {
      if (backgroundVideoRef.current && collectionVideoRef.current) {
        collectionVideoRef.current.currentTime = backgroundVideoRef.current.currentTime;
      }
    };

    const bgVideo = backgroundVideoRef.current;

    if (bgVideo) {
      bgVideo.addEventListener('play', handleMasterPlay);
      bgVideo.addEventListener('pause', handleMasterPause);
      bgVideo.addEventListener('waiting', handleMasterWaiting);
      bgVideo.addEventListener('playing', handleMasterPlaying);
      if (collectionVideoRef.current) {
        collectionVideoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      }

      if (!bgVideo.paused) {
        handleMasterPlay();
      }
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (bgVideo) {
        bgVideo.removeEventListener('play', handleMasterPlay);
        bgVideo.removeEventListener('pause', handleMasterPause);
        bgVideo.removeEventListener('waiting', handleMasterWaiting);
        bgVideo.removeEventListener('playing', handleMasterPlaying);
      }
      if (collectionVideoRef.current) {
        collectionVideoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current || !mainCardRef.current || !secondCardRef.current) {
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    let containerNaturalHeight = 0;
    let mainCardNaturalHeight = 0;
    let secondCardNaturalHeight = 0;
    let secondCardPaddingTop = 0;
    let secondCardPaddingBottom = 0;
    let secondCardWrapperMarginTop = 0;

    const container = containerRef.current;
    const mainCard = mainCardRef.current;
    const secondCard = secondCardRef.current;

    containerNaturalHeight = container.offsetHeight || container.scrollHeight;
    mainCardNaturalHeight = mainCard.offsetHeight || 448;
    secondCardNaturalHeight = secondCard.offsetHeight || 256;

    const secondCardStyle = window.getComputedStyle(secondCard);
    secondCardPaddingTop = parseFloat(secondCardStyle.paddingTop) || 0;
    secondCardPaddingBottom = parseFloat(secondCardStyle.paddingBottom) || 0;

    const secondCardWrapper = secondCardWrapperRef.current;
    if (secondCardWrapper) {
      const secondCardWrapperStyle = window.getComputedStyle(secondCardWrapper);
      secondCardWrapperMarginTop = parseFloat(secondCardWrapperStyle.marginTop) || 0;
      gsap.set(secondCardWrapper, { marginTop: 0 });
    }

    gsap.set(container, {
      height: 0,
      overflow: 'hidden',
      transformOrigin: 'top center',
      opacity: 1
    });

    gsap.set(mainCard, {
      height: 0,
      overflow: 'hidden'
    });

    gsap.set(secondCard, {
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      overflow: 'hidden'
    });

    const timeoutId = setTimeout(() => {
      tl = gsap.timeline({ delay: 0.25 });

      if (containerRef.current && tl && containerNaturalHeight > 0) {
        const container = containerRef.current;

        tl.to(container, {
          height: containerNaturalHeight,
          duration: 0.9,
          ease: 'power3.out'
        });
      }

      if (mainCardRef.current && mainCardNaturalHeight > 0) {
        const mainCard = mainCardRef.current;

        tl.to(mainCard, {
          height: mainCardNaturalHeight,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(mainCard, {
              overflow: 'hidden'
            });
          }
        }, '-=.9');
      }

      if (secondCardRef.current && secondCardNaturalHeight > 0) {
        const secondCard = secondCardRef.current;
        const secondCardWrapper = secondCardWrapperRef.current;

        if (secondCardWrapper) {
          tl.to(secondCardWrapper, {
            marginTop: secondCardWrapperMarginTop,
            duration: 0.9,
            ease: 'power3.out'
          }, '-=0.9');
        }

        tl.to(secondCard, {
          height: secondCardNaturalHeight,
          paddingTop: secondCardPaddingTop,
          paddingBottom: secondCardPaddingBottom,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(secondCard, {
              overflow: 'hidden'
            });
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                height: 'auto',
                overflow: 'visible'
              });
            }
          }
        }, secondCardWrapper ? '<' : '-=0');
      }


      if (viewCollectionButtonRef.current) {
        gsap.set(viewCollectionButtonRef.current, {
          opacity: 0
        });

        tl.to(viewCollectionButtonRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'sine.out'
        }, '-=0.35');
      }



    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (tl) {
        tl.kill();
      }
    };
  }, []);



  return (
    <div className="relative min-h-screen">
      <video
        ref={backgroundVideoRef}
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="https://cdn.shopify.com/videos/c/o/v/6b530aed17a24fd9a249c127ada83113.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="relative z-10 flex items-start justify-center min-h-screen pt-25 px-4 pb-0 md:pb-auto">
        <div
          ref={containerRef}
          className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl"
          style={{ opacity: 0 }}
        >
          <div
            ref={mainCardRef}
            className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] w-full flex flex-col h-[28rem] relative overflow-hidden"
          >
            <video
              ref={collectionVideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/Card.mp4"
              autoPlay
              muted
              loop
              playsInline
            />

            <div className="absolute inset-0 bg-black/30"></div>

            <div className="relative z-10 flex flex-col justify-center h-full px-8 space-y-4" style={{ overflow: 'visible', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
              <div className="slide-title" style={{ overflow: 'visible', lineHeight: '1.2', paddingTop: '0.2rem', paddingBottom: '0.2rem' }}>
                <SplitText
                  text={latestCollection.title}
                  className="text-4xl font-light text-white"
                  delay={500}
                  duration={1}
                  ease="power4.out"
                  splitType="words"
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="left"
                  onLetterAnimationComplete={() => {
                  }}
                />
              </div>
              <LinkWithTransition
                ref={viewCollectionButtonRef}
                href={`/products?collection=${latestCollection.handle}`}
                className="bg-white/20 backdrop-blur-sm border border-white/70 text-white px-6 py-3 rounded-full text-sm font-light hover:bg-white/30 transition-all duration-200 w-fit"
              >
                {t('home.viewCollection')}
              </LinkWithTransition>
            </div>
          </div>

          <div ref={secondCardWrapperRef} className="mt-4">
            <LinkWithTransition href="/collections" className="block group" aria-label="Explore collections">
              <div
                ref={secondCardRef}
                className="bg-black/90 backdrop-blur-md rounded-[60px] lg:rounded-[40px] w-full flex flex-col h-[256px] p-12 md:p-16 relative items-center justify-center cursor-pointer border border-white/5 group-hover:border-white/10 transition-all duration-0"
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-light text-white text-center mb-8 md:mb-10 max-w-3xl leading-tight" style={{ letterSpacing: '-0.03em' }}>
                  {t('home.seeAllCollections')}
                </div>
                <div className="inline-flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm md:text-base font-extralight text-white uppercase tracking-widest" style={{ letterSpacing: '0.15em' }}>
                    {t('home.explore')}
                  </span>
                  <div className="w-px h-4 bg-white/50"></div>
                  <div className="rounded-full w-10 h-10 flex items-center justify-center border border-white/30 group-hover:border-white/60 group-hover:bg-white/10 transition-all duration-300">
                    <FiArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
              </div>
            </LinkWithTransition>
          </div>
        </div>
      </div>

      <div ref={benefitsRef} className="relative z-10 px-4 mt-4 mb-8 md:mb-12">
        <div className="bg-black/30 backdrop-blur-md rounded-[30px] border border-white/10 p-6 md:p-8 w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
                <FiTruck className="w-5 h-5 text-white/80" />
              </div>
              <h4 className="text-white font-light text-lg tracking-wide">Fast Shipping</h4>
              <p className="text-white/50 text-sm font-extralight max-w-[200px]">Delivery within 3-5 business days depending on your location.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
                <FiRefreshCw className="w-5 h-5 text-white/80" />
              </div>
              <h4 className="text-white font-light text-lg tracking-wide">Easy Returns</h4>
              <p className="text-white/50 text-sm font-extralight max-w-[200px]">Hassle-free returns within 30 days of purchase.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1">
                <FiShield className="w-5 h-5 text-white/80" />
              </div>
              <h4 className="text-white font-light text-lg tracking-wide">Premium Quality</h4>
              <p className="text-white/50 text-sm font-extralight max-w-[200px]">Crafted with high-grade sustainable materials.</p>
            </div>
          </div>
        </div>
      </div>

      <div ref={featuredProductsRef} className="relative z-10 px-4 mb-8 md:mb-12">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight">Trending Now</h3>
            <LinkWithTransition href="/collections" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-white/50 pb-1">
              View All
            </LinkWithTransition>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                images: [
                  "https://cdn.shopify.com/s/files/1/0703/4562/1751/files/HoodieB3.webp?v=1766373916",
                  "https://cdn.shopify.com/s/files/1/0703/4562/1751/files/HoodieG3.webp?v=1766373916"
                ],
                product: trendingProducts?.find(p => p.title.toLowerCase().includes('hoodie')) || trendingProducts?.[0],
                fallback: 'Premium Hoodie'
              },
              {
                images: [
                  "https://cdn.shopify.com/s/files/1/0703/4562/1751/files/SweatshortG3.webp?v=1766373884",
                  "https://cdn.shopify.com/s/files/1/0703/4562/1751/files/SweatshortB3.webp?v=1766373884"
                ],
                product: trendingProducts?.find(p => p.title.toLowerCase().includes('short')) || trendingProducts?.[1],
                fallback: 'Essential Shorts'
              }
            ].map((item, index) => (
              <LinkWithTransition
                key={index}
                href={item.product ? `/product/${item.product.handle}` : '/collections'}
                className="group relative bg-black/30 backdrop-blur-md rounded-[40px] border border-white/10 overflow-hidden aspect-[4/5] md:aspect-[3/4] block cursor-pointer"
              >
                {item.images.map((imgUrl, imgIndex) => (
                  <Image
                    key={imgUrl}
                    src={imgUrl}
                    alt={item.product?.title || item.fallback}
                    fill
                    className={`object-cover transition-opacity duration-1000 group-hover:scale-105 ${activeTrendingIndex === imgIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    loader={shopifyLoader}
                  />
                ))}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 md:p-10 flex flex-col items-start">
                  <h4 className="text-2xl md:text-3xl font-light text-white mb-2">
                    {item.product?.title || item.fallback}
                  </h4>
                  <p className="text-white/70 font-extralight text-sm mb-6 max-w-xs line-clamp-2">
                    {item.product?.description || 'Premium athleisure wear.'}
                  </p>
                  <div
                    className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-white/90 transition-all w-full md:w-auto text-center"
                  >
                    Shop Now
                  </div>
                </div>
              </LinkWithTransition>
            ))}
          </div>
        </div>
      </div>

      <div ref={socialProofRef} className="relative z-10 px-4 mb-8 md:mb-12">
        <div className="w-full max-w-5xl mx-auto bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-6 md:p-8">
          <div className="text-center mb-10 cursor-pointer" onClick={handleCommunityClick}>
            {communityNewsletterState === 'idle' && (
              <>
                <h3 className="text-2xl md:text-3xl font-light text-white mb-3 tracking-tight group-hover:text-white/80 transition-colors">Join the Movement</h3>
                <p className="text-white/60 font-extralight group-hover:text-white/80 transition-colors">Tag @shadedthebrand to be featured</p>
              </>
            )}

            {communityNewsletterState === 'interacting' && (
              <div className="w-full max-w-md mx-auto animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl md:text-3xl font-light text-white mb-6">Join the Movement</h3>
                <form onSubmit={handleCommunityNewsletterSubmit} className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={communityEmail}
                    onChange={(e) => setCommunityEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={communityLoading}
                    className="w-full bg-white text-black rounded-full px-6 py-4 font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {communityLoading ? t('newsletter.subscribing') : t('newsletter.subscribe')}
                    {!communityLoading && <FiArrowRight />}
                  </button>
                  {communityErrorMessage && <p className="text-red-400 text-sm">{communityErrorMessage}</p>}
                </form>
              </div>
            )}

            {communityNewsletterState === 'success' && (
              <div className="w-full max-w-md mx-auto animate-fadeIn">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-6 border border-green-500/30">
                  <FiCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-white mb-2">{t('newsletter.success')}</h3>
                <p className="text-white/70 font-light">{t('newsletter.welcome')}.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              "https://cdn.shopify.com/s/files/1/0703/4562/1751/files/Join1.webp?v=1766376407",
              "https://cdn.shopify.com/s/files/1/0703/4562/1751/files/Join2.webp?v=1766376407",
              "https://cdn.shopify.com/s/files/1/0703/4562/1751/files/Join3.webp?v=1766376407",
              "https://cdn.shopify.com/s/files/1/0703/4562/1751/files/Join4.webp?v=1766376407"
            ].map((url, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <Image
                  src={url}
                  alt={`Community Member ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                  sizes="(min-width: 768px) 25vw, 50vw"
                  loader={shopifyLoader}
                />
              </div>
            ))}
          </div>


        </div>
      </div>
      <div className="relative z-10 px-4 mb-8 md:mb-10 mt-8 md:mt-10">
        <div
          ref={discountCardRef}
          className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-[60px] lg:rounded-[40px] h-[20rem] md:h-[28rem]">
            <Image
              src="https://cdn.shopify.com/s/files/1/0703/4562/1751/files/SignIn.webp?v=1766375386"
              alt={t('home.getDiscount')}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 80rem, 100vw"
              loader={shopifyLoader}
            />
            <div className={`absolute inset-0 transition-colors duration-500 ${newsletterState === 'interacting' ? 'bg-black/70' : 'bg-black/50'}`}></div>

            <div
              className="absolute inset-0 flex flex-col items-start justify-center text-left px-8 md:px-12 lg:px-16 cursor-pointer"
              onClick={handleDiscountClick}
            >
              {newsletterState === 'idle' && (
                <>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4 md:mb-6 max-w-2xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
                    {t('home.getDiscount')}
                  </h3>
                  <p className="text-sm md:text-base lg:text-lg font-extralight text-white/70 mb-8 md:mb-10 max-w-xl" style={{ letterSpacing: '-0.01em' }}>
                    {t('home.forAllNewMembers')}
                  </p>
                  <div className="inline-flex items-center gap-3 group/btn transition-all duration-300 hover:opacity-90">
                    <span className="text-sm md:text-base font-extralight text-white uppercase tracking-widest" style={{ letterSpacing: '0.15em' }}>
                      {t('home.signIn')}
                    </span>
                    <div className="w-px h-4 bg-white/50"></div>
                    <div className="rounded-full w-10 h-10 flex items-center justify-center border border-white/30 group-hover/btn:border-white/60 group-hover/btn:bg-white/10 transition-all duration-300">
                      <FiArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                </>
              )}

              {newsletterState === 'interacting' && (
                <div className="w-full max-w-md animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-2xl md:text-3xl font-light text-white mb-6">{t('newsletter.joinCommunity')}</h3>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('newsletter.placeholder')}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-white text-black rounded-full px-6 py-4 font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? t('newsletter.subscribing') : t('newsletter.subscribe')}
                      {!loading && <FiArrowRight />}
                    </button>
                    {errorMessage && <p className="text-red-400 text-sm ml-4">{errorMessage}</p>}
                  </form>
                </div>
              )}

              {newsletterState === 'success' && (
                <div className="w-full max-w-md animate-fadeIn text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-6 border border-green-500/30">
                    <FiCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-light text-white mb-2">{t('newsletter.success')}</h3>
                  <p className="text-white/70 font-light">{t('newsletter.welcome')}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-8 md:pb-12 mt-8 md:mt-10">
        <div
          ref={movementCardRef}
          className="bg-black/30 backdrop-blur-md rounded-[60px] border border-white/10 p-2 lg:p-6 w-full max-w-5xl mx-auto"
        >
          <div className="relative bg-black rounded-[60px] lg:rounded-[40px] overflow-hidden min-h-[600px] md:min-h-[500px] flex items-center justify-center">
            <Image
              src="https://cdn.shopify.com/s/files/1/0703/4562/1751/files/Movement.webp?v=1766375294"
              alt="Shaded Movement"
              fill
              className="object-cover"
              sizes="100vw"
              loader={shopifyLoader}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center justify-center p-8 md:p-12 text-center w-full">
              <div className="relative w-32 h-12 md:w-40 md:h-16 mb-4 opacity-90 block shrink-0">
                <Image
                  src="/logo.png"
                  alt="Shaded Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <span className="text-white/80 uppercase tracking-[0.2em] text-xs md:text-sm font-medium mb-6">
                {t('home.movementSubtitle')}
              </span>

              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('home.movementMainTitle')}
              </h2>

              <div className="max-w-xl mx-auto relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <p className="text-lg md:text-xl font-light text-white/90 leading-relaxed">
                  {t('home.movementDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
