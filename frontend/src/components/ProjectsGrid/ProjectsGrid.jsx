import ProjectCard from '../ProjectCard/ProjectCard';
import projects from '../../data/projects';
import './ProjectsGrid.css';

export default function ProjectsGrid() {
    return (
        <>
            <div className="tech-legend" aria-label="Technology badge color legend">
                <span className="tech-legend-label">Badge Colors:</span>
                <ul className="tech-legend-list" role="list">
                    <li className="tech-legend-item">
                        <span className="tech-legend-dot tech-legend-dot-blue" aria-hidden="true" />
                        <span className="tech-legend-term">Frontend/UI</span>
                        <span className="tech-legend-desc">browser interfaces</span>
                    </li>
                    <li className="tech-legend-item">
                        <span className="tech-legend-dot tech-legend-dot-green" aria-hidden="true" />
                        <span className="tech-legend-term">Backend/APIs</span>
                        <span className="tech-legend-desc">server logic and integrations</span>
                    </li>
                    <li className="tech-legend-item">
                        <span className="tech-legend-dot tech-legend-dot-purple" aria-hidden="true" />
                        <span className="tech-legend-term">Systems/Native</span>
                        <span className="tech-legend-desc">engines, C++, and build tooling</span>
                    </li>
                    <li className="tech-legend-item">
                        <span className="tech-legend-dot tech-legend-dot-amber" aria-hidden="true" />
                        <span className="tech-legend-term">Data/Infra/Automation</span>
                        <span className="tech-legend-desc">platform, data, and workflow ops</span>
                    </li>
                </ul>
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <ProjectCard key={project.title} project={project} />
                ))}
            </div>
        </>
    );
}
