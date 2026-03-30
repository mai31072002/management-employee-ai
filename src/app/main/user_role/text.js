import { useEffect, useState } from "react";

function UserList() {
  const [data, setData] = useState([]);       // lưu dữ liệu
  const [loading, setLoading] = useState(false); // trạng thái loading
  const [error, setError] = useState(null);   // lỗi

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://api.com/users");
        const result = await res.json();

        setData(result);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // render UI
  if (loading) return <div>Loading...</div>; // hoặc Spin của Antd
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default UserList;