// Audio Icon and Social Links Updates
document.addEventListener('DOMContentLoaded', function() {
    // Replace audio control icon with equalizer
    const audioControl = document.querySelector('.audio-control');
    if (audioControl) {
        // Clear existing content
        audioControl.innerHTML = '';
        
        // Create equalizer icon
        const equalizerIcon = document.createElement('div');
        equalizerIcon.className = 'equalizer-icon equalizer-muted';
        
        // Create equalizer bars
        for (let i = 1; i <= 4; i++) {
            const bar = document.createElement('div');
            bar.className = `equalizer-bar equalizer-bar-${i}`;
            equalizerIcon.appendChild(bar);
        }
        
        audioControl.appendChild(equalizerIcon);
    }
    
    // Create simplified social icons
    const socialLinks = [
        { name: 'linkedin', icon: 'fab fa-linkedin-in', url: 'https://www.linkedin.com/in/abdallah-issac/' },
        { name: 'github', icon: 'fab fa-github', url: 'https://github.com/al-swaiti' },
        { name: 'discord', icon: 'fab fa-discord', url: 'https://discord.gg/2HfkVdrY' },
        { name: 'huggingface', icon: 'fas fa-code-branch', url: 'https://huggingface.co/ABDALLALSWAITI' },
        { name: 'deviantart', icon: 'fab fa-deviantart', url: 'https://www.deviantart.com/abdallahalswaiti' },
        { name: 'civitai', icon: 'fas fa-robot', url: 'https://civitai.com/user/AbdallahAlswa80' }
    ];
    
    // Remove any existing social icons container
    const existingSocialIcons = document.querySelector('.social-icons-container');
    if (existingSocialIcons) {
        existingSocialIcons.remove();
    }
    
    // Create new simplified social icons container
    const simplifiedSocialIcons = document.createElement('div');
    simplifiedSocialIcons.className = 'simplified-social-icons';
    document.body.appendChild(simplifiedSocialIcons);
    
    // Add social icons to container
    socialLinks.forEach(link => {
        const socialIcon = document.createElement('a');
        socialIcon.className = `social-icon ${link.name}`;
        socialIcon.href = link.url;
        socialIcon.target = '_blank';
        socialIcon.rel = 'noopener noreferrer';
        socialIcon.innerHTML = `<i class="${link.icon}"></i>`;
        simplifiedSocialIcons.appendChild(socialIcon);
    });
    
    // Update audio control click handler to toggle equalizer animation
    if (audioControl) {
        const originalClickHandler = audioControl.onclick;
        audioControl.onclick = function() {
            // Call original handler if it exists
            if (typeof originalClickHandler === 'function') {
                originalClickHandler.call(this);
            }
            
            // Toggle equalizer animation
            const equalizer = audioControl.querySelector('.equalizer-icon');
            if (equalizer) {
                if (equalizer.classList.contains('equalizer-muted')) {
                    equalizer.classList.remove('equalizer-muted');
                } else {
                    equalizer.classList.add('equalizer-muted');
                }
            }
        };
    }
    
    // Apply music-reactive effects to social icons
    function applyMusicReactiveEffects() {
        if (typeof window.getRandomGlowClass === 'function' && typeof window.onBeat === 'function') {
            // Hook into existing beat detection
            const originalOnBeat = window.onBeat;
            window.onBeat = function(intensity) {
                // Call original handler
                originalOnBeat(intensity);
                
                // Apply glow to social icons
                document.querySelectorAll('.social-icon').forEach(icon => {
                    icon.classList.remove('music-glow-1', 'music-glow-2', 'music-glow-3', 'music-glow-4');
                    icon.classList.add(window.getRandomGlowClass(intensity));
                });
            };
        }
    }
    
    // Apply music-reactive effects after a delay to ensure other scripts have loaded
    setTimeout(applyMusicReactiveEffects, 2000);
});
