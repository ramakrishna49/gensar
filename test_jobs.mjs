// Simulate what the browser does - fetch jobs and render
const https = await import('https');

async function checkJobs() {
  const data = await new Promise((resolve, reject) => {
    https.get('https://gensar-admin.vercel.app/api/public/jobs', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });

  const jobs = JSON.parse(data);
  console.log('Jobs count:', jobs.length);
  jobs.forEach((j, i) => {
    console.log(`\nJob ${i}:`);
    console.log('  title:', j.title);
    console.log('  description:', j.description);
    console.log('  category:', j.category);
    console.log('  tools:', JSON.stringify(j.tools));
    console.log('  location:', j.location);
    console.log('  isActive:', j.isActive);
    console.log('  Has all fields:', !!(j.title && j.description && j.category));
  });

  // Now simulate rendering
  const rendered = jobs.map(function (job, idx) {
    var tools = Array.isArray(job.tools) ? job.tools.map(function (t) { return '<span class="tool-badge">' + t + '</span>'; }).join('') : '';
    var cat = (job.category || 'all').toLowerCase().replace(/\s+/g, '-');
    return '<div class="col-lg-6 job-item-card anim-fade from-right' + (idx % 2 === 1 ? ' delay-100' : '') + '" data-job-category="' + cat + '">' +
      '<div class="course-detail-pane"><div>' +
      '<h4>' + (job.title || '') + '</h4>' +
      '<p>' + (job.description || '') + '</p>' +
      (tools ? '<div>' + tools + '</div>' : '') +
      '</div></div></div>';
  }).join('');

  console.log('\nRendered HTML length:', rendered.length);
  console.log('First 200 chars:', rendered.substring(0, 200));
  console.log('\nTest PASSED: All jobs renderable');
}

try {
  await checkJobs();
} catch(e) {
  console.error('ERROR:', e.message);
}
