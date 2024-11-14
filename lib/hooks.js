import { useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/bookmarks";

export function useHandleBookmark(props) {
  const dispatch = useDispatch();

  function handleClick() {
    if (props.isBookmarked) {
      dispatch(removeBookmark(props));
    } else {
      dispatch(addBookmark(props));
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
