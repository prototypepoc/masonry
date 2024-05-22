// app.js

document.addEventListener('DOMContentLoaded', () => {
    const masonryContainer = document.getElementById('masonry-container');
    const loading = document.getElementById('loading');
    let page = 1;
    const photosPerPage = 15;
    let isLoading = false;

    const getRandomPhotos = async () => {
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${photosPerPage}`);
        const photos = await response.json();
        return photos;
    };

    const renderPhotos = (photos) => {
        photos.forEach(photo => {
            const item = document.createElement('div');
            item.classList.add('masonry-item');
            item.innerHTML = `<img src="https://picsum.photos/id/${photo.id}/300/${getRandomHeight()}" alt="${photo.author}">`;
            masonryContainer.appendChild(item);
        });
    };

    const getRandomHeight = () => {
        const heights = [300, 350, 400, 450, 500, 550, 600];
        return heights[Math.floor(Math.random() * heights.length)];
    };

    const loadPhotos = async () => {
        if (isLoading) return;
        isLoading = true;
        showLoading();
        const photos = await getRandomPhotos();
        renderPhotos(photos);
        page++;
        isLoading = false;
        hideLoading();
        logAction('Loaded new photos');
    };

    const showLoading = () => {
        loading.style.display = 'block';
    };

    const hideLoading = () => {
        loading.style.display = 'none';
    };

    const logAction = (action) => {
        const actions = JSON.parse(localStorage.getItem('actions')) || [];
        actions.push({ action, timestamp: new Date().toISOString() });
        localStorage.setItem('actions', JSON.stringify(actions));
    };

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            loadPhotos();
        }
    });

    window.addEventListener('touchstart', (e) => {
        this.touchStartY = e.touches[0].pageY;
    });

    window.addEventListener('touchmove', (e) => {
        const touchEndY = e.touches[0].pageY;
        if (this.touchStartY - touchEndY > 100) {
            showLoading();
            setTimeout(() => {
                hideLoading();
                logAction('Pull to refresh');
                loadPhotos();
            }, 1500);
        }
    });

    loadPhotos();
});
