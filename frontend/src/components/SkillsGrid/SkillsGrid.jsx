import { memo } from 'react';
import { motion as Motion } from 'framer-motion';
import { shouldUseSimpleMotion } from '../../utils/motionProfile';
import "./SkillsGrid.css";

const skills = {
    "Languages": ["C/C++", "C#", "Python", "JavaScript"],
    "Frontend": ["React", "HTML/CSS"],
    "Backend": ["Node.js", "Express", "REST APIs"],
    "Tools & Other": ["Git", "Docker", "Unity", "Unreal Engine", "Jira", "Agile"]
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4
        }
    }
};

function SkillsGrid() {
    const simpleMotion = shouldUseSimpleMotion();

    return (
        <div className="skills-section">
            {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="skill-category">
                    <h3>{category}</h3>
                    {simpleMotion ? (
                        <div className="skill-tags">
                            {items.map((skill) => (
                                <span
                                    key={skill}
                                    className="skill-tag"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <Motion.div
                            className="skill-tags"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            {items.map((skill) => (
                                <Motion.span
                                    key={skill}
                                    className="skill-tag"
                                    variants={itemVariants}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {skill}
                                </Motion.span>
                            ))}
                        </Motion.div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default memo(SkillsGrid);
