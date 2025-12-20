'use server';

import { shopifyFetch } from 'lib/shopify';
import { customerCreateMutation } from 'lib/shopify/mutations/customer';

export async function subscribeToNewsletter(email: string) {
    try {
        // Generar una contraseña aleatoria compleja para cumplir con requisitos de seguridad
        // ya que Storefront API requiere contraseña para crear cliente
        const password = Math.random().toString(36).slice(-10) + "Shad3d!";

        // Opcional: Podríamos pasar firstName: 'Newsletter' o algo similar si es requerido
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

        // Manejar errores
        if (customerCreate?.customerUserErrors?.length > 0) {
            const errors = customerCreate.customerUserErrors;
            const firstError = errors[0];

            // Si el email ya está registrado, lo consideramos "éxito" para UX (y evitar enumeración)
            // O podríamos intentar un "customerUpdate" si tuviéramos token, pero aquí no tenemos.
            if (firstError.code === 'TAKEN' || firstError.message.toLowerCase().includes('taken')) {
                return { success: true, status: 'already_subscribed' };
            }

            return { success: false, error: firstError.message };
        }

        return { success: true };
    } catch (error: any) {
        console.error('Newsletter subscription error:', error);

        // Intentar obtener el mensaje de error o el código de manera robusta
        let errorMessage = '';
        let errorCode = '';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object') {
            // Manejar estructura de error de Shopify GraphQLError
            errorMessage = error.message || JSON.stringify(error);
            if (error.extensions?.code) {
                errorCode = error.extensions.code;
            }
        } else {
            errorMessage = String(error);
        }

        // 1. Manejo de Rate Limiting (Demasiados intentos)
        if (errorCode === 'THROTTLED' || errorMessage.includes('Limit exceeded')) {
            return { success: false, error: 'Too many attempts. Please try again in 5 minutes.' };
        }

        // 2. Si Shopify pide verificación, lo consideramos éxito (UX similar al éxito)
        if (errorMessage.toLowerCase().includes('verify your email')) {
            return { success: true };
        }

        // 3. Fallback genérico con el mensaje real para debugging
        return { success: false, error: errorMessage };
    }
}
