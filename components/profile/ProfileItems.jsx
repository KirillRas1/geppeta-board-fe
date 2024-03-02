import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { authContext } from 'contexts/Auth';

export const MyComments = ({ userId }) => {
  const router = useRouter();
  const link = () => {
    router.push({ pathname: '/comments', query: { author: userId } });
  };
  return <Typography onClick={() => link()}>My Comments</Typography>;
};

export const MyPosts = ({ userId }) => {
  const router = useRouter();
  let link;
  if (router.pathname === '/') {
    link = () => {
      router.push({ pathname: router.pathname, query: { author: userId } });
    };
  } else {
    link = () => {
      router.push({ pathname: '/', query: { author: userId } });
    };
  }

  return <Typography onClick={() => link()}>My Posts</Typography>;
};

export const ProfileItems = () => {
  const { userId } = useContext(authContext);
  return (
    <div>
      <Divider />
      <MyPosts userId={userId} />
      <Divider />
      <MyComments userId={userId} />
    </div>
  );
};
