import React, { useState } from "react";
import "./App.scss";
import { ReactComponent as CopyIcon } from "./images/copy-icon.svg";
import { ReactComponent as CheckIcon } from "./images/check-icon.svg";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string>();
  const [shortenedPercentage, setShortenedPercentage] = useState<number>();
  const [showCopiedCheck, setShowCopiedCheck] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    const { shortenedUrl, originalLength, shortenedLength } = await (
      await fetch(`http://localhost:3001/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          longUrl,
        }),
      })
    ).json();
    setIsLoading(false);

    setShortUrl(shortenedUrl);

    setShortenedPercentage(
      Math.floor(100 * ((originalLength - shortenedLength) / originalLength))
    );
  };

  const copyShortLinkToClipboard = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setShowCopiedCheck(true);
      setTimeout(() => setShowCopiedCheck(false), 5000);
    }
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

        {(shortUrl || isLoading) && (
          <section className="output-section">
            <div className="output-section__container">
              <h2 className="output-header">
                {isLoading ? "Loading..." : "Here you go!"}
              </h2>
              <p className="output-subheader">
                {isLoading
                  ? "Waiting for your URL to be shortened..."
                  : `Shortened your URL by ${shortenedPercentage}%!`}
              </p>

              {isLoading ? (
                <div className="short-url-output--loading"></div>
              ) : (
                <div className="short-url-output">
                  <a className="short-url-output__short-url" href={shortUrl}>
                    {shortUrl}
                  </a>
                  <button
                    className="short-url-output__copy-button"
                    onClick={copyShortLinkToClipboard}
                  >
                    {showCopiedCheck ? (
                      <CheckIcon className="check-icon" />
                    ) : (
                      <CopyIcon className="copy-icon" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default App;
