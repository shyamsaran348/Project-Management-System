const fs = require('fs');

const html = fs.readFileSync('stitch_design_system_implementation/stitch_design_system_implementation/sdgsync_dashboard_student_view/code.html', 'utf-8');

// Extract the content inside <script id="tailwind-config">
const scriptMatch = html.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);

if (scriptMatch) {
    const scriptContent = scriptMatch[1];
    // Evaluate it safely by mocking tailwind
    const tailwind = {};
    eval(scriptContent);
    
    const config = tailwind.config;
    const colors = config.theme.extend.colors;
    const spacing = config.theme.extend.spacing;
    const fontFamily = config.theme.extend.fontFamily;
    const borderRadius = config.theme.extend.borderRadius;
    // fontSize is tricky in v4 but we can map it too

    let css = '\n\n/* STITCH DESIGN SYSTEM THEME */\n@theme {\n';
    
    for (const [key, value] of Object.entries(colors)) {
        css += `  --color-${key}: ${value};\n`;
    }
    
    for (const [key, value] of Object.entries(spacing)) {
        css += `  --spacing-${key}: ${value};\n`;
    }
    
    for (const [key, value] of Object.entries(borderRadius)) {
        if (key === 'DEFAULT') {
            css += `  --radius: ${value};\n`;
        } else {
            css += `  --radius-${key}: ${value};\n`;
        }
    }
    
    for (const [key, value] of Object.entries(fontFamily)) {
        const fonts = Array.isArray(value) ? value.map(v => `"${v}"`).join(', ') : `"${value}"`;
        css += `  --font-${key}: ${fonts};\n`;
    }
    
    css += '}\n';
    
    // Extract custom styles
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) {
        css += '\n/* STITCH CUSTOM STYLES */\n' + styleMatch[1];
    }
    
    fs.appendFileSync('frontend/src/index.css', css);
    console.log('Appended Stitch theme to index.css');
} else {
    console.error('Could not find tailwind-config block');
}
