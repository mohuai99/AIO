export default function(service){
  const { message }  = service
  const SHOW_LOADING_TOPIC = 'aio_page_showLoading'
  const CLOSE_LOADING_TOPIC = 'aio_page_closeLoading'
  
  const handleShowLoading = (msg, data) => {
    let node = document.getElementById('aioLoadingBox')
    if(node){
      node.style.visibility = '' 
    } else {
      const tpl = `<div id="aioLoadingBox" class="aio-loading">loading...</div>`
      node = document.createRange().createContextualFragment(tpl)
      document.body.appendChild(node)
    }
  }

  const handleCloseLoading = (msg, data) => {
    const node = document.getElementById('aioLoadingBox')
    if(node){
      node.style.visibility = 'hidden' 
      // node && document.body.removeChild(node)
    }
  }

  aio.message.subscribe(SHOW_LOADING_TOPIC, handleShowLoading)
  aio.message.subscribe(CLOSE_LOADING_TOPIC, handleCloseLoading)
}