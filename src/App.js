import React, { useState, useEffect, useRef } from 'react';
import {ACCESS_KEY, API_URL} from './credentials';
import axios from 'axios';
import './App.css';

function App() {

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const loader = useRef(null);

  const fetchImages = () => {
    axios.get(`${API_URL}/photos/?client_id=${ACCESS_KEY}&per_page=20&page=${page}`)
    .then(response => setImages([...images, ...response.data]));
  }

  const searchImages = () => {
    axios.get(`${API_URL}/search/photos/?client_id=${ACCESS_KEY}&per_page=20&page=${page}&query=${query}`)
    .then(response => setImages([...images, ...response.data.results]));
  }

  const handleClick = newQuery => {
    if (newQuery !== query) {
      setImages([]);
      setPage(1);
    }
    setQuery(newQuery);
  };

  const handleObserver = entities => {
    const target = entities[0];

    if (target.intersectionRatio > 0) {
      setPage(page => page + 1);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      treshold: 1.0
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }
  }, []);

  useEffect(() => {
    if (query) {
      searchImages();
    } else {
      fetchImages();
    }
  }, [page, query]);

  return (
    <div className="container">
      <header className="header">
        <h1>Fancy Gallery</h1>
      </header>
      <div className="tags">
        <button onClick={() => handleClick("cats")}>Cats</button>
        <button onClick={() => handleClick("dogs")}>Dogs</button>
        <button onClick={() => handleClick("coffee")}>Coffee</button>
        <button onClick={() => handleClick("react")}>React</button>
        <button onClick={() => handleClick("")}>Random</button>
      </div>
      <div className="image-grid"> 
        {images.map(image => {
          const {id, alt_description, urls, color} = image;
          return (
            <div className="image-item" key={id} style={{backgroundColor: color}}>
              <img src={urls.small} alt={alt_description} />
            </div>
          );
        })}
      </div>
      <div ref={loader}>Loading...</div>
    </div>
  );
}

export default App;
