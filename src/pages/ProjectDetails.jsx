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
          <Link to="/" className="project-back-link">
            <FiArrowLeft />
            <span>BACK TO HOME</span>
          </Link>
        </header>

        <main className="project-not-found">
          <p className="project-eyebrow">PROJECT</p>

          <h1>Not Found</h1>

          <p>
            The project you're looking for doesn't exist.
          </p>

          <Link to="/" className="project-home-link">
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
        <Link to="/" className="project-back-link">
          <FiArrowLeft />
          <span>BACK TO HOME</span>
        </Link>

        <span className="project-header-label">
          {project.category}
        </span>
      </header>

      <main className="project-details-main">
        {/* HERO */}
        <section className="project-details-hero">
          <p className="project-eyebrow">
            {project.category}
          </p>

          <h1>
            {project.title || project.name}
          </h1>

          <p className="project-intro">
            {project.description}
          </p>
        </section>

        {/* PROJECT META */}
        <section className="project-meta">
          {project.type && (
            <div className="project-meta-item">
              <span>TYPE</span>
              <p>{project.type}</p>
            </div>
          )}

          {project.platform && (
            <div className="project-meta-item">
              <span>PLATFORM</span>
              <p>{project.platform}</p>
            </div>
          )}

          {project.technology && (
            <div className="project-meta-item">
              <span>TECHNOLOGY</span>
              <p>{project.technology}</p>
            </div>
          )}

          {project.role && (
            <div className="project-meta-item">
              <span>ROLE</span>
              <p>{project.role}</p>
            </div>
          )}
        </section>

        {/* OVERVIEW */}
        {project.overview?.length > 0 && (
          <section className="project-section">
            <div className="project-section-number">
              01
            </div>

            <div className="project-section-content">
              <h2>Overview</h2>

              {project.overview.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
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
              <h2>Features</h2>

              <div className="project-feature-list">
                {project.features.map((feature, index) => (
                  <div
                    className="project-feature"
                    key={index}
                  >
                    <span>
                      {(index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </span>

                    <p>{feature}</p>
                  </div>
                ))}
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
              <h2>Interface</h2>

              {project.interfaceDescription && (
                <p className="project-interface-intro">
                  {project.interfaceDescription}
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
                          src={screenshot.image}
                          alt={
                            screenshot.title ||
                            `${project.name} screenshot`
                          }
                        />
                      ) : (
                        <div className="project-screenshot-placeholder">
                          SCREENSHOT
                        </div>
                      )}

                      {screenshot.title && (
                        <p>{screenshot.title}</p>
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
              <h2>Technology</h2>

              <div className="project-tech-list">
                {project.technologies.map(
                  (technology, index) => (
                    <div
                      className="project-tech-item"
                      key={index}
                    >
                      <strong>
                        {technology.name}
                      </strong>

                      <span>
                        {technology.role}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* OPTIONAL LINK */}
        {project.liveUrl && (
          <section className="project-live-section">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="project-live-link"
            >
              <span>VIEW PROJECT</span>
              <FiArrowUpRight />
            </a>
          </section>
        )}

        {/* END */}
        <section className="project-details-end">
          <p>
            {project.endText ||
              `Built as a ${project.type?.toLowerCase() || "digital project"}.`}
          </p>

          {project.technology && (
            <span className="project-built-label">
              {project.technology}
            </span>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="project-details-footer">
        <Link to="/">Ayomide</Link>

        <span>
          © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
};

export default ProjectDetails;
