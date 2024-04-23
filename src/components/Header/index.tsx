import './index.css';
import lightModeIcon from '../../assets/images/icons/sun.svg';
import darkModeIcon from '../../assets/images/icons/moon.svg';
// import highContrastModeOffIcon from '../../assets/images/icons/lightbulb-off.svg';
// import highContrastModeOnIcon from '../../assets/images/icons/lightbulb-on.svg';
// import highContrastModeIcon from '../../assets/images/icons/lightbulb-on-50.svg';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  highContrastMode: boolean;
  setHighContrastMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({
  darkMode,
  setDarkMode,
  highContrastMode,
  setHighContrastMode,
}: HeaderProps) => {
  return (
    <header
      className={`${darkMode ? 'darkTheme' : 'lightTheme'} ${
        highContrastMode ? 'highContrastTheme' : 'lowContrastTheme'
      }`}
    >
      <h1 className="title">
        <a href="">Algorithm Visualiser</a>
      </h1>
      <nav>
        <button
          id="high-contrast-mode-button"
          className={highContrastMode ? 'on' : 'off'}
          data-tooltip="High-contrast mode"
          onClick={() => {
            setHighContrastMode((val) => !val);
            localStorage.setItem(
              'algorithmVisualiserHighContrastMode',
              JSON.stringify(!highContrastMode)
            );
          }}
        >
          {/* <img src={highContrastModeIcon} alt="high contrast mode" /> */}
          <div aria-label="high contrast mode" role="img">
            A
          </div>
        </button>
        {/* <div id="high-contrast-mode-switch" className="mode-switch">
          <img src={highContrastModeOffIcon} alt="normal (low contrast) mode" />
          <label className="switch">
            <input
              type="checkbox"
              checked={highContrastMode}
              onChange={(e) => {
                setHighContrastMode(e.target.checked);
                localStorage.setItem(
                  'algorithmVisualiserHighContrastMode',
                  JSON.stringify(e.target.checked)
                );
              }}
            ></input>
            <span
              className="slider round"
              data-tooltip="High-contrast mode"
            ></span>
          </label>
          <img src={highContrastModeOnIcon} alt="high contrast mode" />
        </div> */}
        <div id="dark-mode-switch" className="mode-switch">
          <img src={lightModeIcon} alt="light mode" />
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => {
                setDarkMode(e.target.checked);
                localStorage.setItem(
                  'algorithmVisualiserDarkMode',
                  JSON.stringify(e.target.checked)
                );
              }}
            ></input>
            <span className="slider round" data-tooltip="Dark mode"></span>
          </label>
          <img src={darkModeIcon} alt="dark mode" />
        </div>
        <div id="dark-mode-button">
          <button
            data-tooltip={`${darkMode ? 'Light' : 'Dark'} mode`}
            onClick={() => {
              setDarkMode((val) => !val);
              localStorage.setItem(
                'algorithmVisualiserDarkMode',
                JSON.stringify(!darkMode)
              );
            }}
          >
            {darkMode && <img src={lightModeIcon} alt="light mode" />}
            {!darkMode && <img src={darkModeIcon} alt="dark mode" />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
