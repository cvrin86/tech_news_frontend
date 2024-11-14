import Head from "next/head";
import styles from "../styles/Bookmarks.module.css";
import { useSelector } from "react-redux";
import Article from "./Article";

function Bookmarks() {
  const bookmarks = useSelector((state) => state.bookmarks.value);

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
