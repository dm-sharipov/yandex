import Slider from "./slider.js";

new Slider({
    sliderId: "stages-slider",
    prevButtonId: "stages-prev",
    nextButtonId: "stages-next",
    paginationId: "stages-pagination",
    responsive: {
        0: {
            visibleSlides: 1
        },
        768: {
            visibleSlides: 2
        },
        992: {
            visibleSlides: 0
        }
    }
});

new Slider({
    sliderId: "participants-slider",
    prevButtonId: "participants-prev",
    nextButtonId: "participants-next",
    counterId: "participants-counter",
    autoScroll: 4000,
    loop: true,
    responsive: {
        0: {
            visibleSlides: 1
        },
        768: {
            visibleSlides: 2,
            slidesGap: 12
        },
        992: {
            visibleSlides: 3,
            slidesGap: 20
        }
    }
});
