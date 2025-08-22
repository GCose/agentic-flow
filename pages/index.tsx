export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/auth",
      permanent: false,
    },
  };
};

const Root = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f5f6fa' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#222', color: '#fff' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Agentic Flow</span>
        <a
          href="/auth"
          style={{
            background: '#4f8cff',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Login
        </a>
      </nav>
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#222' }}>Welcome to Agentic Flow</h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>Your workspace for agentic automation.</p>
      </main>
    </div>
  )
};

export default Root;
