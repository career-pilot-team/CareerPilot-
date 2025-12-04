// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-links">
        <a
          href="https://github.com/your-team"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span className="footer-divider">|</span>
        <Link to="/terms">이용약관</Link>
        <span className="footer-divider">|</span>
        <Link to="/privacy">개인정보처리방침</Link>
      </div>

        <div className="footer-credit">
        <a
          href="https://www.flaticon.com/kr/free-icons/"
          title="아이콘"
          target="_blank"
          rel="noreferrer"
        >
          아이콘 제작자: nangicon - Flaticon
        </a>
        <span className="footer-divider">|</span>
        <a
          href="https://www.flaticon.com/kr/free-icons/"
          title="증명서 아이콘"
          target="_blank"
          rel="noreferrer"
        >
          증명서 아이콘 제작자: nawicon - Flaticon
        </a>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Career Pilot. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
