import "./style.css"  

const HomePage = () => {
  return (
    <>
      <nav>
        <div className="search">
          <button></button>
          <input type="text" placeholder="Search for user"/>
        </div>
        <div className="profile"></div>
      </nav>
      <main></main>
    </>
  )
}

export default HomePage