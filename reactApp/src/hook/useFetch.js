import { useState, useEffect } from "react";

export const useFetch = (api, queryTerm = "") => {
  const [data, setData] = useState([]);
  const url = ``;
  useEffect(() => {
    async function fetcData() {
      const response = await fetch(url);
      const json = await response.json();
      setData(json.results);
    }
    fetchData();
  }, [url]);
  return { data };
};
