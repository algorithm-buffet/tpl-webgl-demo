import { useEffect } from "react";
import { Outlet, useLoaderData, NavLink, useNavigation, Form, useSubmit } from "react-router-dom";

export default function Root() {
  const { demos, q } = useLoaderData() as any;
  const navigation = useNavigation();

  const submit = useSubmit();


  useEffect(() => {
    // @ts-ignore
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>WebGL Demos</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search demos"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = !q;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>

          </Form>
        </div>
        <nav>
            {demos.map((demo: any)=>{
                const {title, category, comps} = demo;
                return <div id="demo-list-wrap" key={category}>
                    <p className="list-title">{title}</p>
                    <ul>
                    {comps.map((comp: any)=>{
                        return <li key={comp.path}>
                            <NavLink
                                to={`/${category}/${comp.path}?q=${q}`}
                                className={({ isActive, isPending }) =>
                                isActive
                                    ? "active"
                                    : isPending
                                    ? "pending"
                                    : ""
                                }
                            >
                               {comp.title} {comp.favorite ? "★" : ""}
                            </NavLink>
                            {/* <a href={`/${category}/${comp.path}`}>{comp.title}</a> */}
                        </li>
                    })}
                    </ul>
                </div>
            })}
          {/* <ul>
            <li>
              <a href={`/twgl/2df`}>2D-F(twgl)</a>
            </li>
            <li>
              <a href={`/normal/3df`}>3D-F</a>
            </li>
          </ul> */}
        </nav>
      </div>
      <div 
        id="detail" 
        className={
          navigation.state === "loading" ? "loading" : ""
        }>
        <Outlet />
      </div>
    </>
  );
}
