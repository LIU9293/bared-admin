/* eslint-disable react/jsx-handler-names */
import ButtonMenu from '@components/ButtonMenu'
import AuthFooter from '@components/AuthFooter'
import Button from '@components/Button'
import './style.css'

export default function SideBar ({ config = [], secondary = false, user, onLogin }) {
  return (
    <div className={`
      side-bar
      ${secondary ? 'side-bar-secondary' : ''}
    `}
    >
      <div className='side-bar-top'>
        <div>Bared Admin</div>
      </div>
      <div className='side-bar-content'>
        {config.map((section, index) => {
          return (
            <div className='side-bar-section' key={index}>
              <div className='side-bar-label'>{section.title}</div>
              {section.items.map(item => {
                return (
                  <ButtonMenu
                    key={item.title}
                    active={item.active}
                    onClick={item.onClick}
                    text={item.title}
                    className={item.className}
                    canDelete={item.canDelete}
                    onDelete={item.onDelete}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
      {
        !secondary
          ? (user.id
              ? <AuthFooter name={user.name} avatar={user.avatar} />
              : (
                <div style={{ padding: 20 }}>
                  <Button onClick={onLogin} type='secondary' full>登录</Button>
                </div>
                )
            )
          : null
      }
    </div>
  )
}
