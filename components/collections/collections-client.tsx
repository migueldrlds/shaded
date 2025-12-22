'use client';

import CollectionGrid from 'components/collections/collection-grid';
import { useLanguage } from 'components/providers/language-provider';
import { Collection } from 'lib/shopify/types';

export default function CollectionsClient({ collections }: { collections: Collection[] }) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-12 pb-6">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-4 uppercase text-center md:text-left">
                    {t('collections.title')}
                </h1>
                <p className="text-neutral-500 text-lg md:text-xl max-w-2xl font-light text-center md:text-left mx-auto md:mx-0">
                    {t('collections.subtitle')}
                </p>
            </div>

            <CollectionGrid collections={collections} />
        </div>
    );
}
