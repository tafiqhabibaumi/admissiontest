#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  
  // Simple CSV parser supporting quotes
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length > 0) {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || '';
      });
      rows.push(obj);
    }
  }
  return rows;
}

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        cur += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

function search(query, domain, limit = 10) {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
  const filesToSearch = [];

  const domainMap = {
    style: ['styles.csv', 'ui-reasoning.csv'],
    styles: ['styles.csv', 'ui-reasoning.csv'],
    color: ['colors.csv'],
    colors: ['colors.csv'],
    typography: ['typography.csv', 'google-fonts.csv'],
    ux: ['ux-guidelines.csv'],
    landing: ['landing.csv'],
    motion: ['motion.csv'],
    charts: ['charts.csv'],
    chart: ['charts.csv'],
    icons: ['icons.csv'],
    product: ['products.csv'],
    all: ['styles.csv', 'colors.csv', 'typography.csv', 'ux-guidelines.csv', 'landing.csv', 'motion.csv', 'products.csv']
  };

  const targets = domainMap[domain.toLowerCase()] || domainMap['all'];

  const results = [];

  targets.forEach(filename => {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const rows = parseCSV(content);

      rows.forEach(row => {
        const textToMatch = Object.values(row).join(' ').toLowerCase();
        let matchScore = 0;

        queryTerms.forEach(term => {
          if (textToMatch.includes(term)) {
            matchScore += (term.length > 3 ? 2 : 1);
          }
        });

        if (matchScore > 0 || queryTerms.length === 0) {
          results.push({
            file: filename,
            score: matchScore,
            data: row
          });
        }
      });
    } catch (e) {
      // skip
    }
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

// CLI Interface
const args = process.argv.slice(2);
let query = '';
let domain = 'all';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--domain' && args[i + 1]) {
    domain = args[i + 1];
    i++;
  } else if (!args[i].startsWith('--')) {
    query = args[i];
  }
}

const matches = search(query, domain);
console.log(JSON.stringify(matches, null, 2));
