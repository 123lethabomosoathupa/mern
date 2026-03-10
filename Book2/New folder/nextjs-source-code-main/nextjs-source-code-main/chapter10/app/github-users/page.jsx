import Link from "next/link";

async function fetchGitHubUsers() {
  const res = await fetch("https://api.github.com/search/users?q=J4d4");
  const json = await res.json();
  return json.items;
}

const GitHubUsersPage = async () => {
  const users = await fetchGitHubUsers();
  console.log(users);
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th> <th>URL</th> <th>Repos</th> <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center spacex-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={user.avatar_url} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold"> {user.login}</div>
                      <div className="text-sm opacity-50"> {user.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <Link href={user.html_url} className="btn btn-link">
                    View on GitHub
                  </Link>
                </td>
                <th> Go to Repos </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default GitHubUsersPage;
