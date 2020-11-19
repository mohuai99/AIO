import Loading from './loading'

export default function(service){
  return {
    loading: Loading(service)
  }
}