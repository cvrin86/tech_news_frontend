import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Article from "./Article";
import TopArticle from "./TopArticle";
import { useSelector } from "react-redux";

function Home() {
  const [topArticle, setTopArticle] = useState({});
  const [articlesData, setArticlesData] = useState([]);

  const bookmarks = useSelector((state) => state.bookmarks.value);

  useEffect(() => {
    fetch("http://localhost:3011/articles", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.slice(1));
      });
  }, []);

  const articles = articlesData.map((data, i) => {
    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.title === data.title
    );
    return <Article key={i} {...data} isBookmarked={isBookmarked} />;
  });

  let topArticleData;
  if (bookmarks.some((bookmark) => bookmark.title === topArticle.title)) {
    topArticleData = <TopArticle {...topArticle} isBookmarked />;
  } else {
    topArticleData = <TopArticle {...topArticle} isBookmarked={false} />;
  }

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>

      {topArticleData}

      <div className={styles.articlesContainer}>{articles}</div>
    </div>
  );
}

export default Home;
