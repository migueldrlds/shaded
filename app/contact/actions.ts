'use server';

import { ensureStartsWith } from 'lib/utils';
import { headers } from 'next/headers';

export async function submitContactForm(prevState: any, formData: FormData) {
    const domain = process.env.SHOPIFY_STORE_DOMAIN
        ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
        : '';

    if (!domain) {
        return { success: false, message: 'Shop domain not configured' };
    }

    const email = formData.get('email');
    const body = formData.get('comment');
    const name = formData.get('name');
    const phone = formData.get('phone');


    const formBody = new URLSearchParams();
    formBody.append('form_type', 'contact');
    formBody.append('utf8', '✓');
    formBody.append('contact[email]', email as string);
    formBody.append('contact[body]', `Name: ${name}\nPhone: ${phone}\n\nMessage:\n${body}`);

    try {

        const response = await fetch(`${domain}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': (await headers()).get('user-agent') || 'Next.js Server',
                'Origin': domain,
            },
            body: formBody,
            redirect: 'manual'
        });







        if (response.status === 302 || response.status === 303) {
            const location = response.headers.get('location');
            if (location && location.includes('contact_posted=true')) {
                return { success: true, message: 'Message sent successfully' };
            }
        }


        return { success: true, message: 'Message sent' };

    } catch (error) {
        console.error('Contact form submission error:', error);
        return { success: false, message: 'Failed to send message. Please try again later.' };
    }
}
