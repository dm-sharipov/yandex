export default class Slider {
    constructor(config) {
        this.config = config;

        const { sliderId, prevButtonId, nextButtonId, counterId, paginationId } = this.config;

        this.slider = document.getElementById(sliderId);

        this.nodes = {
            container: this.slider.querySelector(".js-slider__container"),
            slides: this.slider.querySelectorAll(".js-slider__item"),
            prevButton: document.getElementById(prevButtonId),
            nextButton: document.getElementById(nextButtonId),
            counter: document.getElementById(counterId),
            pagination: document.getElementById(paginationId)
        };

        this.classNames = {
            slider: "slider",
            container: "slider__container",
            slide: "slider__item"
        };

        this.addListeners();
        this.init();
    }

    addListeners() {
        this.nodes.prevButton.addEventListener("click", this.prev.bind(this));
        this.nodes.nextButton.addEventListener("click", this.next.bind(this));

        window.addEventListener("resize", this.init.bind(this));
    }

    init() {
        this.setConfig();

        if (this.visibleSlides > 0) {
            this.setStyles();
            this.setState();
        } else {
            this.destroy();
        }
    }

    destroy() {
        this.slider.classList.remove(this.classNames.slider);

        this.nodes.container.classList.remove(this.classNames.container);
        this.nodes.container.removeAttribute("style");

        this.nodes.slides.forEach(slide => {
            slide.classList.remove(this.classNames.slide);
            slide.removeAttribute("style");
        });

        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }
    }

    setConfig() {
        const { responsive } = this.config;

        if (responsive) {
            const viewportWidth = window.innerWidth;

            Object.keys(responsive).forEach(breakpoint => {
                if (Number(breakpoint) <= viewportWidth) {
                    this.config = { ...this.config, ...responsive[breakpoint] };
                }
            });
        }

        this.totalSlides = this.nodes.slides?.length;
        this.visibleSlides = this.config.visibleSlides || 0;
        this.slidesGap = this.config.slidesGap || 0;
        this.autoScroll = this.config.autoScroll || 0;
        this.loop = this.config.loop || false;

        this.currentIndex = this.visibleSlides;
    }

    setStyles() {
        this.sliderWidth = this.slider.offsetWidth;
        this.slideWidth = (this.sliderWidth - this.slidesGap * (this.visibleSlides - 1)) / this.visibleSlides;

        this.slider.classList.add(this.classNames.slider);
        this.nodes.container.classList.add(this.classNames.container);

        this.nodes.slides.forEach((slide, index) => {
            slide.classList.add(this.classNames.slide);

            slide.style.width = this.slideWidth + "px";

            if (this.visibleSlides > 1 && index !== this.totalSlides - 1) {
                slide.style.marginInlineEnd = this.slidesGap + "px";
            }
        });
    }

    setState() {
        const offset = this.currentIndex - this.visibleSlides;

        this.nodes.container.style.transform = `translateX(-${offset * (this.slideWidth + this.slidesGap)}px)`;

        if (this.nodes.counter) {
            this.nodes.counter.innerHTML = `<b>${this.currentIndex}</b> / ${this.totalSlides}`;
        }

        if (this.nodes.pagination) {
            const pagesCount = this.totalSlides - this.visibleSlides + 1;

            let paginationHTML = "";

            if (pagesCount > 1) {
                for (let i = 0; i < pagesCount; i++) {
                    paginationHTML += `<span${
                        this.currentIndex - this.visibleSlides === i ? " data-current" : ""
                    }></span>`;
                }
            }

            this.nodes.pagination.innerHTML = paginationHTML;
        }

        if (!this.loop) {
            if (this.currentIndex === this.totalSlides) {
                this.nodes.nextButton.setAttribute("disabled", "");
            } else {
                this.nodes.nextButton.removeAttribute("disabled");
            }

            if (this.currentIndex === this.visibleSlides) {
                this.nodes.prevButton.setAttribute("disabled", "");
            } else {
                this.nodes.prevButton.removeAttribute("disabled");
            }
        }

        if (this.autoScroll > 0) {
            this.setAutoScroll();
        }
    }

    setAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }

        if (this.autoScroll) {
            this.autoScrollInterval = setInterval(() => {
                this.next();
            }, this.autoScroll);
        }
    }

    prev() {
        if (this.currentIndex > this.visibleSlides) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.totalSlides;
        }

        this.setState();
    }

    next() {
        if (this.currentIndex < this.totalSlides) {
            this.currentIndex++;
        } else {
            this.currentIndex = this.visibleSlides;
        }

        this.setState();
    }
}
