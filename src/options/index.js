import Common from '../common/index.js'

export default function(){
  return Common.util.settingMap({
    User:{
      valueField:'userId',
      textField: () => {
        return 'nameCn' || 'nameEn'
      }
    }
  })
}