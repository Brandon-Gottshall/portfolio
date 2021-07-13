export default function StatCard ({ language, score }) {
  return (
    <div class='bg-gray-100 border-indigo-600 dark:bg-gray-800 bg-opacity-95 border-opacity-60 | p-4 border-solid rounded-3xl border-2 | flex justify-around cursor-pointer | hover:bg-indigo-400 dark:hover:bg-indigo-600 hover:border-transparent | transition-colors duration-500'>
      <img class='w-16 h-16 object-cover' src='https://milenyo.net/wp-content/uploads/2020/05/netflix-n-logo-png.png' alt='' />
      <div class='flex flex-col justify-center'>
        <p class='text-gray-900 dark:text-gray-300 font-semibold'>{language}</p>
        <p class='text-black dark:text-gray-100 text-justify font-semibold'>{score}</p>
      </div>
    </div>
  )
}
