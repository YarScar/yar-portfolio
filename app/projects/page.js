import Link from "next/link";

export default async function ProjectsPage() {
  // TODO: Fetch data from /api/projects
  // Example:
  // const res = await fetch("http://localhost:3000/api/projects", {
  //   cache: 'no-store'
  // });
  // const projects = await res.json();

  // TODO: Display the list of projects
  // Map over projects and display each one with a link to /projects/[id]

  return (
    <div>
      <h1>Projects</h1>
      <p>TODO: Display projects from API</p>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/">← Back to Home</Link>
      </div>
    </div>
  );
}
