import Repos from "@/app/components/Repos";

const UserReposPage = ({params: {user}}) => {
  return (
    <div>
      <Repos user={user}/>
    </div>
  )
};

export default UserReposPage;