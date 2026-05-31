import { useMyListStats } from "../../hooks/useMyListStats"
import "./statsCircle.scss"

const StatsCircle = () => {
  const { stats } = useMyListStats()
  
  const total = stats.total || 1
  const watching = (stats.watching / total) * 180
  const completed = (stats.completed / total) * 180
  const dropped = (stats.dropped / total) * 180
  
  const watchingTotal = watching
  const completedTotal = watchingTotal + completed
  const droppedTotal = completedTotal + dropped

  const gradient = `conic-gradient(
    var(--color-watching) 0deg,
    var(--color-watching) ${watchingTotal}deg,
    var(--color-completed) ${watchingTotal}deg ${completedTotal}deg,
    var(--color-dropped) ${completedTotal}deg ${droppedTotal}deg,
    var(--color-plan-to-watch) ${droppedTotal}deg 180deg,
    var(--color-white-10) 180deg, 
    var(--color-white-10) 270deg, 
    var(--color-white-10) 270deg
  ) `

  return (
    <div className="donut-wrapper">
      <div className="donut-chart" style={{ background: gradient }}>
        <div className="donut-chart__hole">
          <p className="text-h1 ">{stats.total}</p>
          <p className="text-details text-color--50 rotate-text">Total</p>
        </div>
      </div>

      <div className="donut-legend">
        <div className="donut-legend__item">
          <span className="donut-legend__dot icon-size-m" style={{ backgroundColor: "var(--color-watching)" }}></span>
          <p className="text-h2">{stats.watching}</p>
          <p className="text-details text-color--50">Watching</p>
        </div>
        <div className="donut-legend__item">
          <span className="donut-legend__dot icon-size-m" style={{ backgroundColor: "var(--color-completed)" }}></span>
          <p className="text-h2">{stats.completed}</p>
          <p className="text-details text-color--50">Completed</p>
        </div>
        <div className="donut-legend__item">
          <span className="donut-legend__dot icon-size-m" style={{ backgroundColor: "var(--color-dropped)" }}></span>
          <p className="text-h2">{stats.dropped}</p>
          <p className="text-details text-color--50">Dropped</p>
        </div>
        <div className="donut-legend__item">
          <span className="donut-legend__dot icon-size-m" style={{ backgroundColor: "var(--color-plan-to-watch)" }}></span>
          <p className="text-h2">{stats.planToWatch}</p>
          <p className="text-details text-color--50">Plan to watch</p>
        </div>
      </div>
    </div>
  )
}

export default StatsCircle