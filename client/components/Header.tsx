import Link from "next/link";
import style from "./Header.module.css";
import LogoutButton from "./LogoutButton";

type HeaderProps = { isLoggedIn: boolean };

export default function Header({ isLoggedIn }: HeaderProps) {
  return (
    <header className={style.header}>
      <div>TICKETS X CHANGE</div>
      <nav className={style.navbar}>
        {isLoggedIn ? (
          <>
            <Link href="/new-ticket">Sell</Link>
            <Link href="/orders">Orders</Link>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
