import { useState, useEffect } from "react";

import { useDebounce } from "./useDebounce";

const cache = {};

export default function SearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  //API
  const fetchSuggestions = async (q) => {
    const response = await fetch(
      `https://api.datamuse.com/sug?s=${encodeURIComponent(q)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await response.json();

    //extract only word
    return data.map((d) => d.word);
  };

  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions([]);
      return;
    }

    //fetch from cache
    if (cache[debouncedQuery]) {
      setSuggestions(cache[debouncedQuery]);
      return;
    }

    const loadSuggestions = async () => {
      try {
        setLoading(true);
        const res = await fetchSuggestions(debouncedQuery);
        cache[debouncedQuery] = res;
        setSuggestions(res);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [debouncedQuery]);

  const selectSuggestion = (value) => {
    setQuery(value);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!open) {
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case "Enter":
        if (activeIndex >= 0) {
          selectSuggestion(suggestions[activeIndex]);
        }
        break;

      case "Escape":
        setOpen(false);
        break;

      default:
        break;
    }
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 100);
  };

  return (
    <div style={{ width: 300, position: "relative" }}>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="Type to Search words...."
        style={{ width: "100%", padding: 8 }}
      />

      {open && (loading || suggestions.length > 0) && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ccc",
            position: "absolute",
            width: "100%",
            background: "#fff",
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {loading && <li style={{ padding: 8 }}>Loading...</li>}

          {suggestions.map((item, index) => (
            <li
              key={item}
              onMouseDown={() => selectSuggestion(item)}
              style={{
                padding: 8,
                cursor: "pointer",
                background: index === activeIndex ? "#e6f2ff" : "transparent",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
