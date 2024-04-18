import './index.css';
import lightModeIcon from '../../assets/images/icons/sun.svg';
import darkModeIcon from '../../assets/images/icons/moon.svg';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ darkMode, setDarkMode }: HeaderProps) => {
  return (
    <header className={darkMode ? 'darkTheme' : 'lightTheme'}>
      <h1 className="title">
        <a href="">Algorithm Visualiser</a>
      </h1>
      <nav>
        <div className="dark-mode-switch">
          <img src={lightModeIcon} alt="Light mode" />
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            ></input>
            <span className="slider round"></span>
          </label>
          <img src={darkModeIcon} alt="dark mode" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
