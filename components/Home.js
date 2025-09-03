import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserBookmarksFromDB,
  removeAllBookmarks,
} from "../reducers/bookmarks";
import styles from "../styles/Home.module.css";
import Article from "./Article";
import TopArticle from "./TopArticle";

function Home() {
  const dispatch = useDispatch();
  const [topArticle, setTopArticle] = useState({});
  const [articlesData, setArticlesData] = useState([]);
  const bookmarks = useSelector((state) => state.bookmarks.value);
  const user = useSelector((state) => state.user.value);

  const [visibleArticles,setVisiblesArticles] = useState(10);

  const api=process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // This effect will run when the user is connected
    if (user.isConnected) {
      fetch(`${api}/displayAllUserBookmarks`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch(getUserBookmarksFromDB(data.bookmarks));
        });
    } else {
      dispatch(removeAllBookmarks());
    }
  }, [user.isConnected]);

useEffect(() => {
  fetch(`${api}/articles`, {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Réponse backend /articles:", data); // 👈 vérifie ici
      if (data.articles && data.articles.length > 0) {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.slice(1));
      } else if (Array.isArray(data) && data.length > 0) {
        // Si ton backend renvoie directement un tableau
        setTopArticle(data[0]);
        setArticlesData(data.slice(1));
      } else {
        setTopArticle(null);
        setArticlesData([]);
      }
    })
    .catch((err) => {
      console.error("Erreur fetch /articles:", err);
    });
}, []);

// ← Ajoute ce useEffect pour le scroll
useEffect(() => {
  // Fonction appelée à chaque scroll de la page
  const handleScroll = () => {
    // Vérifie si l'utilisateur est proche du bas de la page (100px avant la fin)
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    ) {
      // Si oui, augmente le nombre d'articles affichés de 20 (sans dépasser le total)
      setVisiblesArticles((prev) =>
        prev + 20 > articlesData.length ? articlesData.length : prev + 20
      );
    }
  };

  // Ajoute l'écouteur d'événement scroll à la fenêtre
  window.addEventListener("scroll", handleScroll);

  // Nettoie l'écouteur quand le composant est démonté ou quand articlesData change
  return () => window.removeEventListener("scroll", handleScroll);
}, [articlesData.length]); 

  const articles = articlesData.slice(1,visibleArticles).map((data, i) => {

    const isBookmarked = bookmarks?.some(
      (bookmark) => bookmark.title === data.title
    );
    return <Article key={i} {...data} isBookmarked={isBookmarked} />;
  });

  let topArticleData;
  if (bookmarks?.some((bookmark) => bookmark.title === topArticle.title)) {
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
