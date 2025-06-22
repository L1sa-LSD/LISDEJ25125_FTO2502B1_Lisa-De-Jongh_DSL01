
// initial.js

// STEP 1: Add this import line at the top
import { podcasts, genres } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    // The rest of your code remains the same!
    const podcastGrid = document.getElementById('podcastGrid');
    const genreDropdown = document.querySelector('#genre-dropdown .select-dropdown');

    const genreMap = genres.reduce((map, genre) => {
        map[genre.id] = genre.title;
        return map;
    }, {});

    function createPodcastCard(podcast) {
        const card = document.createElement('div');
        card.className = 'podcast-card';

        const updatedDate = new Date(podcast.updated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const genreTags = podcast.genres.map(genreId => {
            const genreTitle = genreMap[genreId] || 'Unknown Genre';
            return `<span class="genre-tag">${genreTitle}</span>`;
        }).join('');

        card.innerHTML = `
            <div class="podcast-cover" style="background-image: url('${podcast.image}');"></div>
            <h3 class="podcast-title">${podcast.title}</h3>
            <p class="podcast-seasons">Seasons: ${podcast.seasons}</p>
            <div class="podcast-genres">${genreTags}</div>
            <p class="podcast-updated">Updated: ${updatedDate}</p>
        `;

        return card;
    }

    function displayPodcasts() {
        podcastGrid.innerHTML = '';

        podcasts.forEach(podcast => {
            const podcastCardElement = createPodcastCard(podcast);
            podcastGrid.appendChild(podcastCardElement);
        });
    }
    
    function populateGenreFilter() {
        genreDropdown.innerHTML = '<option value="all">All Genres</option>';
        
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.title;
            genreDropdown.appendChild(option);
        });
    }

    populateGenreFilter();
    displayPodcasts();
});