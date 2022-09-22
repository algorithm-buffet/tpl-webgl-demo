/**
 * demo 统一包装器
 */
import {
  useFetcher,
  useLoaderData,
} from "react-router-dom";

import "./wrapper.less";

export function Favorite({ demo }: any) {
  const fetcher = useFetcher();
  let favorite = demo.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  return (
    <fetcher.Form method="post">
      <button
        className="normalBtn"
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}


export default function(props: any) {
    const {demo, pathArr} = useLoaderData() as any;
    return <div id="demo-detail">
        <div className="demo-wrapper">
            {props.children}
        </div>
        <div className="demo-bar"><Favorite demo={demo}/></div>
    </div>
}