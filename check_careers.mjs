const https = await import('https');
const url = 'https://gensar-admin.vercel.app/careers.html';

const data = await new Promise((resolve, reject) => {
  https.get(url, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => resolve(d));
  }).on('error', reject);
});

console.log('Has fetch script:', data.includes('API_BASE_CAREERS'));
console.log('Has container:', data.includes('jobListingsContainer'));
console.log('Has initJobBoardFilter:', data.includes('initJobBoardFilter'));

const m = data.match(/id="jobListingsContainer">([\s\S]*?)<\/div>/);
console.log('Container content length:', m ? m[1].trim().length : 'not_found');
console.log('Container empty?', m ? m[1].trim() === '' : 'unknown');

const scripts = data.match(/<script[\s\S]*?<\/script>/g);
console.log('Script blocks:', scripts ? scripts.length : 0);
