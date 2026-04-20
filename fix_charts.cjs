const fs = require('fs');
const path = require('path');

const dir = './src/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace the getComputedStyle block in setupCharts with universal transparent colors
    content = content.replace(/const documentStyle = getComputedStyle\(document\.documentElement\);\s*const textColor = [^\;]+;\s*const textColorSecondary = [^\;]+;\s*const surfaceBorder = [^\;]+;/g, `const textColor = '#6B7280';\n    const textColorSecondary = '#6B7280';\n    const surfaceBorder = 'rgba(128, 128, 128, 0.15)';`);

    // Also catch the older hardcoded ones just in case
    content = content.replace(/const textColor = '#F9FAFB';\s*const textColorSecondary = '#6B7280';\s*const surfaceBorder = '#1E2A3B';/g, `const textColor = '#6B7280';\n    const textColorSecondary = '#6B7280';\n    const surfaceBorder = 'rgba(128, 128, 128, 0.15)';`);

    content = content.replace(/const cardBg = [^\;]+;/g, `const cardBg = 'transparent';`);

    // For border width in pie/doughnut charts, force it to 0 so there are no black rings
    // We look for borderColor in datasets that also have hoverBackgroundColor
    content = content.replace(/borderColor:\s*(?:surfaceBorder|cardBg|'#1E2A3B')/g, "borderColor: 'transparent', borderWidth: 0");

    fs.writeFileSync(filePath, content);
}

console.log('Charts fixed directly.');
