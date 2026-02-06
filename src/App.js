import RenderNode from "./RenderNode/RenderNode";
import UsersList from "./CacheCustomHook/UsersList";
import UsersCount from "./CacheCustomHook/UsersCount";
// import SearchAutocomplete from "./base/SearchAutocomplete/SearchAutocomplete";
import SearchAutocomplete from "./SearchAutocomplete/SearchAutocomplete";

import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>

      <RenderNode />
      {/* <div style={{ padding: 20 }}>
        <h1>useFetchWithCache Demo</h1>

        <UsersList />
        <UsersCount />
      </div> */}
      <div style={{ padding: 20 }}>
        <SearchAutocomplete />
      </div>
    </div>
  );
}
