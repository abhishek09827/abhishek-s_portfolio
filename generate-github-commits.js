const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
const DAYS_BACK = 18;

// Different commit counts per day to get different green intensity on GitHub graph
// This creates natural looking activity with varying shades: 1=light, 2,3,4,5=darker
const dailyCommitCounts = [
  3, 4, 3, 4, 2, 4, 3,
  5, 3, 4, 3, 1, 4, 3,
  4, 3, 5, 4
];

// Realistic commit messages
const commitMessages = [
  "Update component styling",
  "Fix terminal scrolling issue",
  "Add pipeline viewer animations",
  "Improve performance for log rendering",
  "Refactor overlay container logic",
  "Add keyboard shortcuts",
  "Update dependency versions",
  "Fix responsive layout bugs",
  "Implement telemetry HUD indicators",
  "Add background logs auto-scrolling",
  "Refactor AI agent state management",
  "Add command palette search",
  "Improve error handling",
  "Update documentation",
  "Add unit tests for components",
  "Fix memory leak in terminal",
  "Optimize framer motion animations",
  "Add left navigation panel",
  "Implement hex logo component",
  "Fix build warnings",
  "Update index.css styling",
  "Add inline widgets component",
  "Refactor App.tsx structure",
  "Fix type definitions",
  "Improve accessibility attributes"
];

console.log(`Generating commits for past ${DAYS_BACK} days with varying intensity...\n`);

// Create tracking file that we will modify for each commit
const trackFile = 'console-app/src/.activity-log';

for (let dayOffset = DAYS_BACK - 1; dayOffset >= 0; dayOffset--) {
  const commitCount = dailyCommitCounts[dayOffset];
  
  console.log(`📅 Day ${dayOffset + 1}: ${commitCount} commits`);
  
  for (let i = 0; i < commitCount; i++) {
    // Spread commits throughout daytime hours (9 AM - 11 PM) realistic work times
    const hour = 9 + Math.floor(Math.random() * 14);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);
    
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    date.setHours(hour, minute, second, 0);
    
    const isoDate = date.toISOString();
    
    // Make small unique modification
    fs.appendFileSync(trackFile, `${isoDate} | ${commitMessages[Math.floor(Math.random() * commitMessages.length)]}\n`);
    
    // Stage changes
    execSync('git add .');
    
    // Create commit with backdated author and committer timestamps
    const commitMsg = commitMessages[Math.floor(Math.random() * commitMessages.length)];
    
    execSync(`git commit --quiet --date="${isoDate}" -m "${commitMsg}"`, {
      env: {
        ...process.env,
        GIT_COMMITTER_DATE: isoDate,
        GIT_AUTHOR_DATE: isoDate
      }
    });
    
    console.log(`  ✔️  ${commitMsg} @ ${date.toLocaleTimeString()}`);
  }
}

console.log(`\n✅ All commits generated successfully!`);
console.log(`\n📊 GitHub Graph Breakdown:`);
console.log(`   • Dark green days: ${dailyCommitCounts.filter(c => c >=4).length} days (4-5 commits)`);
console.log(`   • Medium green days: ${dailyCommitCounts.filter(c => c ===3).length} days (3 commits)`);
console.log(`   • Light green days: ${dailyCommitCounts.filter(c => c <=2).length} days (1-2 commits)`);
console.log(`\nNow run: git push origin main`);