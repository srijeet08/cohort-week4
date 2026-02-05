import RenderNode from "./RenderNode/RenderNode";
import UsersList from "./CacheCustomHook/UsersList";
import UsersCount from "./CacheCustomHook/UsersCount";

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <RenderNode />
      <div style={{ padding: 20 }}>
        <h1>useFetchWithCache Demo</h1>

        <UsersList />
        <UsersCount />
      </div>
    </div>
  );
}
