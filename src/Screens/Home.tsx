import {Button} from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import {useTranslation,TransProps} from 'react-i18next'

export const Home = () => {
  const navigate = useNavigate();
  const {t}  = useTranslation();
  return (
    <div className='center'>
      <p>{t("title.he")}</p>
      <Button  onClick={()=> navigate('/dashboard')}>
        {t("button.he")}
      </Button>
    </div>
  )
}
