'use client';

import { useAuth } from 'components/auth/auth-context';
import LinkWithTransition from 'components/link-with-transition';
import { gsap } from 'gsap';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, customer, isLoading } = useAuth();
  const router = useRouter();


  const mobileCardRef = useRef<HTMLDivElement>(null);
  const mobileTitleRef = useRef<HTMLDivElement>(null);
  const mobileFormRef = useRef<HTMLFormElement>(null);
  const mobileLinkRef = useRef<HTMLDivElement>(null);

  const desktopGridRef = useRef<HTMLDivElement>(null);
  const desktopFormCardRef = useRef<HTMLDivElement>(null);
  const desktopNewCollectionCardRef = useRef<HTMLDivElement>(null);
  const desktopJoinCardRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    let ctx = gsap.context(() => {

      const isMobile = window.innerWidth < 768;

      if (isMobile && mobileCardRef.current) {

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        const mobileCard = mobileCardRef.current;


        const cardNaturalHeight = mobileCard.offsetHeight || mobileCard.scrollHeight;


        gsap.set(mobileCard, {
          height: 0,
          y: 500,
          overflow: 'hidden',
          opacity: 0,
          transformOrigin: 'bottom center'
        });


        tl.to(mobileCard, {
          height: cardNaturalHeight,
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => {

            if (mobileCard) {
              gsap.set(mobileCard, {
                height: 'auto',
                overflow: 'visible'
              });
            }
          }
        });


        if (mobileTitleRef.current) {
          gsap.set(mobileTitleRef.current.children, { opacity: 0, y: 20 });
          tl.to(mobileTitleRef.current.children, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.6
          }, '-=0.5');
        }

        if (mobileFormRef.current) {
          const formChildren = Array.from(mobileFormRef.current.children);
          gsap.set(formChildren, { opacity: 0, y: 15 });
          tl.to(formChildren, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5
          }, '-=0.5');
        }

        if (mobileLinkRef.current) {
          gsap.set(mobileLinkRef.current, { opacity: 0, y: 10 });
          tl.to(mobileLinkRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4
          }, '-=0.4');
        }
      } else if (!isMobile && desktopGridRef.current) {

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });


        const startTime = 0;


        if (desktopFormCardRef.current) {
          gsap.set(desktopFormCardRef.current, { opacity: 0, x: -80, scale: 0.95 });
          tl.to(desktopFormCardRef.current, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out'
          }, startTime);


          const formElements = desktopFormCardRef.current.querySelectorAll('input, button, a, p, h1, h2, div');
          gsap.set(formElements, { opacity: 0, y: 10 });
          tl.to(formElements, {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.4
          }, startTime + 0.3);
        }


        if (desktopNewCollectionCardRef.current) {
          gsap.set(desktopNewCollectionCardRef.current, { opacity: 0, y: 50, scale: 0.95 });
          tl.to(desktopNewCollectionCardRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out'
          }, startTime);


          const collectionElements = desktopNewCollectionCardRef.current.querySelectorAll('h2, p, a');
          gsap.set(collectionElements, { opacity: 0, y: 15 });
          tl.to(collectionElements, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.5
          }, startTime + 0.3);
        }


        if (desktopJoinCardRef.current) {

          const backgroundImage = desktopJoinCardRef.current.querySelector('img');
          if (backgroundImage) {
            gsap.set(backgroundImage, { opacity: 0, scale: 1.2 });
            tl.to(backgroundImage, {
              opacity: 1,
              scale: 1,
              duration: 1.0,
              ease: 'power2.out'
            }, startTime);
          }


          gsap.set(desktopJoinCardRef.current, { opacity: 0, x: 80, scale: 0.95 });
          tl.to(desktopJoinCardRef.current, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out'
          }, startTime);


          const joinContent = desktopJoinCardRef.current.querySelector('.relative.z-10');
          if (joinContent) {
            const joinElements = joinContent.querySelectorAll('h2, p, div');
            gsap.set(joinElements, { opacity: 0, y: 20 });
            tl.to(joinElements, {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.5
            }, startTime + 0.3);
          }
        }
      }
    });

    return () => ctx.revert();
  }, []);


  useEffect(() => {
    if (customer && !isLoading) {
      router.push('/');
    }
  }, [customer, isLoading, router]);


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    if (error) {
      setErrors([`Error de autenticación: ${decodeURIComponent(error)}`]);

      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.authorizationUrl) {



        window.location.href = data.authorizationUrl;
      } else {
        setErrors(data.errors || [data.error || 'Error al iniciar sesión']);
        setIsSubmitting(false);
      }
    } catch (error) {

      setErrors(['An unexpected error occurred']);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">

      <video
        className="fixed inset-0 w-full h-full object-cover -z-20"
        src="/shadedbg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />


      <div className="fixed inset-0 bg-black/20 -z-10"></div>


      <div className="relative z-10 flex items-end md:items-center justify-center min-h-screen">

        <div
          ref={mobileCardRef}
          className="bg-white/30 backdrop-blur-2xl rounded-t-[60px] md:hidden border border-white/10 border-b-0 p-8 w-full"
        >

          <div ref={mobileTitleRef} className="text-center mb-8">
            <h1 className="text-3xl font-medium text-black mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-black/70">Login to your account</p>
          </div>


          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-red-800 text-sm">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </div>
          )}

          <form ref={mobileFormRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="text-center mb-4">
              <p className="text-xs text-black/60">
                Recibirás un código de verificación en tu correo electrónico
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>


          <div ref={mobileLinkRef} className="text-center mt-4">
            <LinkWithTransition href="/" className="inline-flex items-center text-sm text-black/70 hover:text-black transition-colors duration-200">
              <FiArrowUpRight className="h-4 w-4 mr-1 rotate-180" />
              Back to home
            </LinkWithTransition>
          </div>
        </div>


        <div
          ref={desktopGridRef}
          className="hidden md:grid md:grid-cols-2 md:gap-6 md:w-full md:max-w-4xl md:mx-auto md:my-8"
        >

          <div className="space-y-6">

            <div ref={desktopFormCardRef} className="bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <Image src="/logob.png" alt="Shaded Logo" width={120} height={30} priority />
                  <div></div>
                </div>
                <h1 className="text-3xl font-medium text-black mb-2">
                  LOG IN
                </h1>
                <p className="text-sm text-black/70">Access your account</p>
              </div>


              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="text-red-800 text-sm">
                    {errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    id="email-desktop"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-[0.5px] border-black/30 px-0 py-2 text-black placeholder-black/40 focus:outline-none focus:ring-0 focus:border-black/70 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="text-center mb-4">
                  <p className="text-xs text-black/60">
                    Recibirás un código de verificación en tu correo electrónico
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Logging in...' : 'Enter'}
                </button>
              </form>

            </div>


            <div ref={desktopNewCollectionCardRef} className="bg-black/80 backdrop-blur-2xl rounded-[40px] border border-black/40 p-8">
              <div>
                <h2 className="text-2xl font-medium text-white mb-4">
                  New Collection
                </h2>
                <p className="text-sm text-white/70 mb-6">
                  Discover our latest streetwear essentials
                </p>
                <div className="flex justify-end">
                  <LinkWithTransition href="/collection" className="text-white text-lg font-medium hover:text-white/70 transition-colors duration-200">
                    Explore Now
                  </LinkWithTransition>
                </div>
              </div>
            </div>
          </div>


          <div ref={desktopJoinCardRef} className="relative bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/10 pl-4 pr-8 py-4 flex flex-col justify-start overflow-hidden">

            <div className="absolute inset-0 z-0">
              <Image
                src="/img1.jpg"
                alt="Background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="relative z-10 h-full">
              <div className="bg-white/20 backdrop-blur-xl rounded-l-[30px] rounded-r-2xl border border-white/20 px-6 py-4 h-full max-w-[200px] w-full text-left flex flex-col">
                <h2 className="text-1xl font-medium text-white mb-4">
                  Join the Movement
                </h2>
                <p className="text-1xl text-white/70 mb-6">
                  Be part of our community and get exclusive access to new releases, special offers, and insider updates.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-white/80">Early access to new drops</div>
                  <div className="text-sm text-white/80">Exclusive member discounts</div>
                  <div className="text-sm text-white/80">Free shipping on all orders</div>
                </div>


                <div className="mt-auto pb-4 flex justify-center">
                  <Image
                    src="/logo.png"
                    alt="Shaded Logo"
                    width={120}
                    height={30}
                    className="opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

