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

    </main>
  );
}
