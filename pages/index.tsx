import { NextApiRequest } from "next";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  console.log(req);
  return {
    redirect: {
      destination: "/admin",
      permanent: false,
    },
  };
};

const Root = () => {
  return null;
};

export default Root;
