/**
 * Función de animación personalizada para next-view-transitions
 * Crea una transición donde la página antigua se desvanece y sube,
 * mientras que la nueva página aparece desde abajo con un efecto clip-path
 */
export function slideInOut() {
  // Anima la página antigua (que sale)
  document.documentElement.animate(
    [
      {
        opacity: 1,
        transform: 'translateY(0)',
      },
      {
        opacity: 0.9,
        transform: 'translateY(-35%)',
      },
    ],
    {
      duration: 1200,
      easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    }
  );

  // Anima la página nueva (que entra)
  document.documentElement.animate(
    [
      {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      },
      {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
      },
    ],
    {
      duration: 1200,
      easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    }
  );
}

