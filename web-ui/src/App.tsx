import React from "react";
import "./App.scss";

function App() {
  return (
    <>
      <header className="header">
        <h1 className="header__title">ZALS</h1>
        <p className="header__subtitle">Zac's Amazing Link Shortener</p>
      </header>

      <main>
        <section className="input-section">
          <h2 className="instructions">
            Simply submit your URL below. We'll take care of the rest.
          </h2>
        </section>

        <section className="output-section">
          <a href="#">Output</a>
        </section>
      </main>
    </>
  );
}

export default App;
