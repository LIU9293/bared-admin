import './style.css'

export default function AuthFooter ({ name, avatar }) {
  return (
    <div className='auth-footer'>
      <img src={avatar} className='auth-avatar' />
      <div className='auth-username'>{name}</div>
    </div>
  )
}
