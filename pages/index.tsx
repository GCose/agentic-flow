import { NextApiRequest } from "next";

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  console.log(req);
  return {
    redirect: {
      destination: "/auth",
      permanent: false,
    },
  };
};

const Root = () => {
  return null;
};

export default Root;
