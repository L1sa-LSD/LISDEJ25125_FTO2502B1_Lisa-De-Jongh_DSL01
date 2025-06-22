
// modal.js
import { podcasts, genres, seasons } from './data.js';

// modal.js

/**
 * @class ModalUI
 * Manages the functionality of the podcast details modal.
 * This includes creating its content, showing, hiding, and handling close events.
 */
export class ModalUI {
    /**
     * @param {string} overlaySelector - The CSS selector for the modal overlay element.
     * @param {string} contentSelector - The CSS selector for the modal content element.
     */
    constructor(overlaySelector, contentSelector) {
        this.modalOverlay = document.getElementById(overlaySelector);
        this.modalContent = document.getElementById(contentSelector);

        // Bind 'this' context for event handlers to ensure they refer to the class instance.
        this.hide = this.hide.bind(this);

        this._addCoreEventListeners();
    }

    /**
     * Creates the HTML content for the modal.
     * @private
     * @param {object} podcast - The podcast data object.
     * @param {object} genreMap - A map of genre IDs to titles.
     * @param {object} seasonsMap - A map of podcast IDs to their season details.
     * @returns {string} The complete HTML string for the modal's inner content.
     */
    _createModalContentHTML(podcast, genreMap, seasonsMap) {
        const podcastSeasons = seasonsMap[podcast.id] || [];

        const updatedDate = new Date(podcast.updated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const genreTagsHTML = podcast.genres.map(genreId => {
            const genreTitle = genreMap[genreId] || 'Unknown';
            return `<span class="genre-tag">${genreTitle}</span>`;
        }).join('');

        const seasonsListHTML = podcastSeasons.length > 0
            ? podcastSeasons.map(season => `
                <div class="season-item">
                    <div class="season-title">${season.title}</div>
                    <div class="season-episodes">${season.episodes} episodes</div>
                </div>
            `).join('')
            : '<p>No season information available.</p>';

        return `
            <button id="modal-close-btn" class="modal-close">×</button>
            <div class="modal-header">
                <div class="modal-cover" style="background-image: url('${podcast.image}');"></div>
                <div class="modal-details">
                    <h2>${podcast.title}</h2>
                    <p class="description">${podcast.description}</p>
                    <h3>Genres</h3>
                    <div class="modal-genres">${genreTagsHTML}</div>
                    <p class="modal-updated">Last updated: ${updatedDate}</p>
                </div>
            </div>
            <div class="seasons-body">
                <h2>Seasons</h2>
                <div class="seasons-list">${seasonsListHTML}</div>
            </div>
        `;
    }

    /**
     * Displays the modal with the details of a specific podcast.
     * @param {object} podcast - The podcast object to display.
     * @param {object} genreMap - A map of genre IDs to titles.
     * @param {object} seasonsMap - A map of podcast IDs to season details.
     */
    show(podcast, genreMap, seasonsMap) {
        this.modalContent.innerHTML = this._createModalContentHTML(podcast, genreMap, seasonsMap);
        this.modalOverlay.classList.add('show');

        // Add event listener for the newly created close button
        document.getElementById('modal-close-btn').addEventListener('click', this.hide);
    }

    /**
     * Hides the modal and clears its content.
     */
    hide() {
        this.modalOverlay.classList.remove('show');
        // Clear content to free up memory and prevent content flash on next open.
        this.modalContent.innerHTML = '';
    }

    /**
     * Adds core event listeners for closing the modal (overlay click and Escape key).
     * These listeners are persistent and are set up once during instantiation.
     * @private
     */
    _addCoreEventListeners() {
        // Close the modal if the overlay background is clicked
        this.modalOverlay.addEventListener('click', (event) => {
            if (event.target === this.modalOverlay) {
                this.hide();
            }
        });

        // Close the modal with the Escape key
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.modalOverlay.classList.contains('show')) {
                this.hide();
            }
        });
    }
}