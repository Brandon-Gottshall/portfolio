import Tooltip from './Tooltip'
import { LanguageIcon } from './LanguageIcon'

export default function LanguageSelectionIcon ({ language, modifyFilters, filters }) {
  const color = (filters.includes(language)) ? '#ff0000' : '#000000'
  return (
    <Tooltip key={`key_langTT_${language}`} tooltipText={language}>
      <div onClick={() => modifyFilters(language)}>
        <LanguageIcon
          key={`key_langIcon_${language}`} iconName={language} iconStyle='w-10 h-10 transform-gpu hover:animate-bounce' color={color}
        />
      </div>
    </Tooltip>
  )
}
