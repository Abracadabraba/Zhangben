export default function SealStamp({ char = '来', toast = false }) {
  return (
    <span className={`seal${toast ? ' seal--toast' : ''}`} aria-hidden="true">
      {char}
    </span>
  )
}
