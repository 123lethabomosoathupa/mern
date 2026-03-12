import Repos from "../../components/Repos";

const UserReposPage = ({ params: { user } }) => {
  return (
    <div>
      <Repos user={user} />
    </div>
  );
};

export default UserReposPage;