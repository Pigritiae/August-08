document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const audio = document.getElementById('audio-element');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const prevButton = document.getElementById('prev-button');
    const playPauseButton = document.getElementById('play-pause-button');
    const nextButton = document.getElementById('next-button');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationTimeSpan = document.getElementById('duration-time');
    const volumeBar = document.getElementById('volume-bar');
    const fileInput = document.getElementById('file-input');
    const addSongsButton = document.getElementById('add-songs-button');
    const playlistUl = document.getElementById('playlist');

    // --- Player State Variables ---
    let playlist = []; // Array to store song objects: { name: string, file: File, url: string }
    let currentSongIndex = -1; // Index of the currently playing song in the playlist
    let isPlaying = false; // Flag to track if audio is playing

    // --- Helper Functions ---

    /**
     * Formats time from seconds to MM:SS string.
     * @param {number} seconds - The time in seconds.
     * @returns {string} Formatted time string.
     */
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    /**
     * Loads a song into the audio element and updates UI.
     * @param {number} index - The index of the song in the playlist.
     */
    function loadSong(index) {
        if (playlist.length === 0) {
            songTitle.textContent = 'Nenhuma música carregada';
            songArtist.textContent = 'Carregue suas músicas para começar!';
            audio.src = '';
            progressBar.value = 0;
            currentTimeSpan.textContent = '00:00';
            durationTimeSpan.textContent = '00:00';
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            return;
        }

        if (index < 0) {
            currentSongIndex = playlist.length - 1; // Loop to last song
        } else if (index >= playlist.length) {
            currentSongIndex = 0; // Loop to first song
        } else {
            currentSongIndex = index;
        }

        const song = playlist[currentSongIndex];
        audio.src = song.url;
        songTitle.textContent = song.name;
        // Try to extract artist from file name, otherwise default
        songArtist.textContent = song.file.name.includes('-') ? song.file.name.split('-')[0].trim() : 'Artista Desconhecido';

        // Update active class in playlist
        updatePlaylistActiveClass();

        // If it was playing, continue playing the new song
        if (isPlaying) {
            audio.play();
        } else {
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    /**
     * Plays the current song.
     */
    function playSong() {
        if (playlist.length === 0) {
            alert('Por favor, adicione músicas à lista de reprodução primeiro!');
            return;
        }
        if (audio.src === '' && currentSongIndex === -1) {
            loadSong(0); // Load the first song if nothing is loaded
        }
        audio.play();
        isPlaying = true;
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    }

    /**
     * Pauses the current song.
     */
    function pauseSong() {
        audio.pause();
        isPlaying = false;
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    }

    /**
     * Toggles play/pause state.
     */
    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    /**
     * Plays the next song in the playlist.
     */
    function nextSong() {
        if (playlist.length === 0) return;
        loadSong(currentSongIndex + 1);
        playSong();
    }

    /**
     * Plays the previous song in the playlist.
     */
    function prevSong() {
        if (playlist.length === 0) return;
        loadSong(currentSongIndex - 1);
        playSong();
    }

    /**
     * Renders the playlist in the UI.
     */
    function renderPlaylist() {
        playlistUl.innerHTML = ''; // Clear existing list
        if (playlist.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('empty-playlist-message');
            emptyMessage.textContent = 'Nenhuma música na lista. Clique em "Adicionar Músicas" para começar.';
            playlistUl.appendChild(emptyMessage);
            return;
        }

        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = song.name;
            li.dataset.index = index; // Store index for easy access
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => {
                loadSong(index);
                playSong();
            });
            playlistUl.appendChild(li);
        });
    }

    /**
     * Updates the active class in the playlist UI.
     */
    function updatePlaylistActiveClass() {
        document.querySelectorAll('#playlist li').forEach(li => {
            li.classList.remove('active');
        });
        if (currentSongIndex !== -1 && playlist[currentSongIndex]) {
            const activeLi = playlistUl.querySelector(`li[data-index="${currentSongIndex}"]`);
            if (activeLi) {
                activeLi.classList.add('active');
                // Scroll to active song if it's out of view
                activeLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    // --- Event Listeners ---

    // Play/Pause Button
    playPauseButton.addEventListener('click', togglePlayPause);

    // Next Button
    nextButton.addEventListener('click', nextSong);

    // Previous Button
    prevButton.addEventListener('click', prevSong);

    // Audio Time Update (for progress bar and time display)
    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;

        currentTimeSpan.textContent = formatTime(currentTime);
        
        if (!isNaN(duration)) { // Check if duration is a valid number
            durationTimeSpan.textContent = formatTime(duration);
            progressBar.value = (currentTime / duration) * 100;
        } else {
            durationTimeSpan.textContent = '00:00';
            progressBar.value = 0;
        }
    });

    // Audio Loaded Metadata (when song info is available)
    audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        if (!isNaN(duration)) {
            durationTimeSpan.textContent = formatTime(duration);
            progressBar.max = 100; // Reset max for progress bar
        }
    });

    // Audio Ended (play next song automatically)
    audio.addEventListener('ended', () => {
        nextSong();
    });

    // Progress Bar Interaction
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    // Volume Control
    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value / 100;
    });

    // Initialize volume to 100%
    audio.volume = 1;

    // Add Songs Button (triggers hidden file input)
    addSongsButton.addEventListener('click', () => {
        fileInput.click(); // Programmatically click the hidden file input
    });

    // File Input Change (when user selects files)
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        // Clear previous playlist if new files are added
        playlist = []; 
        currentSongIndex = -1; // Reset current song index

        Array.from(files).forEach(file => {
            // Check if file is an audio type
            if (file.type.startsWith('audio/')) {
                const url = URL.createObjectURL(file); // Create a URL for the file
                playlist.push({
                    name: file.name.replace(/\.(mp3|wav|ogg)$/i, '').trim(), // Clean up file name
                    file: file,
                    url: url
                });
            } else {
                alert(`Arquivo "${file.name}" não é um tipo de áudio suportado e será ignorado.`);
            }
        });

        renderPlaylist(); // Re-render the playlist with new songs

        // Load and play the first song if it's the first time loading
        if (playlist.length > 0 && !isPlaying) {
            loadSong(0);
        }
    });

    // --- Initialization ---
    renderPlaylist(); // Render empty playlist message initially
    loadSong(-1); // Initialize UI with no song loaded
});
