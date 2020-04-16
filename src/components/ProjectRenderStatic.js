componentDidMount() {
  window.addEventListener('scroll', this.listenToScroll)
}

componentWillUnmount() {
  window.removeEventListener('scroll', this.listenToScroll)
}

listenToScroll = () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop

  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight

  const scrolled = winScroll / height

  this.setState({
    theposition: scrolled,
  })
}
