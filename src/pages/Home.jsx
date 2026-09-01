import React from "react";
import SpotifyPlayer from "../components/SpotifyPlayer";
import "../styles/home.css";

import { FiArrowUpRight } from "react-icons/fi";

const projects = [
  {
    name: "NUMIO",
    url: "NUMIOVERIFY.STORE",
    description:
      "SMS verification and virtual number platform.",
    link: "https://www.numioverify.store",
  },
  {
    name: "RealSMS",
    url: "REALSMS.STORE",
    description:
      "A modern SMS verification platform built for developers and remote workers.",
    link: "https://realsms.store",
  },
  {
    name: "FLIX DIGITALS",
    url: "FLIXDIGITALS.COM",
    description:
      "A landing page for a tech agency.",
    link: "https://flixdigitals.vercel.app",
  },
];

const Home = () => {
  return (
    <div className="home-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="home-header">

        <a href="/" className="home-brand">
          Ayomide
        </a>

        <nav className="home-nav">

          <a
            href="/"
            className="home-nav-link active"
          >
            HOME
          </a>

          <a
            href="/notes"
            className="home-nav-link"
          >
            NOTES
          </a>

        </nav>

      </header>


      {/* ========================================
          MAIN
      ======================================== */}

      <main className="home-main">

        {/* ========================================
            HERO
        ======================================== */}

        <section className="home-hero">

          <p className="home-eyebrow">
            WEB DEVELOPER
          </p>

          <h1>
            Ayomide
          </h1>

         <p className="home-intro">
  I build high-converting landing pages and fully functional websites that
  solve real problems.
</p>


          {/* SOCIAL LINKS */}

          <div className="home-socials">

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <span>·</span>

            <a href="mailto:yekeenolalekan123@gmail.com">
              Email
            </a>

            <span>·</span>

            <a
              href="https://x.com/ay30bg"
              target="_blank"
              rel="noreferrer"
            >
              X
            </a>

          </div>

        </section>


        {/* ========================================
            MUSIC
        ======================================== */}

         <SpotifyPlayer />


        {/* ========================================
            PROJECTS
        ======================================== */}

        <section className="home-projects">

          <div className="home-section-header">

            <h2>
              Projects
            </h2>

          </div>


          <div className="home-project-list">

            {projects.map((project, index) => (

              <a
                href={project.link}
                className="home-project"
                key={index}
              >

                <div className="home-project-info">

                  <h3>
                    {project.name}
                  </h3>

                  <span className="home-project-url">
                    {project.url}
                  </span>

                  <p>
                    {project.description}
                  </p>

                </div>


                <span className="home-project-arrow">
                    <FiArrowUpRight />
                </span>

              </a>

            ))}

          </div>

        </section>

      </main>


      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="home-footer">

        <p>
          © {new Date().getFullYear()} · Ayomide
        </p>

      </footer>

    </div>
  );
};

export default Home;
