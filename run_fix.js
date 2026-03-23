const fs = require('fs');
const path = require('path');

const tasks = [
  { file: 'src/app/(dashboard)/dashboard/wallet/page.tsx', words: ['NeonBadge'] },
  { file: 'src/app/(main)/auction/page.tsx', words: ['Clock', 'Loader2'] },
  { file: 'src/app/(main)/events/page.tsx', words: ['Users', 'GlassPanel'] },
  { file: 'src/app/(main)/leaderboard/page.tsx', words: ['Zap', 'ChevronUp', 'ChevronDown', 'calculateLevel'] },
  { file: 'src/app/(organiser)/organiser/players/page.tsx', words: ['Users'] },
  { file: 'src/app/(organiser)/organiser/quests/page.tsx', words: ['Edit', 'Trophy'] },
  { file: 'src/components/landing/LeaderboardWidget.tsx', words: ['ChevronUp', 'ChevronDown'] }
];

tasks.forEach(({file, words}) => {
  const p = path.resolve(__dirname, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');

    words.forEach(word => {
      // Remove word with comma from list: Word, 
      content = content.replace(new RegExp('\\\\b' + word + '\\\\s*,', 'g'), '');
      
      // Remove word with prefixed comma from list: , Word
      content = content.replace(new RegExp(',\\\\s*' + word + '\\\\b', 'g'), '');
      
      // Remove standalone word in brackets (if it's the last word without a comma)
      content = content.replace(new RegExp('\\\\{\\\\s*' + word + '\\\\s*\\\\}', 'g'), '{}');

      // Specifically check for any single import line and wipe it
      const singleImportRegex = new RegExp('import\\\\s*\\\\{\\\\s*' + word + '\\\\s*\\\\}\\\\s*from\\\\s*[\"\\'][^\"\\']+[\"\\']\\\\s*;?', 'g');
      content = content.replace(singleImportRegex, '');
    });

    // Clean up empty imports: import { } from "..."
    content = content.replace(/import\s*\{\s*\}\s*from\s*['"][^'"]+['"]\s*;?/g, '');
    
    // Clean up comma issues within brackets
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/\{\s*,/g, '{ ');
    content = content.replace(/,\s*\}/g, ' }');

    fs.writeFileSync(p, content);
    console.log('Fixed imports in ' + file);
  }
});
