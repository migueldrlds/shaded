'use client';

import LinkWithTransition from 'components/link-with-transition';
import { Collection } from 'lib/shopify/types';
import Image from 'next/image';
import { useState } from 'react';

interface CollectionGridProps {
    collections: Collection[];
}

import { useLanguage } from 'components/providers/language-provider';

export default function CollectionGrid({ collections }: CollectionGridProps) {
    const { t } = useLanguage();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const filteredCollections = collections.filter(c => c.handle !== '' && c.title !== 'All');

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12">
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {filteredCollections.map((collection, index) => (
                    <LinkWithTransition
                        key={collection.path}
                        href={collection.path}
                        className="group relative aspect-[3/2] overflow-hidden rounded-sm bg-gray-100 w-full md:w-[calc(66.66%-2rem)] grow"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105">
                            {collection.image ? (
                                <Image
                                    src={collection.image.url}
                                    alt={collection.image.altText || collection.title}
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 768px) 66vw, 100vw"
                                    quality={100}
                                    priority={index < 4}
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                                    <span className="text-neutral-400">{t('collections.noImage')}</span>
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                            <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                                <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter uppercase relative inline-block">
                                    {collection.title}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-500 ease-out group-hover:w-full"></span>
                                </h2>

                                <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                                    {collection.description && (
                                        <p className="text-white/70 text-sm font-light mt-2 line-clamp-2 max-w-md">
                                            {collection.description}
                                        </p>
                                    )}
                                    <p className="text-white/80 text-sm font-medium mt-4">
                                        {t('collections.explore')} &rarr;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </LinkWithTransition>
                ))}
                <div className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-black flex items-center justify-center border border-neutral-800 w-full md:w-[calc(33.33%-2rem)]">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 hidden"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black"></div>

                    <div className="relative z-10 text-center p-8">
                        <div className="w-16 h-0.5 bg-neutral-700 mx-auto mb-6"></div>
                        <h2 className="text-3xl font-bold text-neutral-500 mb-2 tracking-tighter uppercase select-none">
                            {t('collections.comingSoon')}
                        </h2>
                        <p className="text-neutral-600 text-sm font-medium uppercase tracking-widest">
                            {t('collections.newDrops')}
                        </p>
                    </div>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
            </div>
        </div>
    );
}
