const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else if (file.endsWith('.vue')) {
            filelist.push(filepath);
        }
    });
    return filelist;
}

const files = walkSync('./src');

const toSentenceCase = (str) => {
    return str.split(' ').map(word => {
        if (['OT', 'OPD', 'IPD', 'ER', 'ICU', 'AR', 'HAI', 'NABH', 'REC.', 'NPS'].includes(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
};

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');

    // Find all tags with text-muted and replace uppercase content
    // <div class="text-muted" ...>TEXT IN HERE</div>
    // <span class="text-muted" ...>TEXT IN HERE</span>
    content = content.replace(/(<(?:div|span)[^>]*class="[^"]*text-muted[^"]*"[^>]*>)([^<]+)(<\/(?:div|span)>)/g, (match, openTag, text, closeTag) => {
        const trimmed = text.trim();
        // Check if the trimmed text is mostly uppercase
        if (trimmed.length > 2 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
            // Keep leading/trailing whitespaces if any
            const replaced = text.replace(trimmed, toSentenceCase(trimmed));
            return openTag + replaced + closeTag;
        }
        return match;
    });

    // We'll also remove the "mono-data" class completely from all files so it's stripped from the HTML
    content = content.replace(/(\s)class="mono-data"/g, '');
    content = content.replace(/class="([^"]*)\bmono-data\b([^"]*)"/g, (match, prev, next) => {
        const newClass = (prev + next).replace(/\s+/g, ' ').trim();
        if (!newClass) return '';
        return `class="${newClass}"`;
    });

    fs.writeFileSync(file, content);
}
console.log('Finished updating App.vue and all components');
