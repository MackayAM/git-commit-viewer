import Head from 'next/head';
import Commits from '../components/Commits';

export const Home = (): JSX.Element => {

  return (
    <div className="container">
      <Head>
        <title>Git Commit Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Commits />
    </div>
  );
}

export default Home;