import React, { useState } from "react";
import "../styles/notes.css";

const initialEntries = [
    {
        name: "John",
        message: "Really like the simplicity of your website.",
        date: "AUG 18, 2026",
    },
    {
        name: "Sarah",
        message: "Keep building. Your work is inspiring.",
        date: "AUG 17, 2026",
    },
];

const Notes = () => {
    const [entries, setEntries] = useState(initialEntries);

    const [formData, setFormData] = useState({
        name: "",
        message: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.message.trim()
        ) {
            return;
        }

        setSubmitting(true);

        setTimeout(() => {
            const newEntry = {
                name: formData.name.trim(),
                message: formData.message.trim(),
                date: "AUG 18, 2026",
            };

            setEntries((previous) => [
                newEntry,
                ...previous,
            ]);

            setFormData({
                name: "",
                message: "",
            });

            setSubmitting(false);
        }, 500);
    };

    return (
        <div className="notes-page">

            {/* ========================================
          HEADER
      ======================================== */}

            <header className="notes-header">

                <a
                    href="/"
                    className="notes-brand"
                >
                    Ayomide
                </a>

                <nav className="notes-nav">

                    <a
                        href="/"
                        className="notes-nav-link"
                    >
                        HOME
                    </a>

                    <a
                        href="/guestbook"
                        className="notes-nav-link active"
                    >
                        NOTES
                    </a>

                </nav>

            </header>


            {/* ========================================
          MAIN
      ======================================== */}

            <main className="notes-main">

                {/* ========================================
            INTRO
        ======================================== */}

                <section className="notes-intro">

                    <p className="notes-eyebrow">
                        NOTES
                    </p>

                    <h1>
                        Leave a note.
                    </h1>

                    <p>
                        Say hello, leave a thought, or just let me
                        know you stopped by.
                    </p>

                </section>


                {/* ========================================
            FORM
        ======================================== */}

                <section className="notes-form-section">

                    <form
                        className="notes-form"
                        onSubmit={handleSubmit}
                    >

                        {/* NAME */}

                        <div className="notes-field">

                            <label htmlFor="name">
                                NAME
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                maxLength={50}
                                autoComplete="name"
                                required
                            />

                        </div>


                        {/* MESSAGE */}

                        <div className="notes-field">

                            <label htmlFor="message">
                                MESSAGE
                            </label>

                            <textarea
                                id="message"
                                name="message"
                                placeholder="Write something..."
                                value={formData.message}
                                onChange={handleChange}
                                maxLength={500}
                                rows={5}
                                required
                            />

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="notes-submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "SIGNING..."
                                : "SIGN GUESTBOOK ↗"}
                        </button>

                    </form>

                </section>


                {/* ========================================
            MESSAGES
        ======================================== */}

                <section className="notes-entries">

                    <div className="notes-section-header">

                        <h2>
                            Messages
                        </h2>

                        <span>
                            {entries.length}
                        </span>

                    </div>


                    <div className="notes-entry-list">

                        {entries.map((entry, index) => (

                            <article
                                className="notes-entry"
                                key={`${entry.name}-${index}`}
                            >

                                <div className="notes-entry-top">

                                    <h3>
                                        {entry.name}
                                    </h3>

                                    <span>
                                        {entry.date}
                                    </span>

                                </div>

                                <p>
                                    {entry.message}
                                </p>

                            </article>

                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Notes;