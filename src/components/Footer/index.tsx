import './index.css';
import githubIcon from '../../assets/images/icons/github.svg';

const Footer = () => {
  return (
    <footer>
      <pre>Built by </pre>
      <a className="user" href="https://github.com/zoltan-antal">
        <pre>Zoltan Antal</pre>
      </a>
      <pre> </pre>
      <a href="https://github.com/zoltan-antal">
        <img src={githubIcon} alt="GitHub" />
      </a>
      <pre> | </pre>
      <a
        className="repo"
        href="https://github.com/zoltan-antal/algorithm-visualiser"
      >
        Source code
      </a>
    </footer>
  );
};

export default Footer;