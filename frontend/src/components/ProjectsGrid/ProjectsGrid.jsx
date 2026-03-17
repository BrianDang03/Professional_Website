import ProjectCard from '../ProjectCard/ProjectCard';
import projects from '../../data/projects';
import './ProjectsGrid.css';

export default function ProjectsGrid() {
    return (
        <div className="projects-grid">
            {projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
            ))}
        </div>
    );
}
