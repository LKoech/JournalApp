// src/app/page.js
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Welcome to your journal</h1>
      </div>
      <div className={styles.description}>
        <h2>
          This is a simple journaling app that allows you to write and save your
          thoughts.
        </h2>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/journalpng.svg"
          alt="Journal Logo"
          width={600}
          height={270}
          priority
        />
      </div>

      <div className={styles.grid}>
  <Link href="/login" className={styles.card}>
    <h2>
      Login <span>-&gt;</span>
    </h2>
    <p>Access your journal by logging in.</p>
  </Link>

  <Link href="/signup" className={styles.card}>
    <h2>
      Signup <span>-&gt;</span>
    </h2>
    <p>Create an account to start journaling.</p>
  </Link>
</div>

    </main>
  );
}
