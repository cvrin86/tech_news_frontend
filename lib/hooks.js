import { useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/bookmarks";

export function useHandleBookmark(props) {
  const dispatch = useDispatch();

  async function handleClick() {
    const res = await fetch("http://localhost:3011/users/canBookmark", {
      credentials: "include",
    });
    const canBookmark = await res.json();

    if (canBookmark.result) {
      if (props.isBookmarked) {
        dispatch(removeBookmark(props));
      } else {
        dispatch(addBookmark(props));
      }
    }
  }

  let iconColor;
  if (props.isBookmarked) {
    iconColor = { color: "#E9B959" };
  } else {
    iconColor = { color: "black" };
  }

  return { handleClick, iconColor };
}
