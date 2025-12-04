import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getAllProjects } from '../lib/projects.js';

(async () => {
  try {
    console.log('Using DATABASE_URL=', process.env.DATABASE_URL ? '[present]' : '[missing]');
    const projects = await getAllProjects();
    console.log('Found projects count:', Array.isArray(projects) ? projects.length : 'not an array');
    console.log(JSON.stringify(projects, null, 2));
  } catch (err) {
    console.error('Error querying projects:', err);
    process.exitCode = 1;
  }
})();