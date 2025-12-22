'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


const translations: Record<Language, Record<string, string>> = {
  en: {
    'header.shopNow': 'Shop Now',
    'header.collection': 'Collections',
    'header.cart': 'Cart',
    'cart.bag': 'Bag',
    'cart.close': 'Close',
    'cart.emptyBag': 'Your bag is empty',
    'cart.shipping': 'Shipping',
    'cart.atCheckout': 'At Checkout',
    'cart.subtotal': 'Subtotal',
    'cart.checkout': 'Checkout',
    'cart.size': 'Size',
    'cart.color': 'Color',
    'footer.language': 'Language',
    'footer.customerService': 'Customer Service',
    'footer.returnPolicy': 'Return and Exchange Policy',
    'footer.shippingPolicy': 'Shipping Policy',
    'footer.terms': 'Terms and Conditions',
    'footer.customerSupport': 'Customer Support',
    'footer.contactForm': 'Contact Form',
    'footer.collections': 'Collections',
    'footer.allCollections': 'All Collections',
    'footer.connectWithUs': 'Connect with us',
    'footer.copyright': '© {year} Shaded. All rights reserved.',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.cookiePolicy': 'Cookie Policy',
    'footer.description': 'Join the movement with Shaded! Follow us on Social media for exclusive updates, style inspiration, and special offers. Be part of our community and stay connected with the latest in athleisure!',
    'common.english': 'English',
    'common.spanish': 'Español',
    'home.viewCollection': 'View collection',
    'home.seeAllCollections': 'See all of our collections',
    'home.explore': 'Explore',
    'home.getDiscount': 'Get a Discount',
    'home.forAllNewMembers': 'For all new members',
    'home.signIn': 'Sign In',
    'home.movementTitle': 'SHADED is more than just an Athleisure Brand IT\'S A MOVEMENT',
    'home.movementSubtitle': 'is more than just an Athleisure Brand',
    'home.movementMainTitle': 'IT\'S A MOVEMENT',
    'home.movementDescription': 'We totally get it, life is all about movement! Whether you\'re slaying a workout, managing a busy schedule, or simply enjoying some well-deserved chill time, our collection has got your back. Each piece is designed to help you feel confident and comfortable, no matter where the day takes you!',
    'collections.title': 'COLLECTIONS',
    'collections.description': 'Discover our selection of essential garments',
    'collections.comingSoon': 'COMING SOON',
    'collection.product': 'Product',
    'collection.products': 'Products',
    'collection.items': 'Items',
    'collection.viewAll': 'View All',
    'collection.tag': 'COLLECTION',
    'returnPolicy.title': 'Return and Exchange Policy',
    'returnPolicy.lastUpdated': 'Last updated:',
    'returnPolicy.returnPolicy': 'Return Policy',
    'returnPolicy.returnPolicyText': 'We offer a 30-day return policy for all items in original condition. Items must be unworn, unwashed, and with original tags attached.',
    'returnPolicy.eligibleItems': 'Eligible Items',
    'returnPolicy.eligibleItem1': 'All clothing items in original condition',
    'returnPolicy.eligibleItem2': 'Items with original tags and packaging',
    'returnPolicy.eligibleItem3': 'Items purchased within the last 30 days',
    'returnPolicy.nonReturnableItems': 'Non-Returnable Items',
    'returnPolicy.nonReturnableItem1': 'Items worn or washed',
    'returnPolicy.nonReturnableItem2': 'Items without original tags',
    'returnPolicy.nonReturnableItem3': 'Custom or personalized items',
    'returnPolicy.nonReturnableItem4': 'Sale items marked as final sale',
    'returnPolicy.howToReturn': 'How to Return',
    'returnPolicy.step1': 'Contact our customer service team',
    'returnPolicy.step2': 'Receive your return authorization number',
    'returnPolicy.step3': 'Package items securely with original tags',
    'returnPolicy.step4': 'Ship items back using prepaid return label',
    'returnPolicy.exchangePolicy': 'Exchange Policy',
    'returnPolicy.exchangePolicyText': 'We offer free exchanges for different sizes or colors of the same item. Exchanges are subject to availability and must be requested within 30 days of purchase.',
    'returnPolicy.refundProcess': 'Refund Process',
    'returnPolicy.refundProcessText': 'Once we receive your return, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method.',
    'returnPolicy.returnShipping': 'Return Shipping',
    'returnPolicy.returnShippingText': 'We provide prepaid return labels for all returns. Return shipping costs will be deducted from your refund unless the return is due to our error.',
    'shippingPolicy.title': 'Shipping Policy',
    'shippingPolicy.lastUpdated': 'Last updated:',
    'shippingPolicy.shippingInfo': 'Shipping Information',
    'shippingPolicy.shippingInfoText': 'We offer fast and reliable shipping to customers worldwide. All orders are processed and shipped within 1-2 business days.',
    'shippingPolicy.shippingMethods': 'Shipping Methods',
    'shippingPolicy.standardShipping': 'Standard Shipping: 5-7 business days',
    'shippingPolicy.expressShipping': 'Express Shipping: 2-3 business days',
    'shippingPolicy.overnightShipping': 'Overnight Shipping: 1 business day (US only)',
    'shippingPolicy.shippingCosts': 'Shipping Costs',
    'shippingPolicy.shippingCostsText': 'Shipping costs are calculated at checkout based on your location and selected shipping method. Free shipping is available on orders over $75.',
    'shippingPolicy.internationalShipping': 'International Shipping',
    'shippingPolicy.internationalShippingText': 'We ship to most countries worldwide. International orders may be subject to customs duties and taxes, which are the responsibility of the customer.',
    'shippingPolicy.orderTracking': 'Order Tracking',
    'shippingPolicy.orderTrackingText': 'Once your order ships, you will receive a tracking number via email. You can track your package using this number on the carrier\'s website.',
    'shippingPolicy.deliveryIssues': 'Delivery Issues',
    'shippingPolicy.deliveryIssuesText': 'If you experience any issues with delivery, please contact our customer service team within 30 days of the expected delivery date.',
    'terms.title': 'Terms and Conditions',
    'terms.lastUpdated': 'Last updated:',
    'terms.acceptanceOfTerms': '1. Acceptance of Terms',
    'terms.acceptanceOfTermsText': 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.',
    'terms.useLicense': '2. Use License',
    'terms.useLicenseText': 'Permission is granted to temporarily download one copy of the materials on Shaded\'s website for personal, non-commercial transitory viewing only.',
    'terms.disclaimer': '3. Disclaimer',
    'terms.disclaimerText': 'The materials on Shaded\'s website are provided on an \'as is\' basis. Shaded makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.',
    'terms.limitations': '4. Limitations',
    'terms.limitationsText': 'In no event shall Shaded or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Shaded\'s website, even if Shaded or a Shaded authorized representative has been notified orally or in writing of the possibility of such damage.',
    'terms.accuracyOfMaterials': '5. Accuracy of materials',
    'terms.accuracyOfMaterialsText': 'The materials appearing on Shaded\'s website could include technical, typographical, or photographic errors. Shaded does not warrant that any of the materials on its website are accurate, complete or current.',
    'terms.links': '6. Links',
    'terms.linksText': 'Shaded has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Shaded of the site.',
    'terms.modifications': '7. Modifications',
    'terms.modificationsText': 'Shaded may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.',
    'terms.governingLaw': '8. Governing Law',
    'terms.governingLawText': 'These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.',
    'support.title': 'Customer Support',
    'support.subtitle': 'We\'re here to help you with any questions or concerns',
    'support.contactInfo': 'Contact Information',
    'support.emailSupport': 'Email Support',
    'support.emailResponse': 'Response within 24-48 hours',
    'support.phoneSupport': 'Phone Support',
    'support.phoneHours': 'Mon-Fri 9AM-6PM EST',
    'support.liveChat': 'Live Chat',
    'support.liveChatText': 'Available on our website',
    'support.faq': 'Frequently Asked Questions',
    'support.faqTrackOrder': 'How do I track my order?',
    'support.faqTrackOrderAnswer': 'You\'ll receive a tracking number via email once your order ships.',
    'support.faqReturnPolicy': 'What is your return policy?',
    'support.faqReturnPolicyAnswer': 'We offer 30-day returns on all items in original condition.',
    'support.faqInternationalShipping': 'Do you ship internationally?',
    'support.faqInternationalShippingAnswer': 'Yes, we ship to most countries worldwide.',
    'support.faqChangeOrder': 'How can I change my order?',
    'support.faqChangeOrderAnswer': 'Contact us immediately if your order hasn\'t shipped yet.',
    'support.contactUs': 'Contact Us',
    'contact.title': 'Support Contact Form',
    'contact.subtitle': 'Customer inquiries are responded to within 24-48 hours.',
    'contact.contactForm': 'Contact form',
    'contact.name': 'Name',
    'contact.namePlaceholder': 'Enter your full name',
    'contact.email': 'Email *',
    'contact.emailPlaceholder': 'Enter your email address',
    'contact.phone': 'Phone number',
    'contact.phonePlaceholder': 'Enter your phone number',
    'contact.comment': 'Comment',
    'contact.commentPlaceholder': 'Tell us how we can help you...',
    'contact.sendMessage': 'Send Message',
    'contact.successMessage': 'Thank you for your message! We will get back to you within 24-48 hours.',
    'product.shipping': 'Shipping',
    'product.shippingCalculated': 'calculated at checkout',
    'product.selected': 'Selected',
    'product.color': 'COLOR',
    'product.size': 'SIZE',
    'product.quantity': 'Quantity',
    'product.addToCart': 'Add to Cart',
    'product.details': 'Product Details',
    'product.detailsMobile': 'PRODUCT DETAILS',
    'product.share': 'Share',
    'product.descriptionNotAvailable': 'Product description not available.',
    'product.sizePlaceholder': 'Size',
    'product.colorPlaceholder': 'Color',
    'product.outOfStock': '(Out of Stock)',
    'product.youMayAlsoLove': 'You may also love',
    'newsletter.bePartOfMovement': 'BE PART OF THE MOVEMENT',
    'newsletter.description': 'Be the first to know about launch updates, styling ideas and exclusive offers.',
    'newsletter.email': 'Email',
    'newsletter.subscribe': 'Subscribe',
    'newsletter.subscribing': 'Subscribing...',
    'newsletter.success': 'Thank you for subscribing!',
    'newsletter.error': 'An error occurred. Please try again.',
    'newsletter.joinCommunity': 'Join the Community',
    'newsletter.placeholder': 'Enter your email',
    'newsletter.welcome': 'Welcome to the movement',
    'newsletter.tooManyAttempts': 'Too many attempts. Please try again later.',
    'orders.title': 'My Orders',
    'orders.welcome': 'Welcome, {name}',
    'orders.history': 'Here you can view your order history',
    'orders.empty': 'You have no orders yet',
    'orders.firstPurchase': 'When you place your first order, it will appear here',
    'orders.explore': 'Explore Products',
    'orders.orderNumber': 'Order #{number}',
    'orders.viewStatus': 'View Status',
    'orders.quantity': 'Quantity: {quantity}',
    'order.notFound': 'Order not found',
    'order.backToOrders': 'Back to My Orders',
    'order.confirmedOn': 'Confirmed on {date}',
    'order.status.fulfilled': 'Fulfilled',
    'order.status.partial': 'Partially Shipped',
    'order.status.unfulfilled': 'Unfulfilled',
    'order.status.confirmed': 'Confirmed',
    'order.products': 'Products ({count})',
    'order.shippingAddress': 'Shipping Address',
    'order.summary': 'Summary',
    'order.subtotal': 'Subtotal',
    'order.shipping': 'Shipping',
    'order.tax': 'Tax',
    'order.total': 'Total',
    'order.requestReturn': 'Request Return',
    'order.viewOnShopify': 'View on Shopify',
    'order.buyAgain': 'Buy Again',
    'returns.title': 'Request Return',
    'returns.orderNumber': 'Order #{number}',
    'returns.productToReturn': 'Product to Return',
    'returns.noProducts': 'No products available for return',
    'returns.notEligible': 'This order may no longer be eligible for returns',
    'returns.whyReturn': 'Why do you want to return it?',
    'returns.selectReason': 'Select Reason',
    'returns.return': 'Return',
    'returns.eligibilityNote': 'Return and refund eligibility will be based on our return policy.',
    'returns.submit': 'Submit Return',
    'returns.processing': 'Processing...',
    'returns.cancel': 'Cancel',
    'returns.successTitle': 'Request Sent!',
    'returns.successMessage': 'Your return request has been submitted. We will contact you shortly with the next steps.',
    'returns.errorReason': 'Please select a reason for the return',
    'returns.errorSubmit': 'Error processing return request',
    'verify.title': 'Enter Code',
    'verify.sentTo': 'Sent to {email}',
    'verify.codeLabel': '6-digit code',
    'verify.submit': 'Verify Code',
    'verify.verifying': 'Verifying...',
    'verify.resendQuestion': 'Didn\'t receive the code?',
    'verify.resendAction': 'Resend Code',
    'verify.signInOther': 'Sign in with another email',
    'verify.privacy': 'Privacy Policy',
    'verify.terms': 'Terms of Service',
    'verify.errorComplete': 'Please enter the complete 6-digit code',
    'verify.errorSession': 'Missing session info. Please try logging in again.',
    'verify.resendSuccess': 'Code resent to your email',
    'auth.welcomeBack': 'Welcome Back',
    'auth.loginSubtitle': 'Login to your account',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.codeSent': 'You will receive a verification code slightly',
    'auth.loginButton': 'Login',
    'auth.loggingIn': 'Logging in...',
    'auth.backToHome': 'Back to home',
    'auth.createAccount': 'CREATE ACCOUNT',
    'auth.joinCommunity': 'Join the Shaded community',
    'auth.firstName': 'First name',
    'auth.lastName': 'Last name',
    'auth.createPassword': 'Create password',
    'auth.confirmPassword': 'Confirm password',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.registrationDisabled': 'Registration Disabled',
    'auth.registrationTempDisabled': 'Registration is temporarily disabled',
    'userMenu.myOrders': 'My Orders',
    'userMenu.logout': 'Logout',

  },
  es: {
    'header.shopNow': 'Comprar Ahora',
    'header.collection': 'Colecciones',
    'header.cart': 'Carrito',
    'cart.bag': 'Bolsa',
    'cart.close': 'Cerrar',
    'cart.emptyBag': 'Tu bolsa está vacía',
    'cart.shipping': 'Envío',
    'cart.atCheckout': 'En el checkout',
    'cart.subtotal': 'Subtotal',
    'cart.checkout': 'Finalizar compra',
    'cart.size': 'Talla',
    'cart.color': 'Color',
    'footer.language': 'Idioma',
    'footer.customerService': 'Servicio al Cliente',
    'footer.returnPolicy': 'Política de Devoluciones y Cambios',
    'footer.shippingPolicy': 'Política de Envío',
    'footer.terms': 'Términos y Condiciones',
    'footer.customerSupport': 'Soporte al Cliente',
    'footer.contactForm': 'Formulario de Contacto',
    'footer.collections': 'Colecciones',
    'footer.allCollections': 'Todas las Colecciones',
    'footer.connectWithUs': 'Conéctate con nosotros',
    'footer.copyright': '© {year} Shaded. Todos los derechos reservados.',
    'footer.privacyPolicy': 'Política de Privacidad',
    'footer.cookiePolicy': 'Política de Cookies',
    'footer.description': '¡Únete al movimiento con Shaded! Síguenos en las redes sociales para actualizaciones exclusivas, inspiración de estilo y ofertas especiales. Sé parte de nuestra comunidad y mantente conectado con lo último en athleisure!',
    'common.english': 'English',
    'common.spanish': 'Español',
    'home.viewCollection': 'Ver colección',
    'home.seeAllCollections': 'Ver todas nuestras colecciones',
    'home.explore': 'Explorar',
    'home.getDiscount': 'Obtén un Descuento',
    'home.forAllNewMembers': 'Para todos los nuevos miembros',
    'home.signIn': 'Iniciar Sesión',
    'home.movementTitle': 'SHADED es más que una marca de Athleisure ES UN MOVIMIENTO',
    'home.movementSubtitle': 'es más que una marca de Athleisure',
    'home.movementMainTitle': 'ES UN MOVIMIENTO',
    'home.movementDescription': '¡Entendemos perfectamente que la vida se trata de movimiento! Ya sea que estés dando lo mejor en un entrenamiento, manejando una agenda ocupada, o simplemente disfrutando de un merecido tiempo de relajación, nuestra colección te respalda. Cada pieza está diseñada para ayudarte a sentirte seguro y cómodo, sin importar a dónde te lleve el día!',
    'collections.title': 'COLECCIONES',
    'collections.description': 'Descubre nuestra selección de prendas esenciales',
    'collections.comingSoon': 'PRÓXIMAMENTE',
    'collection.product': 'Producto',
    'collection.products': 'Productos',
    'collection.items': 'Artículos',
    'collection.viewAll': 'Ver Todo',
    'collection.tag': 'COLECCIÓN',
    'returnPolicy.title': 'Política de Devoluciones y Cambios',
    'returnPolicy.lastUpdated': 'Última actualización:',
    'returnPolicy.returnPolicy': 'Política de Devoluciones',
    'returnPolicy.returnPolicyText': 'Ofrecemos una política de devolución de 30 días para todos los artículos en condición original. Los artículos deben estar sin usar, sin lavar y con las etiquetas originales adjuntas.',
    'returnPolicy.eligibleItems': 'Artículos Elegibles',
    'returnPolicy.eligibleItem1': 'Todos los artículos de ropa en condición original',
    'returnPolicy.eligibleItem2': 'Artículos con etiquetas y empaque originales',
    'returnPolicy.eligibleItem3': 'Artículos comprados en los últimos 30 días',
    'returnPolicy.nonReturnableItems': 'Artículos No Devolubles',
    'returnPolicy.nonReturnableItem1': 'Artículos usados o lavados',
    'returnPolicy.nonReturnableItem2': 'Artículos sin etiquetas originales',
    'returnPolicy.nonReturnableItem3': 'Artículos personalizados o hechos a medida',
    'returnPolicy.nonReturnableItem4': 'Artículos en venta marcados como venta final',
    'returnPolicy.howToReturn': 'Cómo Devolver',
    'returnPolicy.step1': 'Contacta a nuestro equipo de servicio al cliente',
    'returnPolicy.step2': 'Recibe tu número de autorización de devolución',
    'returnPolicy.step3': 'Empaqueta los artículos de forma segura con las etiquetas originales',
    'returnPolicy.step4': 'Envía los artículos de vuelta usando la etiqueta de devolución prepagada',
    'returnPolicy.exchangePolicy': 'Política de Cambios',
    'returnPolicy.exchangePolicyText': 'Ofrecemos cambios gratuitos para diferentes tallas o colores del mismo artículo. Los cambios están sujetos a disponibilidad y deben solicitarse dentro de los 30 días posteriores a la compra.',
    'returnPolicy.refundProcess': 'Proceso de Reembolso',
    'returnPolicy.refundProcessText': 'Una vez que recibamos tu devolución, procesaremos tu reembolso en un plazo de 5-7 días hábiles. Los reembolsos se emitirán al método de pago original.',
    'returnPolicy.returnShipping': 'Envío de Devolución',
    'returnPolicy.returnShippingText': 'Proporcionamos etiquetas de devolución prepagadas para todas las devoluciones. Los costos de envío de devolución se deducirán de tu reembolso a menos que la devolución se deba a nuestro error.',
    'shippingPolicy.title': 'Política de Envío',
    'shippingPolicy.lastUpdated': 'Última actualización:',
    'shippingPolicy.shippingInfo': 'Información de Envío',
    'shippingPolicy.shippingInfoText': 'Ofrecemos envío rápido y confiable a clientes de todo el mundo. Todos los pedidos se procesan y envían en un plazo de 1-2 días hábiles.',
    'shippingPolicy.shippingMethods': 'Métodos de Envío',
    'shippingPolicy.standardShipping': 'Envío Estándar: 5-7 días hábiles',
    'shippingPolicy.expressShipping': 'Envío Exprés: 2-3 días hábiles',
    'shippingPolicy.overnightShipping': 'Envío Nocturno: 1 día hábil (solo EE. UU.)',
    'shippingPolicy.shippingCosts': 'Costos de Envío',
    'shippingPolicy.shippingCostsText': 'Los costos de envío se calculan en el checkout según tu ubicación y el método de envío seleccionado. El envío gratuito está disponible en pedidos superiores a $75.',
    'shippingPolicy.internationalShipping': 'Envío Internacional',
    'shippingPolicy.internationalShippingText': 'Enviamos a la mayoría de los países del mundo. Los pedidos internacionales pueden estar sujetos a derechos de aduana e impuestos, que son responsabilidad del cliente.',
    'shippingPolicy.orderTracking': 'Seguimiento de Pedidos',
    'shippingPolicy.orderTrackingText': 'Una vez que tu pedido sea enviado, recibirás un número de seguimiento por correo electrónico. Puedes rastrear tu paquete usando este número en el sitio web del transportista.',
    'shippingPolicy.deliveryIssues': 'Problemas de Entrega',
    'shippingPolicy.deliveryIssuesText': 'Si experimentas algún problema con la entrega, por favor contacta a nuestro equipo de servicio al cliente dentro de los 30 días posteriores a la fecha de entrega esperada.',
    'terms.title': 'Términos y Condiciones',
    'terms.lastUpdated': 'Última actualización:',
    'terms.acceptanceOfTerms': '1. Aceptación de Términos',
    'terms.acceptanceOfTermsText': 'Al acceder y usar este sitio web, aceptas y te comprometes a cumplir con los términos y disposiciones de este acuerdo.',
    'terms.useLicense': '2. Licencia de Uso',
    'terms.useLicenseText': 'Se otorga permiso para descargar temporalmente una copia de los materiales en el sitio web de Shaded únicamente para visualización personal y no comercial.',
    'terms.disclaimer': '3. Descargo de Responsabilidad',
    'terms.disclaimerText': 'Los materiales en el sitio web de Shaded se proporcionan "tal cual". Shaded no otorga garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluyendo, sin limitación, garantías implícitas o condiciones de comerciabilidad, idoneidad para un propósito particular, o no infracción de propiedad intelectual u otra violación de derechos.',
    'terms.limitations': '4. Limitaciones',
    'terms.limitationsText': 'En ningún caso Shaded o sus proveedores serán responsables por ningún daño (incluyendo, sin limitación, daños por pérdida de datos o ganancias, o debido a interrupción del negocio) que surja del uso o la imposibilidad de usar los materiales en el sitio web de Shaded, incluso si Shaded o un representante autorizado de Shaded ha sido notificado oralmente o por escrito de la posibilidad de tal daño.',
    'terms.accuracyOfMaterials': '5. Precisión de Materiales',
    'terms.accuracyOfMaterialsText': 'Los materiales que aparecen en el sitio web de Shaded podrían incluir errores técnicos, tipográficos o fotográficos. Shaded no garantiza que ninguno de los materiales en su sitio web sean precisos, completos o actuales.',
    'terms.links': '6. Enlaces',
    'terms.linksText': 'Shaded no ha revisado todos los sitios enlazados a nuestro sitio web y no es responsable del contenido de ningún sitio enlazado. La inclusión de cualquier enlace no implica respaldo por parte de Shaded del sitio.',
    'terms.modifications': '7. Modificaciones',
    'terms.modificationsText': 'Shaded puede revisar estos términos de servicio para su sitio web en cualquier momento sin previo aviso. Al usar este sitio web, aceptas estar sujeto a la versión actual de estos términos de servicio.',
    'terms.governingLaw': '8. Ley Aplicable',
    'terms.governingLawText': 'Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de los Estados Unidos y aceptas irrevocablemente la jurisdicción exclusiva de los tribunales en ese estado o ubicación.',
    'support.title': 'Soporte al Cliente',
    'support.subtitle': 'Estamos aquí para ayudarte con cualquier pregunta o inquietud',
    'support.contactInfo': 'Información de Contacto',
    'support.emailSupport': 'Soporte por Correo Electrónico',
    'support.emailResponse': 'Respuesta en 24-48 horas',
    'support.phoneSupport': 'Soporte Telefónico',
    'support.phoneHours': 'Lun-Vie 9AM-6PM EST',
    'support.liveChat': 'Chat en Vivo',
    'support.liveChatText': 'Disponible en nuestro sitio web',
    'support.faq': 'Preguntas Frecuentes',
    'support.faqTrackOrder': '¿Cómo rastreo mi pedido?',
    'support.faqTrackOrderAnswer': 'Recibirás un número de seguimiento por correo electrónico una vez que tu pedido sea enviado.',
    'support.faqReturnPolicy': '¿Cuál es tu política de devoluciones?',
    'support.faqReturnPolicyAnswer': 'Ofrecemos devoluciones de 30 días en todos los artículos en condición original.',
    'support.faqInternationalShipping': '¿Envían internacionalmente?',
    'support.faqInternationalShippingAnswer': 'Sí, enviamos a la mayoría de los países del mundo.',
    'support.faqChangeOrder': '¿Cómo puedo cambiar mi pedido?',
    'support.faqChangeOrderAnswer': 'Contáctanos inmediatamente si tu pedido aún no ha sido enviado.',
    'support.contactUs': 'Contáctanos',
    'contact.title': 'Formulario de Contacto de Soporte',
    'contact.subtitle': 'Las consultas de clientes se responden en un plazo de 24-48 horas.',
    'contact.contactForm': 'Formulario de contacto',
    'contact.name': 'Nombre',
    'contact.namePlaceholder': 'Ingresa tu nombre completo',
    'contact.email': 'Correo Electrónico *',
    'contact.emailPlaceholder': 'Ingresa tu dirección de correo electrónico',
    'contact.phone': 'Número de Teléfono',
    'contact.phonePlaceholder': 'Ingresa tu número de teléfono',
    'contact.comment': 'Comentario',
    'contact.commentPlaceholder': 'Cuéntanos cómo podemos ayudarte...',
    'contact.sendMessage': 'Enviar Mensaje',
    'contact.successMessage': '¡Gracias por tu mensaje! Te responderemos en un plazo de 24-48 horas.',
    'product.shipping': 'Envío',
    'product.shippingCalculated': 'calculado en el checkout',
    'product.selected': 'Seleccionado',
    'product.color': 'COLOR',
    'product.size': 'TALLA',
    'product.quantity': 'Cantidad',
    'product.addToCart': 'Agregar al Carrito',
    'product.details': 'Detalles del Producto',
    'product.detailsMobile': 'DETALLES DEL PRODUCTO',
    'product.share': 'Compartir',
    'product.descriptionNotAvailable': 'Descripción del producto no disponible.',
    'product.sizePlaceholder': 'Talla',
    'product.colorPlaceholder': 'Color',
    'product.outOfStock': '(Agotado)',
    'product.youMayAlsoLove': 'También te puede gustar',
    'newsletter.bePartOfMovement': 'SÉ PARTE DEL MOVIMIENTO',
    'newsletter.description': 'Sé el primero en conocer actualizaciones de lanzamiento, ideas de estilo y ofertas exclusivas.',
    'newsletter.email': 'Correo Electrónico',
    'newsletter.subscribe': 'Suscribirse',
    'newsletter.subscribing': 'Suscribiendo...',
    'newsletter.success': '¡Gracias por suscribirte!',
    'newsletter.error': 'Ocurrió un error. Por favor, intenta de nuevo.',
    'newsletter.joinCommunity': 'Únete a la Comunidad',
    'newsletter.placeholder': 'Ingresa tu correo electrónico',
    'newsletter.welcome': 'Bienvenido al movimiento',
    'newsletter.tooManyAttempts': 'Demasiados intentos. Por favor intenta más tarde.',
    'orders.title': 'Mis Órdenes',
    'orders.welcome': 'Bienvenido, {name}',
    'orders.history': 'Aquí puedes ver el historial de tus pedidos',
    'orders.empty': 'No tienes órdenes aún',
    'orders.firstPurchase': 'Cuando realices tu primera compra, aparecerá aquí',
    'orders.explore': 'Explorar Productos',
    'orders.orderNumber': 'Orden #{number}',
    'orders.viewStatus': 'Ver estado',
    'orders.quantity': 'Cantidad: {quantity}',
    'order.notFound': 'Orden no encontrada',
    'order.backToOrders': 'Volver a Mis Órdenes',
    'order.confirmedOn': 'Confirmado el {date}',
    'order.status.fulfilled': 'Completado',
    'order.status.partial': 'Parcialmente enviado',
    'order.status.unfulfilled': 'Pendiente',
    'order.status.confirmed': 'Confirmado',
    'order.products': 'Productos ({count})',
    'order.shippingAddress': 'Dirección de Envío',
    'order.summary': 'Resumen',
    'order.subtotal': 'Subtotal',
    'order.shipping': 'Envío',
    'order.tax': 'Impuestos',
    'order.total': 'Total',
    'order.requestReturn': 'Solicitar devolución',
    'order.viewOnShopify': 'Ver en Shopify',
    'order.buyAgain': 'Comprar de nuevo',
    'returns.title': 'Solicitar devolución',
    'returns.orderNumber': 'Orden #{number}',
    'returns.productToReturn': 'Producto a devolver',
    'returns.noProducts': 'No hay productos disponibles para devolver',
    'returns.notEligible': 'Esta orden puede que ya no sea elegible para devoluciones',
    'returns.whyReturn': '¿Por qué lo quieres devolver?',
    'returns.selectReason': 'Seleccionar razón',
    'returns.return': 'Devolución',
    'returns.eligibilityNote': 'La elegibilidad de devolución y reembolso se basará en nuestra política de devoluciones.',
    'returns.submit': 'Solicitar devolución',
    'returns.processing': 'Procesando...',
    'returns.cancel': 'Cancelar',
    'returns.successTitle': '¡Solicitud enviada!',
    'returns.successMessage': 'Tu solicitud de devolución ha sido enviada. Te contactaremos pronto con los siguientes pasos.',
    'returns.errorReason': 'Por favor selecciona una razón para la devolución',
    'returns.errorSubmit': 'Error al procesar la solicitud de devolución',
    'verify.title': 'Ingresa el código',
    'verify.sentTo': 'Enviado a {email}',
    'verify.codeLabel': 'Código de 6 dígitos',
    'verify.submit': 'Verificar código',
    'verify.verifying': 'Verificando...',
    'verify.resendQuestion': '¿No recibiste el código?',
    'verify.resendAction': 'Reenviar código',
    'verify.signInOther': 'Iniciar sesión con otro email',
    'verify.privacy': 'Política de privacidad',
    'verify.terms': 'Términos de servicio',
    'verify.errorComplete': 'Por favor ingresa el código completo de 6 dígitos',
    'verify.errorSession': 'Información de sesión faltante. Por favor intenta el login nuevamente.',
    'verify.resendSuccess': 'Código reenviado a tu email',
    'auth.welcomeBack': 'Bienvenido de nuevo',
    'auth.loginSubtitle': 'Inicia sesión en tu cuenta',
    'auth.emailPlaceholder': 'Ingresa tu email',
    'auth.codeSent': 'Recibirás un código de verificación en tu correo electrónico',
    'auth.loginButton': 'Entrar',
    'auth.loggingIn': 'Entrando...',
    'auth.backToHome': 'Volver al inicio',
    'auth.createAccount': 'CREAR CUENTA',
    'auth.joinCommunity': 'Únete a la comunidad Shaded',
    'auth.firstName': 'Nombre',
    'auth.lastName': 'Apellido',
    'auth.createPassword': 'Crear contraseña',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
    'auth.registrationDisabled': 'Registro Deshabilitado',
    'auth.registrationTempDisabled': 'El registro está temporalmente deshabilitado',
    'userMenu.myOrders': 'Mis Órdenes',
    'userMenu.logout': 'Cerrar Sesión',

  }
};


function getLanguageFromCookie(): Language {
  if (typeof document === 'undefined') {
    return 'en';
  }


  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('locale='))
    ?.split('=')[1];

  if (cookieValue === 'en' || cookieValue === 'es') {
    return cookieValue;
  }


  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      return savedLanguage;
    }
  }

  return 'en';
}

export function LanguageProvider({
  children,
  initialLanguage
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {

  const [language, setLanguageState] = useState<Language>(() => {

    if (initialLanguage && (initialLanguage === 'en' || initialLanguage === 'es')) {
      return initialLanguage;
    }


    if (typeof window !== 'undefined') {
      return getLanguageFromCookie();
    }

    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {

      localStorage.setItem('language', lang);

      document.cookie = `locale=${lang}; path=/; max-age=31536000; SameSite=Lax`;


      document.documentElement.lang = lang;
    }
  };


  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] || key;


    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

