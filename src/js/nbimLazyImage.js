// Import IO with polyfill
import IntersectionObserver from 'intersection-observer-polyfill';

/**
 * @author Tatsumi Suzuki
 * @param {string} lazyClass Add classname to all images you wish to lazy load.
 * @param {string} animatedClass Add optional classname if you wish to animate on lazy load.
 * @description The img sollution: You need to change img src to a pixel image for loading.
 * Add your desired image to data-lazy attribute and don't forget the lazyClass.
 * The background-image sollution: Add lazyClass and add your image to data-lazy attribute.
 * For animations, use animatedClass attribute with the css classname you wish to use.
 */
export default function nbimLazyImg(lazyClass, animatedClass = null) {
    const lazyImages = document.getElementsByClassName(lazyClass);

    const switchImage = (image, animation = false) => {
        const imageUrl = typeof image.target !== 'undefined' ? image.target.getAttribute('data-lazy') : image.getAttribute('data-lazy');
        if (typeof imageUrl !== 'undefined') {
            const target = typeof image.target !== 'undefined' ? image.target : image;
            // Change src loading pixel to real image.
            if (target.hasAttribute('src')) {
                target.src = imageUrl;
                // Inject image as background
            } else {
                target.style.backgroundImage = `url(${imageUrl})`;
            }
            // If animation is needed. Pass it here.
            // But we will only animate when user is a bit below 1st fold.
            if (animation && animatedClass && window.scrollY >= window.innerHeight) {
                target.classList.add(animatedClass);
            } else if (animatedClass && window.scrollY <= window.innerHeight) {
                target.classList.add('no-animation');
            } else {
                target.classList.add('no-animation');
            }
        }
    };

    const imageObserver = new IntersectionObserver((images) => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < images.length; i++) {
            if (images[i].isIntersecting) {
                switchImage(images[i], true);
            }
        }
    });

    // Lazyload images after current fold.
    if (window.scrollY >= window.innerHeight) {
        for (const image of lazyImages) {
            if ((image.getBoundingClientRect().top + window.scrollY) <= window.scrollY) {
                // Before fold. Switch image
                switchImage(image);
            } else {
                // After fold. Observe image
                imageObserver.observe(image);
            }
        }
    } else if (lazyImages.length > 0) {
        for (const images of lazyImages) {
            // Do not lazy load on EPI.
            // It will break in preview iframe because window is not scrolled.
            if ('IntersectionObserver' in window && window.location.href.match('/episerver/cms') === null) {
                imageObserver.observe(images);
            } else {
                switchImage(images);
            }
        }
    }
}
