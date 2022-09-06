import Head from "next/head";
import { Sections } from "../components/sections";
import styles from "../styles/Home.module.css";

const  Home = ()=> {
  return (
    <div className={styles.container}>
      <Head>
        <title>Immutascan vs Cryptoslam</title>
        <meta name="description" content="Immutascan vs Cryptoslam" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sections/>
      <footer className={styles.footer}></footer>
    </div>
  );
}

export default Home