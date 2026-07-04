
import '../../stylesheets/square-stats.css'

function SquareStatistics({ title, data, icon, message = "" }) {
  return (
    <div className='parentContainer card shadow soft-card p-3'>
      <div className="card-body">
        <div className="card-title header d-flex gap-3 flex-row align-items-center justify-content-left">
          <img src={icon} alt="" />
          <h1>{title}</h1>
        </div>
        <div className="data-container card-text">
          <h1>{data}</h1>
          <p>{message}</p>
        </div>
      </div>

    </div>

  )

} export default SquareStatistics
