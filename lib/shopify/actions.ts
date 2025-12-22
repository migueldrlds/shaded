'use server';

import { shopifyFetch } from 'lib/shopify';
import { customerCreateMutation } from 'lib/shopify/mutations/customer';

export async function subscribeToNewsletter(email: string) {
    try {

        const password = Math.random().toString(36).slice(-10) + "Shad3d!";


        const variables = {
            input: {
                email,
                password,
                acceptsMarketing: true,
                firstName: 'Subscriber',
                lastName: 'Newsletter'
            }
        };

        const res = await shopifyFetch<any>({
            query: customerCreateMutation,
            variables
        });

        const { customerCreate } = res.body.data;


        if (customerCreate?.customerUserErrors?.length > 0) {
            const errors = customerCreate.customerUserErrors;
            const firstError = errors[0];


            if (firstError.code === 'TAKEN' || firstError.message.toLowerCase().includes('taken')) {
                return { success: true, status: 'already_subscribed' };
            }

            return { success: false, error: firstError.message };
        }

        return { success: true };
    } catch (error: any) {



        let errorMessage = '';
        let errorCode = '';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object') {

            errorMessage = error.message || JSON.stringify(error);
            if (error.extensions?.code) {
                errorCode = error.extensions.code;
            }
        } else {
            errorMessage = String(error);
        }


        if (errorCode === 'THROTTLED' || errorMessage.includes('Limit exceeded')) {
            return { success: false, error: 'Too many attempts. Please try again in 5 minutes.' };
        }


        if (errorMessage.toLowerCase().includes('verify your email')) {
            return { success: true };
        }


        return { success: false, error: errorMessage };
    }
}
