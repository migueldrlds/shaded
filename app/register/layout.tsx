
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Account',
    description: 'Join the Shaded community.'
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
