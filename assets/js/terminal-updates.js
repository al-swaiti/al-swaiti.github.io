// Terminal Header and Bio Text Updates
document.addEventListener('DOMContentLoaded', function() {
    // Update the bio text with the specific text provided by the user
    const bioText = `Abdallah Alswaiti is a dynamic Linux System Engineer with over 14 years of experience in education,
specializing in physics, alongside profound expertise in AI, robotics, and IoT. Demonstrates a unique
blend of artistic creativity and scientific acumen, with significant achievements in developing custom
Linux OS and kernels. Passionate about leveraging technology to enhance learning and education, with
a strong background in instructional design and digital tool training for educators.
Skills UI Linux OS Development, Shell Scripting, Front-End Development, Educational Technology,
Instructional Design, Algorithm Design, AI Integration, Robotics, IoT Systems, Cybersecurity, Software
Development, Python Scripting, Physics Instruction, Digital Art Creation, Linux Kernel Customization.

> Click anywhere to continue...`;

    // User roles for terminal header with typing and reversing animation
    const userRoles = [];

    let currentRoleIndex = 0;
    let isTyping = true;
    let currentText = '';
    let charIndex = 0;
    let roleHeaderElement = null;

    // Function to update role in terminal header with typing and reversing animation
    function updateRoleHeader() {
        if (!roleHeaderElement) {
            // Try to find the role header element
            roleHeaderElement = document.querySelector('.terminal-role-header');
            if (!roleHeaderElement && document.getElementById('terminal-text')) {
                // Create role header element if it doesn't exist
                roleHeaderElement = document.createElement('div');
                roleHeaderElement.className = 'terminal-role-header';
                roleHeaderElement.style.display = 'none'; // Hide the element since there are no roles
                const terminalText = document.getElementById('terminal-text');
                terminalText.parentNode.insertBefore(roleHeaderElement, terminalText);
            }
            if (!roleHeaderElement) return; // Still not found, exit
        } else {
            // Hide existing element
            roleHeaderElement.style.display = 'none';
        }

        // Skip the rest of the function if there are no roles
        if (userRoles.length === 0) return;

        const targetRole = userRoles[currentRoleIndex];
        
        if (isTyping) {
            // Typing forward
            if (charIndex < targetRole.length) {
                currentText = targetRole.substring(0, charIndex + 1);
                roleHeaderElement.textContent = currentText;
                charIndex++;
                setTimeout(updateRoleHeader, 100);
            } else {
                // Pause at the end of typing before starting to reverse
                isTyping = false;
                setTimeout(updateRoleHeader, 1500);
            }
        } else {
            // Reversing
            if (charIndex > 0) {
                charIndex--;
                currentText = targetRole.substring(0, charIndex);
                roleHeaderElement.textContent = currentText;
                setTimeout(updateRoleHeader, 50);
            } else {
                // Move to next role
                isTyping = true;
                currentRoleIndex = (currentRoleIndex + 1) % userRoles.length;
                setTimeout(updateRoleHeader, 500);
            }
        }
    }

    // Override the startTypingAnimation function to use the updated bio text
    window.startTypingAnimation = function() {
        let i = 0;
        const typingSpeed = 30; // milliseconds per character
        const terminalText = document.getElementById('terminal-text');
        if (!terminalText) return;
        
        terminalText.innerHTML = ''; // Clear any existing text
        
        // Start the role header animation
        updateRoleHeader();
        
        function typeWriter() {
            if (i < bioText.length) {
                if (bioText.charAt(i) === '\n') {
                    terminalText.innerHTML += '<br>';
                } else {
                    terminalText.innerHTML += bioText.charAt(i);
                }
                i++;
                setTimeout(typeWriter, typingSpeed);
            } else {
                // Add click event to terminal after typing is complete
                document.querySelector('.terminal-container').addEventListener('click', function() {
                    if (typeof activateCPUMode === 'function') {
                        activateCPUMode();
                    }
                });
            }
        }
        
        typeWriter();
    };

    // If the page is already loaded and the terminal is visible, start the animation
    const terminalContainer = document.querySelector('.terminal-container');
    if (terminalContainer && getComputedStyle(terminalContainer).opacity !== '0' && getComputedStyle(terminalContainer).display !== 'none') {
        // Create role header element
        roleHeaderElement = document.createElement('div');
        roleHeaderElement.className = 'terminal-role-header';
        roleHeaderElement.style.display = 'none'; // Hide the element since there are no roles
        const terminalText = document.getElementById('terminal-text');
        if (terminalText) {
            terminalText.parentNode.insertBefore(roleHeaderElement, terminalText);
            
            // Start role header animation
            updateRoleHeader();
            
            // Start typing animation with new bio text
            window.startTypingAnimation();
        }
    }
});
