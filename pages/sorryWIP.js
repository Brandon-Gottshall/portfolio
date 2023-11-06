class sorryWIP extends React.Component {
  constructor(props) {
    super(props)
    this.state = {color: props.color || 'red'}
  }
  
  render() {
    return (
      <div className='flex items-center justify-center h-full text-center bg-red-300'>
        <h1>Sorry, this application is being overhauled. </h1>
        <p>Please check back later.</p>
      </div>
    )
  }
}

function sorryWIP(props) {
  const [color, setColor] = useState(props.color ||'red')
  
  return (
    <div className='flex items-center justify-center h-full text-center bg-red-300'>
      <h1>Sorry, this application is being overhauled. </h1>
      <p>Please check back later.</p>
    </div>
  )
}

export default sorryWIP
