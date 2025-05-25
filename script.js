class Carousel {
    constructor(container) {
        this.carousel = document.querySelector(container);
        this.slides = Array.from(this.carousel.querySelectorAll('.slide'));
        this.indicators = this.carousel.querySelector('.indicators');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.indicators.appendChild(dot);
        });

        this.carousel.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        this.carousel.querySelector('.next').addEventListener('click', () => this.nextSlide());
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

        this.updateSlide();
        this.startAutoPlay();
    }

    updateSlide() {
        this.slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            slide.classList.toggle('active', index === this.currentIndex);

            if (video) {
                video[index === this.currentIndex ? 'play' : 'pause']();
                if (index !== this.currentIndex) video.currentTime = 0;
            }
        });

        Array.from(this.indicators.children).forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlide();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlide();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    pauseAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Carousel('.carousel');
});

document.addEventListener('DOMContentLoaded', function () {
    const homeBtn = document.querySelector('a[href="#home-section"]');
    const introductionBtn = document.querySelector('a[href="#introduction-section"]');
    const aboutBtn = document.querySelector('a[href="#form-section"]');
    const configBtn = document.querySelector('a[href="#crosshair-list"]');

    const homeSection = document.getElementById('home-section');
    const carouselSection = document.getElementById('carousel-section');
    const introductionSection = document.getElementById('introduction-section');
    const formSection = document.getElementById('form-section');
    const searchBar = document.getElementById('search-bar');
    const crosshairList = document.getElementById('crosshair-list');

    function showHome() {
        homeSection.classList.remove('hide');
        carouselSection.classList.remove('hide');
        formSection.classList.add('hide');
        searchBar.classList.add('hide');
        crosshairList.classList.add('hide');
        introductionSection.classList.add('hide');
    }
    function showIntroduction() {
        homeSection.classList.add('hide');
        carouselSection.classList.add('hide');
        formSection.classList.add('hide');
        searchBar.classList.add('hide');
        crosshairList.classList.add('hide');
        introductionSection.classList.remove('hide');
    }
    function showAbout() {
        homeSection.classList.add('hide');
        carouselSection.classList.add('hide');
        formSection.classList.remove('hide');
        searchBar.classList.add('hide');
        crosshairList.classList.add('hide');
        introductionSection.classList.add('hide');
    }

    function showConfig() {
        homeSection.classList.add('hide');
        carouselSection.classList.add('hide');
        formSection.classList.add('hide');
        searchBar.classList.remove('hide');
        crosshairList.classList.remove('hide');
        introductionSection.classList.add('hide');
    }

    homeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showHome();
    });

    introductionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showIntroduction();
    });

    aboutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showAbout();
    });

    configBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showConfig();
    });

    showHome();
});

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('list-container');

    fetch('index.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <img src="${item.src}" alt="${item.name} 准星">
                    <div class="card-content">
                        <h3>${item.name}</h3>
                        <p>Team：${item.team}</p>
                        <p>Crosshair Code：<code>${item.准星}</code></p>
                    </div>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Unable to load JSON data:', error);
            container.innerHTML = '<p>Loading crosshair data failed.</p>';
        });
});

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    let cardData = [];

    fetch('index.json')
        .then(response => response.json())
        .then(data => {
            cardData = data;
            // 初始渲染
            renderCards(data);
        });


    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filtered = cardData.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.team.toLowerCase().includes(searchTerm)
        );
        renderCards(filtered);
    }


    function renderCards(data) {
        const container = document.getElementById('list-container');
        container.innerHTML = '';
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';

            card.addEventListener('click', () => {
                navigator.clipboard.writeText(item.准星)
                    .then(() => {
                        const toast = document.createElement('div');
                        toast.className = 'copy-toast';
                        toast.textContent = `✅ Replicated ${item.name} crosshair code`;
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 3000);
                    })
                    .catch(err => {
                        console.error('copy failed:', err);
                        alert('Copy failed, please manually select the code');
                    });
            });

            card.style.cursor = 'pointer';
            card.innerHTML = `                <img src="${item.src}" alt="${item.name} 准星">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>Team：${item.team}</p>
                    <p>Crosshair Code：<code>${item.准星}</code></p>
                </div>
            `;
            container.appendChild(card);
        });
        if(data.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'empty-state';
            empty.textContent = 'No matching crosshair configuration found';
            container.appendChild(empty);
        }
    }

    searchInput.addEventListener('input', performSearch);
});
