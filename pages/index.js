export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/api",
      permanent: false,
    },
  };
}

export default function Page() {
  return null;
}
