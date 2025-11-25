import Link from "next/link";

export default async function ProjectDetailPage({ params }) {
  // TODO: Fetch data from /api/projects/[id]
  // Example:
  // const res = await fetch(`http://localhost:3000/api/projects/${params.id}`, {
  //   cache: 'no-store'
  // });
  // const project = await res.json();

  // TODO: Handle 404 case if project not found

  // TODO: Display the project details

  return (
    <div>
      <h1>Project Detail</h1>
      <p>TODO: Display project with ID: {params.id}</p>
      <nav style={{ marginTop: '2rem' }}>
        <Link href="/projects">← Back to Projects</Link>
      </nav>
    </div>
  );
}
