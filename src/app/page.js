import challenges from '@/data/challenges.json';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p className="text-[25px]">Stuyvesant Scavenger Hunt</p>
      
      {
        Object.entries(challenges).map(([link, {friendly, open}], i) => (
          <a
            href={`/challenge/${link}`}
            key={i}
            className={`${open ? "bg-slate-100" : "bg-red-500"} p-2 rounded-xl`}
          >
            {friendly}
          </a>
        ))
      }
    </main>
  )
}
