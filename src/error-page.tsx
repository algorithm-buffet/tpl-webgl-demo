import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>抱歉，发生了一些错误：</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}