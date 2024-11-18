import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserBookmarksFromDB } from "../reducers/bookmarks";
import styles from "../styles/Bookmarks.module.css";
import Article from "./Article";

function Bookmarks() {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks.value);

  useEffect(() => {
    async function fetchBookmarks() {
      const res = await fetch("http://localhost:3011/displayAllUserBookmarks", {
        credentials: "include",
      });
      const data = await res.json();

      if (data.result) {
        dispatch(getUserBookmarksFromDB(data.bookmarks));
      }
    }
    fetchBookmarks();
  }, []);

  const bookmarkedArticles = bookmarks.map((bookmark) => {
    return <Article {...bookmark} isBookmarked={true} />;
  });

  return (
    <div>
      <Head>
        <title>Morning News - Bookmarks</title>
      </Head>
      <div className={styles.container}>
        {bookmarks.length > 0 ? (
          <div className={styles.bookmarkedArticles}>{bookmarkedArticles}</div>
        ) : (
          <>
            <h2>Bookmarks</h2>
            <p>No bookmark</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
