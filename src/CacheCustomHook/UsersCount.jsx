import { useFetchWithCache } from "./useFetchWithCache";

export default function UsersCount() {
  const { data } = useFetchWithCache(
    "https://jsonplaceholder.typicode.com/users"
  );

  return <h3>Total Users: {data?.length}</h3>;
}
