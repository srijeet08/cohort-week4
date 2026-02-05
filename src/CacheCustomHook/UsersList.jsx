import { useFetchWithCache } from "./useFetchWithCache";

export default function UsersList() {
  const { data, loading, error, refresh } = useFetchWithCache(
    "https://jsonplaceholder.typicode.com/users"
  );

  console.log("data in UsersList", data);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Users List</h2>
      <button onClick={refresh}>Refresh</button>
      <ul>{data && data.map((user) => <li key={user.id}>{user.name}</li>)}</ul>
    </div>
  );
}
