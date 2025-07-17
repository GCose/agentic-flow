export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/auth",
      permanent: false,
    },
  };
};
