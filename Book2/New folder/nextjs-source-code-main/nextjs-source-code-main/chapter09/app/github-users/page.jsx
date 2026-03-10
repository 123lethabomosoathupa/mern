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
      <h1>GitHub Users Page</h1>
    </div>
  );
};
export default GitHubUsersPage;
