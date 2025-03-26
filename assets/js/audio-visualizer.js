/**
 * Audio Visualizer and Music Reactive Effects
 * Copyright (c) 2025 Abdallah Alswaiti. All rights reserved.
 * 
 * This file and its contents are protected by copyright law.
 * Unauthorized use, copying, or distribution without permission is prohibited.
 * 
 * Contact: abedalswaity7@gmail.com
 */

// Audio Visualizer and Music Reactive Effects
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const backgroundAudio = document.getElementById('background-audio');
    const audioControl = document.querySelector('.audio-control');
    const terminalText = document.getElementById('terminal-text');
    const terminalContainer = document.querySelector('.terminal-container');
    const profileImage = document.querySelector('.profile-image');
    const baseSpinner = document.querySelector('.base-spinner');
    const equalizer = document.querySelector('.equalizer-icon');
    const equalizerBars = document.querySelectorAll('.equalizer-bar');
    const navigationContainer = document.getElementById('navigation-container');
    
    // Debug info
    console.log("Audio control found:", !!audioControl);
    console.log("Terminal text found:", !!terminalText);
    console.log("Equalizer found:", !!equalizer);
    console.log("Equalizer bars found:", equalizerBars.length);
    console.log("Background audio found:", !!backgroundAudio);
    
    // Hide navigation container initially if it's not already hidden
    if (navigationContainer && !navigationContainer.classList.contains('hidden')) {
        navigationContainer.classList.add('hidden');
    }
    
    let profileInNavigation = false;
    let audioInitialized = false;
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let sourceNode = null;
    
    // Neural network simulation data
    let neuralNodes = [];
    let neuralConnections = [];
    
    // Simulate audio for quick visual testing - ENABLED
    let simulateAudio = true;
    let testMode = true;
    
    // Force remove muted class to ensure effect is visible
    if (equalizer) {
        equalizer.classList.remove('equalizer-muted');
    }
    
    // Start visualizeTest automatically
    if (testMode && simulateAudio) {
        console.log("Starting music visualization simulation...");
        setTimeout(() => {
            visualizeTest();
        }, 1000);
    }
    
    // Create circular audio reactive effect for profile image
    function createCircularAudioEffect() {
        if (!profileImage) return;
        
        // Remove any existing effects first
        const existingEffects = profileImage.querySelectorAll('.sunray, .flame, .audio-circle');
        existingEffects.forEach(effect => effect.remove());
        
        // Create audio-reactive circles
        const numberOfCircles = 3;
        
        for (let i = 0; i < numberOfCircles; i++) {
            const circle = document.createElement('div');
            circle.className = 'audio-circle';
            circle.style.animationDelay = `${i * 0.5}s`;
            profileImage.appendChild(circle);
        }
    }
    
    // Initialize Audio Visualizer
    function initAudioVisualizer() {
        try {
            console.log("Initializing audio visualizer...");
            
            // Create audio context
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (!audioContext) {
                console.error("Failed to create audio context");
                activateAnimationFallback();
                return;
            }
            
            // Create analyzer
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024; // Higher for better frequency resolution
            analyser.smoothingTimeConstant = 0.5; // Add smoothing (0-1)
            
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            
            // Connect audio source to analyzer
            sourceNode = audioContext.createMediaElementSource(backgroundAudio);
            sourceNode.connect(analyser);
            analyser.connect(audioContext.destination);
            
            // Initialize CPU mind map visualization
            initCPUMindMap();
            
            // Initialize terminal scrolling text
            createTerminalScrollingText();
            
            // Start animation loop
            audioInitialized = true;
            
            // Run the visualize function immediately
            visualize();
            console.log("Audio visualizer initialized successfully");
            
            // Make sure UI reflects playing state
            audioControl.classList.add('active');
            equalizer.classList.remove('equalizer-muted');
            
        } catch (e) {
            console.error('Audio Visualizer error:', e);
            // Fallback to animation if Web Audio API fails
            activateAnimationFallback();
            
            if (testMode) {
                simulateAudio = true;
                visualizeTest();
            }
        }
    }
    
    // Test function to simulate audio visualization
    function visualizeTest() {
        if (!simulateAudio) return;
        
        // Generate random frequencies with wave patterns for more natural feel
        const time = Date.now() / 1000;
        const testData = [];
        
        // Create sinusoidal patterns with random variations for realistic effect
        // Bass frequencies (low end)
        const bassSin = Math.sin(time * 1.5) * 0.5 + 0.5;
        const bassValue = 100 + Math.floor(bassSin * 155) + (Math.random() * 20 - 10);
        testData.push(Math.min(255, Math.max(0, bassValue)));
        
        // Mid frequencies with slight phase offset
        const midSin = Math.sin(time * 2.2 + 0.4) * 0.5 + 0.5;
        const midValue = 80 + Math.floor(midSin * 175) + (Math.random() * 15 - 7.5);
        testData.push(Math.min(255, Math.max(0, midValue)));
        
        // High-mid frequencies with different phase
        const highMidSin = Math.sin(time * 3.7 + 1.2) * 0.5 + 0.5;
        const highMidValue = 60 + Math.floor(highMidSin * 195) + (Math.random() * 12 - 6);
        testData.push(Math.min(255, Math.max(0, highMidValue)));
        
        // Treble frequencies with faster oscillation
        const trebleSin = Math.sin(time * 4.8 + 2.1) * 0.5 + 0.5;
        const trebleValue = 40 + Math.floor(trebleSin * 215) + (Math.random() * 10 - 5);
        testData.push(Math.min(255, Math.max(0, trebleValue)));
        
        // Occasional "beat drops" for dramatic effect
        const beatDrop = Math.random() > 0.98;
        if (beatDrop) {
            testData[0] = 230 + Math.random() * 25; // Strong bass hit
            console.log("Beat drop!");
        }
        
        // Calculate simulated levels
        const bassLevel = testData[0] / 255;
        const midLevel = testData[1] / 255;
        const highMidLevel = testData[2] / 255;
        const trebleLevel = testData[3] / 255;
        
        // Update visualizations
        updateEqualizerBars(testData);
        updateTerminalTextColor(bassLevel, midLevel, trebleLevel);
        updateProfileImageEffects(bassLevel, midLevel, trebleLevel);
        updateContentSectionsGlow(bassLevel, midLevel, trebleLevel);
        updateCircuitConnections(bassLevel, midLevel, trebleLevel);
        
        // Log some values occasionally for debugging
        if (testMode && Math.random() > 0.99) {
            console.log("Simulated audio levels:", {
                bass: Math.floor(bassLevel * 100) + "%",
                mid: Math.floor(midLevel * 100) + "%",
                treble: Math.floor(trebleLevel * 100) + "%"
            });
        }
        
        // Call this function again on the next frame
        requestAnimationFrame(visualizeTest);
    }
    
    // Update circuit connections based on audio levels
    function updateCircuitConnections(bassLevel, midLevel, trebleLevel) {
        const circuitConnections = document.querySelectorAll('.circuit-connection');
        if (!circuitConnections.length) return;
        
        circuitConnections.forEach(circuit => {
            // Update pulse speed based on mid frequencies
            const pulseSpeed = 3 - (midLevel * 2); // Between 1s-3s
            circuit.style.setProperty('--electric-pulse-speed', `${pulseSpeed}s`);
            
            // Update data pulse opacity based on bass
            const pulseOpacity = 0.5 + (bassLevel * 0.5); // Between 0.5-1.0
            circuit.style.setProperty('--data-pulse-opacity', pulseOpacity);
            
            // Update node glow intensity based on treble
            const nodeGlow = trebleLevel * 1.5; // Between 0-1.5
            circuit.style.setProperty('--node-glow-intensity', nodeGlow);
            
            // Update circuit nodes
            const nodes = circuit.querySelectorAll('.circuit-node');
            nodes.forEach(node => {
                // Adjust the glow intensity based on treble frequencies
                const glowColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                node.style.boxShadow = `0 0 ${8 + (trebleLevel * 10)}px ${glowColor}`;
            });
            
            // Update data pulses
            const dataPulses = circuit.querySelectorAll('.data-pulse, .data-pulse-reverse');
            dataPulses.forEach(pulse => {
                // Make pulses brighter when bass hits
                if (bassLevel > 0.7) {
                    pulse.style.width = `${15 + (bassLevel * 10)}px`;
                    pulse.style.height = `${3 + (bassLevel * 2)}px`;
                } else {
                    pulse.style.width = '15px';
                    pulse.style.height = '3px';
                }
            });
        });
    }
    
    // Animation loop for visualizer
    function visualize() {
        if (!analyser || !audioContext || !dataArray) {
            console.log("Missing audio components, cannot visualize");
            return;
        }
        
        // Continue the animation loop
        requestAnimationFrame(visualize);
        
        // Get frequency data
        analyser.getByteFrequencyData(dataArray);
        
        // Get frequency data for different bands
        const bass = getAverageVolume(dataArray.slice(1, 10)); // ~20-80Hz
        const lowMid = getAverageVolume(dataArray.slice(10, 30)); // ~80-250Hz
        const mid = getAverageVolume(dataArray.slice(30, 60)); // ~250-500Hz
        const highMid = getAverageVolume(dataArray.slice(60, 120)); // ~500-1000Hz
        
        // Log frequency values for debugging
        if (testMode) {
            console.log("Frequencies:", {bass, lowMid, mid, highMid});
        }
        
        // Calculate overall levels for different ranges
        const bassLevel = bass / 255;
        const midLevel = (lowMid + mid + highMid) / 3 / 255;
        const trebleLevel = highMid / 255;
        
        // Update visualizations
        updateEqualizerBars([bass, lowMid, mid, highMid]);
        updateTerminalTextColor(bassLevel, midLevel, trebleLevel);
        updateProfileImageEffects(bassLevel, midLevel, trebleLevel);
        updateContentSectionsGlow(bassLevel, midLevel, trebleLevel);
        updateCircuitConnections(bassLevel, midLevel, trebleLevel);
        
        // Update CPU mind map visualization
        updateCPUMindMap(bassLevel, midLevel, trebleLevel);
        
        // Occasionally trigger terminal glitch effect based on bass drops
        if (bassLevel > 0.7 && Math.random() < 0.2) {
            triggerTerminalGlitch();
        }
    }
    
    // Calculate average volume for a frequency range
    function getAverageVolume(array) {
        let values = 0;
        const length = array.length;
        
        if (length === 0) return 0;
        
        for (let i = 0; i < length; i++) {
            values += array[i];
        }
        return values / length;
    }
    
    // Update equalizer bars based on frequency data
    function updateEqualizerBars(frequencies) {
        if (!equalizerBars || !equalizer) return;
        
        // Don't update if audio is paused and we're not in test mode
        if (backgroundAudio.paused && !simulateAudio) {
            // Reset bars to default state
            equalizerBars.forEach(bar => {
                bar.style.height = '5px';
                bar.style.backgroundColor = 'var(--primary-color)';
                bar.style.boxShadow = 'none';
            });
            return;
        }
        
        // Remove muted class to ensure animation works
        equalizer.classList.remove('equalizer-muted');
        
        // Update each bar
        equalizerBars.forEach((bar, index) => {
            if (index >= frequencies.length) return;
            
            // Map frequency energy to bar height (min 5px, max 35px)
            const rawValue = frequencies[index];
            const height = 5 + ((rawValue / 255) * 30);
            
            // Apply height with a small transition for smoothness
            bar.style.height = `${height}px`;
            
            // Dynamic color based on intensity
            const intensity = rawValue / 255;
            const hue = 300 + (intensity * 60); // Pink to purple range
            
            // Add glow effect based on intensity (brighter for higher values)
            const glowSize = 5 + (intensity * 20);
            bar.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
            bar.style.boxShadow = `0 0 ${glowSize}px hsl(${hue}, 100%, 60%)`;
        });
    }
    
    // Update terminal text color based on frequency
    function updateTerminalTextColor(bass, mid, treble) {
        if (!terminalText) {
            console.log("Terminal text element not found");
            return;
        }
        
        // Don't update if audio is paused and we're not in test mode
        if (backgroundAudio.paused && !simulateAudio) {
            // Reset terminal text to default
            terminalText.style.filter = '';
            terminalText.style.textShadow = '';
            terminalText.style.animationDuration = '5s';
            return;
        }
        
        // Combine levels with emphasis on mid frequencies for text color
        const intensity = (bass * 0.4) + (mid * 0.4) + (treble * 0.2);
        
        // Make brightness more dramatic (40% to 140%)
        const brightness = 60 + (intensity * 80);
        
        // Scale contrast based on bass (more bass = more contrast)
        const contrast = 120 + (bass * 180);
        
        // Apply filter for immediate visual effect
        terminalText.style.filter = `brightness(${brightness}%) contrast(${contrast}%) hue-rotate(${intensity * 60}deg)`;
        
        // Speed up text animation with higher intensity
        const animSpeed = Math.max(1, 5 - (intensity * 4));
        terminalText.style.animationDuration = `${animSpeed}s`;
        
        // Dynamic text shadow based on intensity
        const shadowSize = 5 + (intensity * 15);
        const hue = 320 + (intensity * 40);
        terminalText.style.textShadow = `0 0 ${shadowSize}px hsl(${hue}, 100%, 60%)`;
    }
    
    // Update profile image effects based on audio levels
    function updateProfileImageEffects(bassLevel, midLevel, trebleLevel) {
        if (!profileImage) return;
        
        // Apply audio-reactive effects to the profile image
        // Even when audio is paused, apply effects if simulateAudio is true
        if (!backgroundAudio.paused || simulateAudio) {
            const glowIntensity = Math.min(1, bassLevel * 1.5);
            const scaleEffect = 1 + (midLevel * 0.1);
            const hueRotate = Math.floor(trebleLevel * 30);
            
            // Update glow intensity based on bass
            const profileBefore = profileImage.querySelector('::before');
            if (profileBefore) {
                profileBefore.style.boxShadow = `
                    0 0 ${10 + Math.floor(bassLevel * 20)}px rgba(255, 0, 230, ${0.7 + bassLevel * 0.3}),
                    0 0 ${20 + Math.floor(midLevel * 30)}px rgba(255, 0, 230, ${0.5 + midLevel * 0.3}),
                    0 0 ${30 + Math.floor(trebleLevel * 40)}px rgba(77, 119, 255, ${0.5 + trebleLevel * 0.3})
                `;
            }
            
            // Update animation speed based on audio levels
            document.documentElement.style.setProperty('--electric-pulse-speed', `${3 - bassLevel}s`);
            
            // Apply subtle scale to profile image based on mid frequencies
            profileImage.style.transform = `scale(${scaleEffect})`;
            
            // Update audio rings if they exist
            updateAudioRings(true, bassLevel, midLevel, trebleLevel);
        } else {
            // Reset effects when audio is paused
            profileImage.style.transform = '';
            updateAudioRings(false);
        }
    }
    
    // Update audio rings with enhanced effects
    function updateAudioRings(isPlaying, bassLevel = 0.5, midLevel = 0.5, trebleLevel = 0.5) {
        const audioRings = document.querySelectorAll('.audio-ring');
        
        if (isPlaying || simulateAudio) {
            // Enhanced dynamic effects based on audio levels
            audioRings.forEach((ring, index) => {
                const baseSpeed = 2 + (index * 0.2);
                const intensity = bassLevel * 1.2;
                const scale = 0.9 + (midLevel * 0.2);
                const speed = baseSpeed - (intensity * 0.5);
                
                // Create unique animation for each ring based on audio
                ring.style.animation = `audio-pulse ${speed}s infinite alternate ${index * 0.3}s`;
                ring.style.opacity = 0.2 + (intensity * 0.8);
                ring.style.transform = `translate(-50%, -50%) scale(${scale})`;
                
                // Adjust color based on treble
                const hue = 280 + (trebleLevel * 80);
                if (index === 0) {
                    ring.style.borderColor = `hsl(180, 100%, ${50 + trebleLevel * 20}%)`;
                    ring.style.boxShadow = `0 0 ${10 + trebleLevel * 10}px hsl(180, 100%, ${50 + trebleLevel * 20}%)`;
                } else if (index === 1) {
                    ring.style.borderColor = `hsl(${hue}, 100%, ${50 + midLevel * 20}%)`;
                    ring.style.boxShadow = `0 0 ${10 + midLevel * 10}px hsl(${hue}, 100%, ${50 + midLevel * 20}%)`;
                } else if (index === 2) {
                    ring.style.borderColor = `hsl(320, 100%, ${50 + bassLevel * 20}%)`;
                    ring.style.boxShadow = `0 0 ${10 + bassLevel * 10}px hsl(320, 100%, ${50 + bassLevel * 20}%)`;
                } else {
                    ring.style.borderColor = `hsl(220, 100%, ${50 + (bassLevel + trebleLevel) * 10}%)`;
                    ring.style.boxShadow = `0 0 ${10 + (bassLevel + trebleLevel) * 5}px hsl(220, 100%, ${50 + (bassLevel + trebleLevel) * 10}%)`;
                }
            });
        } else {
            // Reset effects when audio is paused
            audioRings.forEach(ring => {
                ring.style.animation = 'none';
                ring.style.opacity = '0.2';
                ring.style.transform = '';
            });
        }
    }
    
    // Update content sections with glow effects based on audio levels
    function updateContentSectionsGlow(bass, mid, treble) {
        // Get all content sections
        const contentSections = document.querySelectorAll('.content-section');
        
        // Apply default animation if audio is paused but simulation is on
        const useSimulation = backgroundAudio.paused && simulateAudio;
        
        // Add music reactive class to visible sections
        contentSections.forEach(section => {
            // Only apply effects to sections that are currently visible
            if (!section.classList.contains('hidden')) {
                section.classList.add('music-reactive');
                
                if (useSimulation) {
                    // Use simulated values for pulsing effect
                    const timeOffset = Date.now() / 1000;
                    const simulatedBass = 0.5 + Math.sin(timeOffset * 2) * 0.5;
                    const simulatedMid = 0.5 + Math.cos(timeOffset * 3) * 0.5;
                    const simulatedTreble = 0.5 + Math.sin(timeOffset * 5) * 0.5;
                    
                    const intensity = simulatedBass * 0.6 + simulatedMid * 0.3 + simulatedTreble * 0.1;
                    const hue = 300 + (intensity * 60);
                    
                    // Apply dynamic styles
                    section.style.setProperty('--glow-intensity', `${Math.min(25, 10 + intensity * 20)}px`);
                    section.style.setProperty('--glow-hue', `${hue}`);
                    
                    // Apply text color variations based on simulated audio
                    updateSectionTextColors(section, simulatedBass, simulatedMid, simulatedTreble);
                } else {
                    // Apply intensity based on real audio levels
                    const intensity = bass * 0.6 + mid * 0.3 + treble * 0.1;
                    const hue = 300 + (intensity * 60);
                    
                    // Apply dynamic styles for more reactive visual feedback
                    section.style.setProperty('--glow-intensity', `${Math.min(25, 10 + intensity * 20)}px`);
                    section.style.setProperty('--glow-hue', `${hue}`);
                    
                    // Apply text color variations based on audio
                    updateSectionTextColors(section, bass, mid, treble);
                }
            } else {
                // Remove effect from hidden sections
                section.classList.remove('music-reactive');
            }
        });
    }
    
    // Update text colors in sections based on audio levels
    function updateSectionTextColors(section, bass, mid, treble) {
        // Get elements to update
        const headings = section.querySelectorAll('h3');
        const paragraphs = section.querySelectorAll('p');
        const icons = section.querySelectorAll('.project-icon i');
        const links = section.querySelectorAll('.project-links a');
        
        // Calculate color based on audio levels
        const hue = 300 + (treble * 60);
        const saturation = 85 + (mid * 15) + '%';
        const lightness = 65 + (bass * 25) + '%';
        
        // Apply to headings
        headings.forEach(heading => {
            heading.style.color = `hsl(${hue}, ${saturation}, ${lightness})`;
            heading.style.textShadow = `0 0 ${5 + bass * 10}px hsla(${hue}, 100%, 75%, 0.8)`;
        });
        
        // Apply to icons with slightly different hue
        icons.forEach(icon => {
            icon.style.color = `hsl(${hue + 20}, ${saturation}, ${lightness})`;
            icon.style.textShadow = `0 0 ${5 + bass * 15}px hsla(${hue + 20}, 100%, 75%, 0.8)`;
        });
        
        // Apply to links with different hue
        links.forEach(link => {
            const linkHue = hue - 20;
            link.style.color = `hsl(${linkHue}, ${saturation}, ${lightness})`;
            link.style.textShadow = `0 0 ${3 + bass * 8}px hsla(${linkHue}, 100%, 75%, 0.7)`;
        });
    }
    
    // Fallback to CSS animations if Web Audio API fails
    function activateAnimationFallback() {
        console.log("Using animation fallback for visualizer");
        audioControl.classList.add('active');
        equalizer.classList.remove('equalizer-muted');
        profileImage.classList.add('music-pulse');
        
        // Animate equalizer bars with CSS
        equalizerBars.forEach((bar, index) => {
            bar.style.animation = `equalizerPulse 1.${index}s ease-in-out infinite alternate`;
        });
        
        // Animate terminal text with CSS
        if (terminalText) {
            terminalText.style.animation = 'textPulse 2s ease-in-out infinite alternate';
        }
    }
    
    // Move profile image to base spinner location
    function moveProfileToNavigation() {
        if (profileInNavigation) return;
        
        const img = profileImage.querySelector('img');
        if (!img || !baseSpinner) return;
        
        // Clone the profile image to avoid destroying the original
        const imgClone = img.cloneNode(true);
        
        // Clear the spinner content
        baseSpinner.innerHTML = '';
        
        // Add new class to spinner
        baseSpinner.classList.add('profile-spinner');
        
        // Append the profile image to the spinner
        baseSpinner.appendChild(imgClone);
        
        // Hide the original profile image
        profileImage.style.display = 'none';
        
        // Create audio circles in spinner
        createCircularAudioEffect();
        
        profileInNavigation = true;
    }
    
    // Function to show navigation and move profile to mind map page
    function navigateToMindMap() {
        // Show navigation
        if (navigationContainer && navigationContainer.classList.contains('hidden')) {
            navigationContainer.classList.remove('hidden');
        }
        
        // Move profile image
        moveProfileToNavigation();
    }
    
    // Initialize effects
    createCircularAudioEffect();
    
    // Terminal click no longer shows navigation
    if (terminalContainer) {
        terminalContainer.addEventListener('click', function() {
            // The terminal click now doesn't do anything with navigation
            console.log('Terminal clicked');
            
            // Optional: We could toggle test mode for quick testing
            if (testMode) {
                simulateAudio = !simulateAudio;
                if (simulateAudio) {
                    visualizeTest();
                }
            }
        });
    }
    
    // Listen for navigation to mind map page - this triggers both navigation show and profile move
    document.addEventListener('click', function(e) {
        // Check if the clicked element is a mind map navigation node or any link to mind map
        const mindMapTriggers = [
            '.node[data-target="mind-map"]',
            '.navigation-item[data-page="mind-map"]',
            '[data-page="mind-map"]',
            '.cpus-link',
            '.mind-map-link'
        ];
        
        // Check if any of the mind map triggers were clicked
        const isMindMapTrigger = mindMapTriggers.some(selector => {
            return e.target.matches(selector) || e.target.closest(selector);
        });
        
        if (isMindMapTrigger) {
            navigateToMindMap();
        }
    });
    
    // Set up audio control interactions with mute/unmute
    audioControl.addEventListener('click', function() {
        console.log("Audio control clicked. Current state:", backgroundAudio.paused ? "paused" : "playing");
        
        if (backgroundAudio.paused) {
            // Resume AudioContext if it was suspended
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Play music
            backgroundAudio.play().then(() => {
                // Initialize audio visualizer on first play if not already initialized
                if (!audioInitialized) {
                    initAudioVisualizer();
                }
                
                // Update UI
                audioControl.classList.add('active');
                equalizer.classList.remove('equalizer-muted');
                console.log("Audio playing");
                
                // Force visualize call to ensure immediate update
                if (audioInitialized && analyser) {
                    visualize();
                }
            }).catch(err => {
                console.error('Error playing audio:', err);
                activateAnimationFallback();
            });
        } else {
            // Mute/pause music
            backgroundAudio.pause();
            audioControl.classList.remove('active');
            equalizer.classList.add('equalizer-muted');
            console.log("Audio paused");
            
            // Reset equalizer bars to default state
            equalizerBars.forEach(bar => {
                bar.style.height = '5px';
                bar.style.backgroundColor = 'var(--primary-color)';
                bar.style.boxShadow = 'none';
            });
            
            // Reset terminal text to default
            if (terminalText) {
                terminalText.style.filter = '';
                terminalText.style.textShadow = '';
                terminalText.style.animationDuration = '5s';
            }
            
            // Reset profile image
            if (profileImage) {
                profileImage.style.transform = profileInNavigation ? '' : 'translateX(-50%)';
                profileImage.style.boxShadow = '';
                
                // Reset audio circles
                const circles = profileImage.querySelectorAll('.audio-circle');
                circles.forEach(circle => {
                    circle.style.transform = 'scale(1)';
                    circle.style.opacity = '0.1';
                    circle.style.boxShadow = 'none';
                });
            }
        }
    });
    
    // Initialize audio context when the page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && !audioInitialized && !backgroundAudio.paused) {
            initAudioVisualizer();
        }
    });
    
    // Initialize audio if already playing
    if (!backgroundAudio.paused) {
        console.log("Audio already playing on load, initializing visualizer");
        // Small delay to ensure audio is really playing
        setTimeout(() => {
            initAudioVisualizer();
        }, 100);
    } else {
        // Ensure equalizer is in muted state
        equalizer.classList.add('equalizer-muted');
    }
    
    // Add CSS keyframes for fallback animations if they don't exist
    if (!document.querySelector('#audio-visualizer-keyframes')) {
        const style = document.createElement('style');
        style.id = 'audio-visualizer-keyframes';
        style.textContent = `
            @keyframes equalizerPulse {
                0% { height: 5px; }
                100% { height: 30px; }
            }
            
            @keyframes textPulse {
                0% { filter: brightness(60%) contrast(120%); text-shadow: 0 0 5px var(--primary-color); }
                100% { filter: brightness(140%) contrast(300%); text-shadow: 0 0 20px var(--primary-color); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Manually try to start audio context
    function forceTryInitAudio() {
        if (!audioInitialized && backgroundAudio) {
            // First try to play the audio
            backgroundAudio.volume = 0.7; // Ensure volume is set
            
            // Force unmute
            backgroundAudio.muted = false;
            
            // Try to play with user interaction
            backgroundAudio.play().then(() => {
                console.log("Successfully started audio playback");
                initAudioVisualizer();
                audioControl.classList.add('active');
                equalizer.classList.remove('equalizer-muted');
            }).catch(err => {
                console.error("Could not start audio playback:", err);
                // Try simulation mode
                if (testMode) {
                    simulateAudio = true;
                    visualizeTest();
                } else {
                    activateAnimationFallback();
                }
            });
        }
    }
    
    // Try to force start audio after a short delay
    setTimeout(forceTryInitAudio, 500);
    
    // Try to force start simulation
    function forceTryInitSimulation() {
        if (!audioInitialized && !backgroundAudio.paused) {
            console.log("Trying to initialize audio visualizer...");
            initAudioVisualizer();
        } else if (!audioInitialized) {
            // If audio can't be initialized, enable simulation mode
            console.log("Audio not initialized, enabling simulation mode");
            simulateAudio = true;
            
            // Initialize CPU mind map
            initCPUMindMap();
            
            // Initialize terminal scrolling text
            createTerminalScrollingText();
            
            // Start visualization with simulated values
            visualizeSimulated();
        }
    }
    
    // Visualization loop for simulation mode
    function visualizeSimulated() {
        // Generate simulated audio values using sine waves
        const timeOffset = Date.now() / 1000;
        const simulatedBass = 0.5 + Math.sin(timeOffset * 2) * 0.5;
        const simulatedMid = 0.5 + Math.cos(timeOffset * 3) * 0.5;
        const simulatedTreble = 0.5 + Math.sin(timeOffset * 5) * 0.5;
        
        // Update visualizations with simulated values
        updateTerminalTextColor(simulatedBass, simulatedMid, simulatedTreble);
        updateProfileImageEffects(simulatedBass, simulatedMid, simulatedTreble);
        updateCPUMindMap(simulatedBass, simulatedMid, simulatedTreble);
        updateContentSectionsGlow(simulatedBass, simulatedMid, simulatedTreble);
        updateCircuitConnections(simulatedBass, simulatedMid, simulatedTreble);
        
        // Occasionally trigger terminal glitch effect based on simulated bass drops
        if (simulatedBass > 0.8 && Math.random() < 0.05) {
            triggerTerminalGlitch();
        }
        
        // Continue the animation loop
        requestAnimationFrame(visualizeSimulated);
    }
    
    // Initialize effects
    createCircularAudioEffect();
    
    // Try to force start simulation after a short delay
    setTimeout(forceTryInitSimulation, 500);
});

// Initialize CPU mind map visualization
function initCPUMindMap() {
    // Create canvas for CPU mind map if it doesn't exist
    if (!document.getElementById('cpu-mindmap')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'cpu-mindmap';
        canvas.className = 'cpu-mindmap';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        
        // Size canvas appropriately on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    // Initialize neural nodes and connections
    createNeuralNetwork();
}

// Create neural network nodes and connections
function createNeuralNetwork() {
    const canvas = document.getElementById('cpu-mindmap');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear any existing nodes
    neuralNodes = [];
    neuralConnections = [];
    
    // Create random nodes across the screen
    const nodeCount = 25;
    for (let i = 0; i < nodeCount; i++) {
        neuralNodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 2 + Math.random() * 4,
            color: `hsl(320, 100%, 75%)`,
            pulse: 0,
            speed: 0.2 + Math.random() * 0.5
        });
    }
    
    // Create connections between nodes (not all nodes will be connected)
    const connectionCount = 35;
    for (let i = 0; i < connectionCount; i++) {
        const nodeA = Math.floor(Math.random() * nodeCount);
        const nodeB = Math.floor(Math.random() * nodeCount);
        
        if (nodeA !== nodeB) {
            neuralConnections.push({
                nodeA: nodeA,
                nodeB: nodeB,
                width: 0.5 + Math.random(),
                opacity: 0.1 + Math.random() * 0.4,
                active: false
            });
        }
    }
}

// Update CPU mind map visualization with audio data
function updateCPUMindMap(bass, mid, treble) {
    const canvas = document.getElementById('cpu-mindmap');
    if (!canvas || !neuralNodes || !neuralConnections) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas with fade effect for trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw nodes
    neuralNodes.forEach((node, index) => {
        // Move nodes slightly in a fluid motion
        node.x += Math.sin(Date.now() * 0.001 * node.speed) * 0.5;
        node.y += Math.cos(Date.now() * 0.0015 * node.speed) * 0.5;
        
        // Keep nodes within canvas bounds
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;
        
        // Audio reactive pulse and color
        const pulseFactor = bass * 0.7 + mid * 0.3;
        node.pulse = Math.max(0, node.pulse - 0.05);
        
        // Randomly activate nodes based on bass hits
        if (Math.random() < (bass * 0.3) && node.pulse < 0.2) {
            node.pulse = 1;
        }
        
        // Draw the node with glow effect
        const pulseRadius = node.radius * (1 + node.pulse * 3);
        const hue = 320 + (treble * 60);
        
        // Quantum plasma effect
        ctx.beginPath();
        const grd = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, pulseRadius * 2
        );
        grd.addColorStop(0, `hsla(${hue}, 100%, 75%, ${0.8 + node.pulse * 0.2})`);
        grd.addColorStop(1, `hsla(${hue}, 100%, 75%, 0)`);
        
        ctx.fillStyle = grd;
        ctx.arc(node.x, node.y, pulseRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw node core
        ctx.beginPath();
        ctx.fillStyle = `hsl(${hue}, 100%, ${75 + (node.pulse * 25)}%)`;
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw connections between nodes
    const maxDistance = 200 * (1 + bass);
    
    neuralConnections.forEach(conn => {
        const nodeA = neuralNodes[conn.nodeA];
        const nodeB = neuralNodes[conn.nodeB];
        
        // Calculate distance
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only draw if nodes are close enough
        if (distance < maxDistance) {
            // Connection opacity based on distance and audio
            const opacityFactor = 1 - (distance / maxDistance);
            const pulseOpacity = Math.max(nodeA.pulse, nodeB.pulse);
            const opacity = (conn.opacity * opacityFactor) + (pulseOpacity * 0.8);
            
            // Draw connection
            ctx.beginPath();
            ctx.strokeStyle = `hsla(320, 100%, 75%, ${opacity})`;
            ctx.lineWidth = conn.width * (1 + (pulseOpacity * 2));
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
            
            // Add glow effect to active connections
            if (pulseOpacity > 0.5) {
                ctx.beginPath();
                ctx.strokeStyle = `hsla(320, 100%, 85%, ${opacity * 0.7})`;
                ctx.lineWidth = conn.width * 3 * pulseOpacity;
                ctx.moveTo(nodeA.x, nodeA.y);
                ctx.lineTo(nodeB.x, nodeB.y);
                ctx.stroke();
            }
        }
    });
}

// Create terminal scrolling text with sci-fi messages
function createTerminalScrollingText() {
    if (!terminalText) return;
    
    // Clear existing content
    terminalText.innerHTML = '';
    
    // Main bio text
    const bioText = `Abdallah Alswaiti is a dynamic Linux System  education, specializing in physics, alongside profound expertise in AI, robotics, and IoT. Demonstrates a unique blend of artistic creativity and scientific acumen, with significant achievements in developing custom Linux OS and kernels. Passionate about leveraging technology to enhance learning and education, with a strong background in instructional design and digital tool training for educators.<br><br>Skills: Linux OS Development, Shell Scripting, Front-End Development, Educational Technology, Instructional Design, Algorithm Design, AI Integration, Robotics, IoT Systems, Cybersecurity, Software Development, Python Scripting, Physics Instruction, Digital Art Creation, Linux Kernel Customization.<br><br>&gt; Click anywhere to continue...`;
    
    // Set the content directly without adding multiple elements
    terminalText.innerHTML = bioText;
    
    // Cleanup any existing interval to prevent multiple text updates
    if (window.terminalInterval) {
        clearInterval(window.terminalInterval);
        window.terminalInterval = null;
    }
}

// Add a new line to the terminal
function addNewTerminalLine(text) {
    if (!terminalText) return;
    
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    
    // Add to terminal
    terminalText.appendChild(line);
    
    // Ensure the newest line is visible by scrolling
    terminalText.scrollTop = terminalText.scrollHeight;
}

// Trigger glitch effect on terminal text
function triggerTerminalGlitch() {
    if (!terminalText) return;
    
    terminalText.classList.add('glitch-effect');
    
    // Remove the effect after a short time
    setTimeout(() => {
        terminalText.classList.remove('glitch-effect');
    }, 100 + Math.random() * 200);
}
