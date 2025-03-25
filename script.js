document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const previewBox = document.getElementById('preview-box');
    const colorButtonsContainer = document.querySelector('.color-buttons');
    const themeToggle = document.getElementById('preview-theme-toggle');

    // Add event listener for theme toggle
    themeToggle.addEventListener('change', function() {
        previewBox.classList.toggle('light-theme');
    });

    // Add event listener for input changes
    inputText.addEventListener('input', updatePreview);

    // Function to update the preview
    function updatePreview() {
        const text = inputText.value;
        const formattedText = parseRPGMakerText(text);
        previewBox.innerHTML = formattedText;
    }

    // Create buttons for all 32 colors
    for (let i = 0; i < 32; i++) {
        const button = document.createElement('div');
        button.className = 'color-button';
        button.setAttribute('data-code', `\\c[${i}]`);
        button.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(`--color-${i}`) || '#ffffff';
        
        button.addEventListener('click', function() {
            const colorCode = this.getAttribute('data-code');
            const cursorPos = inputText.selectionStart;
            
            // Insert the color code at cursor position
            const textBefore = inputText.value.substring(0, cursorPos);
            const textAfter = inputText.value.substring(cursorPos);
            inputText.value = textBefore + colorCode + textAfter;
            
            // Update cursor position after the inserted code
            const newCursorPos = cursorPos + colorCode.length;
            inputText.setSelectionRange(newCursorPos, newCursorPos);
            
            // Trigger input event to update preview
            inputText.dispatchEvent(new Event('input'));
            
            // Focus back on textarea
            inputText.focus();
        });
        
        colorButtonsContainer.appendChild(button);
    }

    // Add example text to help users understand the format
    inputText.placeholder = "Example: \c[0]Normal \c[1]Blue \c[2]Red \c[3]Green text";
});

function parseRPGMakerText(text) {
    if (!text) return '';
    
    // Replace RPG Maker color codes with HTML spans
    // Format: \c[n]text - where n is a number representing color
    
    let formattedText = text;
    
    // Define color mapping (All 32 RPG Maker colors)
    const colorMap = {
        0: 'text-0',   // White
        1: 'text-1',   // Light Blue
        2: 'text-2',   // Light Red
        3: 'text-3',   // Light Green
        4: 'text-4',   // Light Azure
        5: 'text-5',   // Light Violet
        6: 'text-6',   // Light Yellow
        7: 'text-7',   // Gray
        8: 'text-8',   // Light Gray
        9: 'text-9',   // Azure
        10: 'text-10', // Red
        11: 'text-11', // Green
        12: 'text-12', // Blue
        13: 'text-13', // Violet
        14: 'text-14', // Yellow
        15: 'text-15', // Black
        16: 'text-16', // Royal Blue
        17: 'text-17', // Bright Yellow
        18: 'text-18', // Bright Red
        19: 'text-19', // Dark Blue
        20: 'text-20', // Orange
        21: 'text-21', // Yellow Orange
        22: 'text-22', // Medium Blue
        23: 'text-23', // Cyan
        24: 'text-24', // Lime Green
        25: 'text-25', // Rose Pink
        26: 'text-26', // Cobalt Blue
        27: 'text-27', // Pink
        28: 'text-28', // Dark Green
        29: 'text-29', // Bright Green
        30: 'text-30', // Purple
        31: 'text-31'  // Light Purple
    };
    
    // Replace color codes
    formattedText = formattedText.replace(/\\c\[(\d+)\]([^]*?)(?=\\c\[|$)/g, function(match, colorNum, text) {
        const colorClass = colorMap[colorNum] || 'text-white';
        return `<span class="${colorClass}">${text}</span>`;
    });
    
    // Handle nested color codes
    let hasNestedCodes = true;
    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops
    
    while (hasNestedCodes && iterations < maxIterations) {
        const beforeReplace = formattedText;
        
        formattedText = formattedText.replace(/<span class="([^"]+)">([^<]*)<\/span><span class="([^"]+)">([^<]*)<\/span>/g, 
            function(match, class1, text1, class2, text2) {
                return `<span class="${class1}">${text1}</span><span class="${class2}">${text2}</span>`;
            });
            
        // Check if any replacements were made
        hasNestedCodes = (beforeReplace !== formattedText);
        iterations++;
    }
    
    // Replace newlines with <br> tags
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
}