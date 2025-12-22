'use client';

import { useLanguage } from 'components/providers/language-provider';
import shopifyLoader from 'lib/image-loader';
import Image from 'next/image';
import React from 'react';

interface CollectionHeroProps {
    collectionName: string;
    productCount: number;
    collectionHandle: string;
    image?: string;
}

const CollectionHero: React.FC<CollectionHeroProps> = ({
    collectionName,
    productCount,
    collectionHandle,
    image
}) => {
    const { t } = useLanguage();

    return (
        <>

            <div className="hidden md:block mb-16">

                <div className="max-w-5xl mb-12">
                    <div className="space-y-6">

                        <h1 className="text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter max-w-4xl uppercase">
                            {collectionName || collectionHandle.replace(/-/g, ' ')}
                        </h1>


                        <div className="w-24 h-px bg-gradient-to-r from-white/50 to-transparent"></div>


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


                <div className="relative w-full aspect-[2.5/1] rounded-3xl overflow-hidden border border-white/10 bg-black/20">
                    <Image
                        src={image || "/Shaded Photoshoot/Shaded Photoshoot0540.jpg"}
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


            <div className="md:hidden w-full max-w-2xl relative mb-12">
                <div className="block bg-white/30 backdrop-blur-xl rounded-3xl h-96 relative overflow-visible">

                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={image || "/Shaded Photoshoot/Shaded Photoshoot0540.jpg"}
                            alt={collectionName || collectionHandle}
                            fill
                            className="object-cover rounded-3xl"
                            sizes="(max-width: 768px) 100vw"
                            priority
                            loader={shopifyLoader}
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl"></div>
                    </div>


                    <div className="relative z-10 p-6 flex flex-col justify-end h-full">
                        <div>
                            <span className="text-[10px] font-medium uppercase tracking-widest text-white/80 mb-2 block">
                                {t('collection.tag')}
                            </span>
                            <h2 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-3">
                                <span className="block">{collectionName || collectionHandle.replace(/-/g, ' ')}</span>
                            </h2>


                            <div className="inline-flex items-center justify-center h-8 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                                <span className="text-xs font-medium text-white">
                                    {productCount} {t('collection.items')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CollectionHero;
