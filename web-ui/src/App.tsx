import React, { useState } from "react";
import "./App.scss";

function App() {
  const [longUrl, setLongUrl] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(`Long-ish URL given: ${longUrl}`);
  };

  return (
    <>
      <header className="header">
        <h1 className="header__title">ZALS</h1>
        <p className="header__subtitle">Zac's Amazing Link Shortener</p>
      </header>

      <main>
        <section className="input-section">
          <h2 className="instructions">
            Simply submit your URL below and we'll take care of the rest.
          </h2>

          <form className="url-input-form" onSubmit={handleSubmit}>
            <input
              className="url-input-form__url-input"
              type="text"
              value={longUrl}
              onChange={(event) => setLongUrl(event.target.value)}
            />

            <input
              className="url-input-form__submit"
              type="submit"
              value="Shorten"
            />
          </form>
        </section>

        <section className="output-section">
          <a href="#">Output</a>
        </section>
      </main>
    </>
  );
}

export default App;
