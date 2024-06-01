import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './slider.module.scss';
import Image from '@components/image/image';

export class Slider extends View {
  navigation: HTMLElement;

  prevBtn: HTMLElement;

  nextBtn: HTMLElement;

  slidesBlock: HTMLElement;

  pagination: HTMLElement;

  slides: Image[];

  slideCount: number;

  slideIndex: number;

  constructor(images: string[]) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [styles.slider],
    };
    super(params);

    this.prevBtn = new ElementCreator({
      tag: 'div',
      classNames: [styles.prevBtn],
      textContent: '<',
      callback: [{ event: 'click', callback: this.prevSlide.bind(this) }],
    }).getElement();

    this.nextBtn = new ElementCreator({
      tag: 'div',
      classNames: [styles.nextBtn],
      textContent: '>',
      callback: [{ event: 'click', callback: this.nextSlide.bind(this) }],
    }).getElement();

    this.navigation = new ElementCreator({
      tag: 'div',
      classNames: [styles.navigation],
      children: [this.prevBtn, this.nextBtn],
    }).getElement();

    this.slidesBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.slidesBlock],
    }).getElement();

    this.pagination = new ElementCreator({
      tag: 'div',
      classNames: [styles.pagination],
    }).getElement();

    this.slides = [];
    this.slideCount = images.length;
    this.slideIndex = 0;

    this.configureView(images);
  }

  public prevSlide() {
    this.slideIndex = (this.slideIndex - 1 + this.slideCount) % this.slideCount;
    this.updateSlider();
  }

  public nextSlide() {
    this.slideIndex = (this.slideIndex + 1) % this.slideCount;
    this.updateSlider();
  }

  public updateSlider() {
    this.slides.forEach((slide, index) => {
      if (index === this.slideIndex) {
        slide.getElement().style.display = 'block';
      } else {
        slide.getElement().style.display = 'none';
      }
    });
    Array.from(this.pagination.children).forEach((dot, index) => {
      if (index === this.slideIndex) {
        dot.classList.add(styles.active);
      } else {
        dot.classList.remove(styles.active);
      }
    });
  }

  private configureView(images: string[]): void {
    const slider: HTMLElement = this.getElement();

    images.map((img: string) => {
      const elem = new Image({ classNames: [styles.img], img });
      const dot = new ElementCreator({ tag: 'span', classNames: [styles.dot] });
      this.slides.push(elem);
      this.slidesBlock.append(elem.getElement());
      this.pagination.append(dot.getElement());
    });

    document.addEventListener('keydown', (event) => {
      if (event.code == 'ArrowRight') {
        this.nextSlide();
      } else if (event.code == 'ArrowLeft') {
        this.prevSlide();
      }
    });

    let startX = 0;
    let endX = 0;
    const slideWidth = slider.clientWidth;

    document.addEventListener('touchstart', (event) => {
      startX = event.touches[0].clientX;
    });
    document.addEventListener('touchend', (event) => {
      endX = event.changedTouches[0].clientX;

      if (endX - startX > slideWidth / 2) {
        this.prevSlide();
      }

      if (startX - endX > slideWidth / 2) {
        this.nextSlide();
      }
    });

    slider.append(this.navigation, this.slidesBlock, this.pagination);
  }
}
