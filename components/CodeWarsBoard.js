import StatCard from './StatCard'
import axios from 'axios'

export default function CodeWarsBoard ({ StatsGrid }) {
  return (
    <div>
      {StatsGrid}
    </div>
  )
};

export async function getServerSideProps (context) {
  const data = await (Object.entries(await axios.get('https://www.codewars.com/api/v1/users/Brandon%20Gottshall').then(res => res.data.ranks.languages))).map(([language, stats]) => (<StatCard key={language} language={language} score={stats.score} />))

  if (!data) {
    return {
      notFound: true
    }
  }

  return {
    props: { StatsGrid: data } // will be passed to the page component as props
  }
}
