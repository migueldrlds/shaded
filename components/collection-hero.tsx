'use client';

import { useLanguage } from 'components/providers/language-provider';
import shopifyLoader from 'lib/image-loader';
import Image from 'next/image';
import React from 'react';

interface CollectionHeroProps {
    collectionName: string;
    productCount: number;
    collectionHandle: string;
}

const CollectionHero: React.FC<CollectionHeroProps> = ({
    collectionName,
    productCount,
    collectionHandle
}) => {
    const { t } = useLanguage();

    return (
        <>
            {/* Desktop Hero Header (Hidden on Mobile) */}
            <div className="hidden md:block mb-16">
                {/* Text Content - enhanced display */}
                <div className="max-w-5xl mb-12">
                    <div className="space-y-6">
                        {/* Main title - massive impact */}
                        <h1 className="text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter max-w-4xl uppercase">
                            {collectionName || collectionHandle.replace(/-/g, ' ')}
                        </h1>

                        {/* Divider line */}
                        <div className="w-24 h-px bg-gradient-to-r from-white/50 to-transparent"></div>

                        {/* Product count */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-light text-white tabular-nums">
                                {productCount.toString().padStart(2, '0')}
                            </span>
                            <span className="text-sm text-white/60 uppercase tracking-wider">
                                {productCount === 1 ? t('collection.product') : t('collection.products')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hero Image - rounded */}
                <div className="relative w-full aspect-[5/1] rounded-3xl overflow-hidden border border-white/10 bg-black/20">
                    <Image
                        src="/Shaded Photoshoot/Shaded Photoshoot0540.jpg"
                        alt={collectionName || collectionHandle}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                        loader={shopifyLoader}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
            </div>

            {/* Mobile Hero Card (Visible only on Mobile) */}
            <div className="md:hidden w-full max-w-2xl relative mb-12">
                <div className="block bg-white/30 backdrop-blur-xl rounded-3xl h-66 relative overflow-visible">
                    <div className="flex h-full">
                        {/* Información - lado izquierdo */}
                        <div className="flex-1 p-6 flex flex-col justify-between z-10 relative">
                            <div>
                                <span className="text-[10px] font-medium uppercase tracking-widest text-black/60 mb-2 block">
                                    {t('collection.tag')}
                                </span>
                                <h2 className="text-3xl font-black uppercase tracking-tighter leading-[0.9]" style={{ color: '#000000' }}>
                                    <span className="block">{collectionName || collectionHandle.replace(/-/g, ' ')}</span>
                                </h2>
                            </div>

                            <div className="flex flex-col items-start gap-3">
                                {/* Decorative pills similar to product card */}
                                <div className="flex gap-2">
                                    <div className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-white/40 backdrop-blur-sm border border-white/20">
                                        <span className="text-xs font-medium text-black/70">
                                            {productCount} {t('collection.items')}
                                        </span>
                                    </div>
                                </div>

                                {/* Bottom 'pill' area */}
                                <div className="bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                                    <span className="text-sm font-light text-white">{t('collection.viewAll')}</span>
                                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                        <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Imagen - lado derecho (break out) */}
                        <div className="absolute -right-3 -top-4 w-40 h-[calc(100%+1rem)] flex-shrink-0">
                            <Image
                                src="/Shaded Photoshoot/Shaded Photoshoot0540.jpg"
                                alt={collectionName || collectionHandle}
                                fill
                                className="object-cover rounded-3xl"
                                sizes="(max-width: 768px) 50vw"
                                priority
                                loader={shopifyLoader}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CollectionHero;
