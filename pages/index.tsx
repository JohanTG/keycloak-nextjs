import {SyntheticEvent, useEffect, useState} from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'
import withAuth from "./withAuth";

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}

const Home: NextPage = ({data}: any) => {
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint
  });
  const { current } = page;

  useEffect(() => {
    if ( current === defaultEndpoint ) return;

    request(current);
  }, [current]);

  async function request(current: any) {
    const res = await fetch(current)
    const nextData = await res.json();

    updatePage({
      current,
      ...nextData.info
    });

    if ( !nextData.info?.prev ) {
      updateResults(nextData.results);
      return;
    }

    updateResults(prev => {
      return [
        ...prev,
        ...nextData.results
      ]
    });
  }

  function handleLoadMore() {
    updatePage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    });
  }

  function handleOnSubmitSearch(e: SyntheticEvent) {
    e.preventDefault();

    const fields = Array.from(e.currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query');

    const value = fieldQuery.value || '';
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Rick and Morty</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Wubba Lubba Dub Dub!
        </h1>

        <p className={styles.description}>
          Rick and Morty Character Wiki
        </p>

        <form className="search">
          <input name="query" type="search" onSubmit={handleOnSubmitSearch} />
          <button>Search</button>
        </form>

        <ul className={styles.grid}>
          {results.map((result: { id: string; name: string; image: string; }) => {
            const { id, name, image } = result;
            return (
                <li key={id} className="card">
                  <Link href="/character/[id]" as={`/character/${id}`}>
                    <a>
                      <img src={image} alt={`${name} Thumbnail`} />
                      <h3>{ name }</h3>
                    </a>
                  </Link>
                </li>
            )
          })}
        </ul>
        <p>
          <button onClick={handleLoadMore}>Load More</button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default withAuth(Home)
