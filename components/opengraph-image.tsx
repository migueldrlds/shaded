import { readFile } from 'fs/promises';
import { ImageResponse } from 'next/og';
import { resolve } from 'path';
import LogoIcon from './icons/logo';

export type Props = {
  title?: string;
};

export default async function OpengraphImage(
  props?: Props
): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: 'Shaded'
    },
    ...props
  };

  let font: ArrayBuffer | undefined;

  try {
    const fontPath = resolve(process.cwd(), 'fonts', 'Inter-Bold.ttf');
    const file = await readFile(fontPath);
    font = Uint8Array.from(file).buffer;
  } catch (error) {
    console.error('Error loading font:', error);

  }

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
        <div tw="flex flex-none items-center justify-center border border-neutral-700 h-[160px] w-[160px] rounded-3xl">
          <LogoIcon width="64" height="58" fill="white" />
        </div>
        <p tw="mt-12 text-6xl font-bold text-white">{title}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(font && {
        fonts: [
          {
            name: 'Inter',
            data: font,
            style: 'normal' as const,
            weight: 700
          }
        ]
      })
    }
  );
}
