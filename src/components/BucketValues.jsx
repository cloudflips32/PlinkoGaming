export default function BucketValues ({ bucketValues }) {
  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 flex justify-around">
        {bucketValues.map((value, index) => (
          <div
            key={index}
            className={`text-xs font-bold ${[1, 4, 7].includes(index) ? "text-yellow-300" : "text-white"}`}
            style={{ width: "66px", textAlign: "center" }}
          >
            {[1, 4, 7].includes(index) ? `$${value}` : <span className="font-bold">ZERO</span>}
          </div>
        ))}
      </div>
    </>
  )
}
