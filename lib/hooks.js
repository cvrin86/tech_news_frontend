import { useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/bookmarks";

/**
 * Custom hook to handle bookmark actions.
 *
 * @param {Object} props - The properties passed to the hook.
 * @param {boolean} props.isBookmarked - Indicates if the item is already bookmarked.
 * @returns {Object} - An object containing the handleClick function and iconColor style.
 */
export function useHandleBookmark(props) {
  const dispatch = useDispatch();

  const api=process.env.NEXT_PUBLIC_API_URL;

  async function handleClick() {
    const res = await fetch(`${api}/users/canBookmark`, {
      method:"GET",
      credentials: "include",
    });
    const canBookmark = await res.json();

    if (canBookmark.result) {
      if (props.isBookmarked) {
        const res = await fetch(`${api}/deleteBookmark`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(props),
        });

        await res.json();
        dispatch(removeBookmark(props));
      } else {
        const res = await fetch(`${api}/addBookmark`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(props),
        });

        await res.json();
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
