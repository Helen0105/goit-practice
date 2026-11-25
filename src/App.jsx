import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [text, setText] = useState(() => localStorage.getItem("query") || "");
  const [images, setImages] = useState(
    () => JSON.parse(localStorage.getItem("qwerty")) || [],
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("qwerty", JSON.stringify(images));
    localStorage.setItem("query", text);
  }, [images, text]);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    setImages([]);

    fetch(
      `https://pixabay.com/api/?key=38625269-e94cc3b88596f307f4c7cd69d&q=${text}&image_type=photo&per_page=3&page=${page}`,
    )
      .then((res) => res.json())
      .then((res) => setImages(res.hits));
  };

  const loadMore = () => {
    setPage((prev) => {
      const nextPage = prev + 1;
      fetch(
        `https://pixabay.com/api/?key=38625269-e94cc3b88596f307f4c7cd69d&q=${text}&image_type=photo&per_page=3&page=${nextPage}`,
      )
        .then((res) => res.json())
        .then((res) => setImages((prev) => [...prev, ...res.hits]));
      return nextPage;
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(evt) => setText(evt.target.value)}
          value={text}
          type="text"
          placeholder="your name"
        />
        <button type="submit">send</button>
      </form>
      <ul>
        {images.length === 0 ? (
          <p>НЕМАЄ ДАННИХ</p>
        ) : (
          images.map((itm) => {
            return (
              <li key={itm.id}>
                <img width="300" src={itm.largeImageURL} alt={itm.tags} />
              </li>
            );
          })
        )}
      </ul>

      <button onClick={loadMore} type="button">
        Завантажити ще
      </button>
    </>
  );
}

export default App;
