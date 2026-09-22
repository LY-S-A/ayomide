import React from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import projects from "../data/projects";
import "../styles/project-details.css";

const ProjectDetails = () => {
    const { projectId } = useParams();

    const project = projects.find(
        (item) => item.id === projectId
    );

    if (!project) {
        return (
            <div className="project-details-page">
                <header className="project-details-header">
                    <Link
                        to="/"
                        className="project-back-link"
                    >
                        <FiArrowLeft />
                        <span>BACK TO HOME</span>
                    </Link>
                </header>

                <main className="project-not-found">
                    <p className="project-eyebrow">
                        PROJECT
                    </p>

                    <h1>Not Found</h1>

                    <p>
                        The project you're looking for
                        doesn't exist.
                    </p>

                    <Link
                        to="/"
                        className="project-home-link"
                    >
                        Return Home
                        <FiArrowUpRight />
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="project-details-page">

            {/* HEADER */}

            <header className="project-details-header">

                <Link
                    to="/"
                    className="project-back-link"
                >
                    <FiArrowLeft />
                    <span>BACK TO HOME</span>
                </Link>

                {project.category && (
                    <span className="project-header-label">
                        {project.category}
                    </span>
                )}

            </header>


            {/* MAIN */}

            <main className="project-details-main">

                {/* HERO */}

                <section className="project-details-hero">

                    {project.category && (
                        <p className="project-eyebrow">
                            {project.category}
                        </p>
                    )}

                    <h1>
                        {project.title}
                    </h1>

                    {project.description && (
                        <p className="project-intro">
                            {project.description}
                        </p>
                    )}

                </section>


                {/* META */}

                {project.meta?.length > 0 && (
                    <section className="project-meta">

                        {project.meta.map((item, index) => (
                            <div
                                className="project-meta-item"
                                key={index}
                            >
                                <span>
                                    {item.label}
                                </span>

                                <p>
                                    {item.value}
                                </p>
                            </div>
                        ))}

                    </section>
                )}


                {/* OVERVIEW */}

                {project.overview?.length > 0 && (
                    <section className="project-section">

                        <div className="project-section-number">
                            01
                        </div>

                        <div className="project-section-content">

                            <h2>
                                {project.overviewTitle ||
                                    "Overview"}
                            </h2>

                            {project.overview.map(
                                (paragraph, index) => (
                                    <p key={index}>
                                        {paragraph}
                                    </p>
                                )
                            )}

                        </div>

                    </section>
                )}


                {/* FEATURES */}

                {project.features?.length > 0 && (
                    <section className="project-section">

                        <div className="project-section-number">
                            02
                        </div>

                        <div className="project-section-content">

                            <h2>
                                {project.featuresTitle ||
                                    "Features"}
                            </h2>

                            <div className="project-feature-list">

                                {project.features.map(
                                    (feature, index) => (
                                        <div
                                            className="project-feature"
                                            key={index}
                                        >
                                            <span>
                                                {(
                                                    index + 1
                                                )
                                                    .toString()
                                                    .padStart(
                                                        2,
                                                        "0"
                                                    )}
                                            </span>

                                            <p>
                                                {feature}
                                            </p>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    </section>
                )}


                {/* SCREENSHOTS */}

                {project.screenshots?.length > 0 && (
                    <section className="project-section project-interface-section">

                        <div className="project-section-number">
                            03
                        </div>

                        <div className="project-section-content">

                            <h2>
                                {project.interfaceTitle ||
                                    "Interface"}
                            </h2>

                            {project.interfaceDescription && (
                                <p className="project-interface-intro">
                                    {
                                        project.interfaceDescription
                                    }
                                </p>
                            )}

                            <div className="project-screenshot-grid">

                                {project.screenshots.map(
                                    (screenshot, index) => (
                                        <div
                                            className="project-screenshot"
                                            key={index}
                                        >

                                            {screenshot.image ? (
                                                <img
                                                    src={
                                                        screenshot.image
                                                    }
                                                    alt={
                                                        screenshot.title ||
                                                        project.title
                                                    }
                                                />
                                            ) : (
                                                <div className="project-screenshot-placeholder">
                                                    SCREENSHOT
                                                </div>
                                            )}

                                            {screenshot.title && (
                                                <p>
                                                    {
                                                        screenshot.title
                                                    }
                                                </p>
                                            )}

                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    </section>
                )}


                {/* TECHNOLOGY */}

                {project.technologies?.length > 0 && (
                    <section className="project-section">

                        <div className="project-section-number">
                            04
                        </div>

                        <div className="project-section-content">

                            <h2>
                                {project.technologyTitle ||
                                    "Technology"}
                            </h2>

                            <div className="project-tech-list">

                                {project.technologies.map(
                                    (technology, index) => (
                                        <div
                                            className="project-tech-item"
                                            key={index}
                                        >
                                            <strong>
                                                {
                                                    technology.name
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    technology.role
                                                }
                                            </span>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    </section>
                )}


                {/* OPTIONAL PROJECT LINK */}

                {project.liveUrl && (
                    <section className="project-live-section">

                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="project-live-link"
                        >
                            <span>
                                {project.liveLabel ||
                                    "VIEW PROJECT"}
                            </span>

                            <FiArrowUpRight />
                        </a>

                    </section>
                )}


                {/* END */}

                <section className="project-details-end">

                    {project.endText && (
                        <p>
                            {project.endText}
                        </p>
                    )}

                    {project.technologyLabel && (
                        <span className="project-built-label">
                            {project.technologyLabel}
                        </span>
                    )}

                </section>

            </main>


            {/* FOOTER */}

            <footer className="home-footer">

        <p>
          © {new Date().getFullYear()} · Ayomide
        </p>

      </footer>

        </div>
    );
};

export default ProjectDetails;
