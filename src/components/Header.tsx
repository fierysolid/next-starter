import Link from "next/link";
import { withRouter } from "next/router";
import avatar from "../static/logo.png";

const Header = ({ router: { pathname } }) => {
  return (
    <header
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <img
        style={{ height: "50px", width: "77.78px", marginRight: "20px" }}
        src={avatar}
      />
      <Link prefetch href="/">
        <a className={pathname === "/" ? "is-active" : ""}>Home</a>
      </Link>
      <Link prefetch href="/about">
        <a className={pathname === "/about" ? "is-active" : ""}>About</a>
      </Link>
      <Link prefetch href="/contact">
        <a className={pathname === "/contact" ? "is-active" : ""}>Contact</a>
      </Link>
      <style jsx>{`
        header {
          margin-bottom: 25px;
        }
        a {
          font-size: 14px;
          margin-right: 15px;
          text-decoration: none;
        }
        .is-active {
          text-decoration: underline;
        }
      `}</style>
    </header>
  );
};

export default withRouter(Header);
