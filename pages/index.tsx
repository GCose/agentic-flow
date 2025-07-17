export const getServerSideProps = async () => {
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
