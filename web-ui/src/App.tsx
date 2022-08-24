import React, { useState } from "react";
import "./App.scss";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string>();
  const [shortenedPercentage, setShortenedPercentage] = useState<number>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    const { shortenedUrl, originalLength, shortenedLength } = {
      shortenedUrl: longUrl,
      originalLength: longUrl.length,
      shortenedLength: longUrl.length,
    };
    // const { shortenedUrl, originalLength, shortenedLength } = await (
    //   await fetch("http://localhost:3001/shorten", {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       longUrl,
    //     }),
    //   })
    // ).json();
    setIsLoading(false);

    setShortUrl(shortenedUrl);

    setShortenedPercentage(
      Math.floor(100 * ((originalLength - shortenedLength) / originalLength))
    );
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

        {isLoading ? (
          <section className="output-section--loading">
            <div className="output-section--loading__container">
              <div className="output-section--loading__skeleton-loader-line"></div>
            </div>
          </section>
        ) : (
          shortUrl && (
            <section className="output-section">
              <div className="short-url-output">
                <a className="short-url-output__short-url" href={shortUrl}>
                  {shortUrl}
                </a>
                <button
                  className="short-url-output__copy-button"
                  onClick={() => alert("ayo")}
                >
                  <img
                    src={require("./images/copy-icon.png")}
                    alt="Copy Shortened URL"
                  />
                </button>
              </div>
            </section>
          )
        )}
      </main>
    </>
  );
}

export default App;
