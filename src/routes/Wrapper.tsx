/**
 * demo 统一包装器
 */
import {
  useFetcher,
  useLoaderData,
} from "react-router-dom";

import "./wrapper.less";

interface IReferLinks {
  reference?: string | string[];
}
const ReferLinks = (props: IReferLinks) => {
  const { reference } = props;
  const references = ([] as string[]).concat(reference || []);

  return (
    references.length > 0 ? 
      <div className="references-wrapper">
        {references.map((curReference: string, idx) => {
          const linkArr = curReference.split('|');
          return (
            <a key={idx} className="references-link" target="_blank" href={linkArr[1]}>{linkArr[0]}</a>
          )
        })}
      </div>
     : null
  )
}

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

      <ReferLinks reference={demo.reference}/>
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