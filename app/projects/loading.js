export default function ProjectsLoading() {
	return (
		<section>
			<h1 style={{ margin: 0, color: 'var(--color-text-light)' }}>Projects</h1>
			<p style={{ marginTop: '0.5rem', color: 'var(--color-text)' }}>
				Selected projects & case studies — click to view details.
			</p>

			<div className="projects-loading" role="status" aria-live="polite" aria-label="Loading projects">
				<span className="projects-spinner" aria-hidden="true" />
				<span>Loading projects…</span>
			</div>
		</section>
	);
}
