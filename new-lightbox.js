(function() {
  "use strict";

  /** Represents the Lightbox component to display images. */
  class ImageLightbox {
    /** @param {HTMLImageElement[]} images */
    constructor(images) {
      /** @type {Record<string, HTMLElement>} */
      this.elems = {
        trigger: images[0],
        images: [],
      };

      /** The index of the currently shown image */
      this.currentSlide = 0;

      // Clone images to be displayed in the lightbox
      for (const image of images) {
        this.elems.images.push(image.cloneNode());
      }

      // Setup the lightbox
      this.createElements();
      this.bindEvents();
    }

    createElements() {
      // Wrapper
      const wrapper = document.createElement('div');
      wrapper.classList.add('lightbox-wrapper');
      document.body.appendChild(wrapper);
      
      // Add images to wrapper
      for (const image of this.elems.images) {
        image.className = '';
        wrapper.appendChild(image);
      }

      // Close button
      const close = document.createElement('button');
      close.classList.add('lightbox-close');
      wrapper.appendChild(close);

      // Arrows
      const prevArrow = document.createElement('button');
      prevArrow.appendChild(document.createElement('span'));
      const nextArrow = document.createElement('button');
      nextArrow.appendChild(document.createElement('span'));
      prevArrow.classList.add('lightbox-arrow', 'lightbox-arrow--previous');
      nextArrow.classList.add('lightbox-arrow', 'lightbox-arrow--next');
      wrapper.appendChild(prevArrow);
      wrapper.appendChild(nextArrow);

      Object.assign(this.elems, {
        wrapper,
        close,
        prevArrow,
        nextArrow
      });
    }

    bindEvents() {
      // Open by clicking on the original image
      this.elems.trigger.addEventListener('click', () => this.open());

      // Close by clicking the close button
      this.elems.close.addEventListener('click', () => this.close());

      // Close by clicking the backdrop
      this.elems.wrapper.addEventListener('click', (ev) => {
        if (ev.target === this.elems.wrapper) this.close();
      });

      // Previous image by clicking the previous arrow
      this.elems.prevArrow.addEventListener('click', () => this.previous());

      // Next image by clicking the next arrow
      this.elems.nextArrow.addEventListener('click', () => this.next());

      // Handle keyboard keys
      document.body.addEventListener('keyup', (ev) => {
        if (this.isOpen()) {
          switch (ev.code) {
            case 'Escape': this.close(); break;
            case 'ArrowLeft': this.previous(); break;
            case 'ArrowRight': this.next(); break;
          }
        }
      });
    }

    isOpen() {
      return this.elems.wrapper.classList.contains('shown');
    }

    open() {
      this.elems.wrapper.classList.add('shown');
      this.elems.images[0].classList.add('from-left');
      document.scrollingElement.style.overflowY = 'hidden';

      // Wait a bit, then show the first image
      setTimeout(() => {
        this.elems.images[0].classList.remove('from-left');
        this.elems.images[0].classList.add('shown');
      }, 300);
    }

    close() {
      this.elems.wrapper.classList.remove('shown');
      document.scrollingElement.style.overflowY = '';
      this.currentSlide = 0;
      
      // Remove all classes from images
      for (const image of this.elems.images) {
        image.className = '';
      }
    }

    previous() {
      const current = this.elems.images[this.currentSlide];
      this.currentSlide = this.currentSlide === 0 ? this.elems.images.length - 1 : this.currentSlide -1;
      const target = this.elems.images[this.currentSlide];

      current.classList.remove('shown');
      current.classList.add('to-right');
      target.classList.add('from-left');

      requestAnimationFrame(() => {
        target.classList.remove('from-left');
        target.classList.add('shown');
      });

      setTimeout(() => {
        current.classList.remove('to-right');
      }, 300);
    }

    next() {
      const current = this.elems.images[this.currentSlide];
      this.currentSlide = (this.currentSlide + 1) % this.elems.images.length;
      const target = this.elems.images[this.currentSlide];

      current.classList.remove('shown');
      current.classList.add('to-left');
      target.classList.add('from-right');

      requestAnimationFrame(() => {
        target.classList.remove('from-right')
        target.classList.add('shown');
      });

      setTimeout(() => {
        current.classList.remove('to-left');
      }, 300);
    }
  }

  const images = document.querySelectorAll('img.mklbItem');
  const solo = [];
  const gallery = {};

  // Find images and categories them
  for (const image of images) {
    if (!image.dataset.gallery) {
      solo.push(image);
    } else {
      const galleryName = image.dataset.gallery;
      if (!(galleryName in gallery)) gallery[galleryName] = [];
      gallery[galleryName].push(image);
    }
  }

  // For solo images, create lightbox with just one image
  for (const image of solo) new ImageLightbox([image]);

  // For gallery images, create lightbox with all image of the same gallery
  for (const images of Object.values(gallery))
    new ImageLightbox(images);
}());
