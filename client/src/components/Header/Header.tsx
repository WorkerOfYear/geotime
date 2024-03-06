import styles from './Header.module.scss'
import ButtonSm from "../Buttons/ButtonSm"
import JobButtons from '../Buttons/JobButtons'
import SievesSwitchers from '../SievesSwitchers/SievesSwitchers'

const links = [{
  path: '/settings', title: 'Настройка WITS'
}, {
  path: '/history', title: ' Экспорт отчёта'
}]

const Header = () => {
  
  
  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <div className={styles.header__col}>
          <SievesSwitchers />
        </div>
        <div className={styles.header__btns}>
          <JobButtons />
        </div>
        <div className={styles.header__links}>
          {links.map(link => (
            <ButtonSm key={link.title} title={link.title} path={link.path} />
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header