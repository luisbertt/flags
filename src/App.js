import React, { useState, useEffect } from "react"
import countries from "./countries.json"

const flagUrl = "https://restcountries.eu/data/"

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function App() {
  const [remainingCountries, setRemainingCountries] = useState([
    ...shuffle(countries),
  ])
  const [guessedCountries, setGuessedCountries] = useState([])
  const [input, setInput] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentCountry, setCurrentCountry] = useState(
    remainingCountries[currentIndex]
  )
  const [gameOver, setGameOver] = useState(false)

  const mod = (n, m) => {
    return n - m * Math.floor(n / m)
  }

  const endGame = () => {
    setGameOver(true)
  }

  const startGame = () => {
    setGameOver(false)
    setGuessedCountries([])
    setRemainingCountries([...shuffle(countries)])
    setCurrentIndex(0)
  }

  const prev = () => {
    setCurrentIndex(mod(currentIndex - 1, remainingCountries.length))
  }

  const next = () => {
    setCurrentIndex(mod(currentIndex + 1, remainingCountries.length))
  }

  useEffect(() => {
    setCurrentCountry(remainingCountries[currentIndex])
  }, [currentIndex])

  useEffect(() => {
    setCurrentCountry(remainingCountries[currentIndex])
  }, [remainingCountries])

  useEffect(() => {
    if (input === currentCountry.name.toLowerCase()) {
      setInput("")
      setGuessedCountries(gc =>
        gc.concat(remainingCountries.splice(currentIndex, 1))
      )
      setRemainingCountries(rc =>
        rc.filter(({ name }) => name !== currentCountry.name)
      )
    }
  }, [input])

  return (
    <div className="h-screen p-10">
      <h1 className="h-1/12 text-center text-5xl font-bold">Guess the Flag!</h1>
      <div className="h-4/12 flex justify-between w-1/2 mx-auto items-center">
        <div className="border h-20 w-32">
          <img
            className="h-full w-full"
            src={flagUrl + currentCountry.code + ".svg"}
            alt={currentCountry.name}
          />
        </div>
        <div>
          <p className="text-sm">Enter Country:</p>
          <input
            className="border"
            value={input}
            type="text"
            onChange={e => {
              e.preventDefault()
              setInput(e.target.value)
            }}
          />
          <div className="flex justify-between text-sm text-blue-500">
            <button onClick={prev}>prev</button>
            <button onClick={next}>next</button>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm">score</p>
          <p className="font-bold">
            {guessedCountries.length}/{countries.length}
          </p>
          <p className="font-bold">
            {parseInt((guessedCountries.length * 100) / countries.length)}%
          </p>
        </div>
        <div className="w-24">
          {gameOver ? (
            <button className="text-sm text-blue-500" onClick={startGame}>
              restart
            </button>
          ) : (
            <button className="text-sm text-blue-500" onClick={endGame}>
              give up?
            </button>
          )}
          {/* <ul className="flex text-sm space-x-4">
            <li>freeplay</li>
            <li>5min</li>
            <li>10min</li>
            <li>15min</li>
            <li>20min</li>
          </ul> */}
        </div>
      </div>
      {guessedCountries.length > 0 && (
        <div className="mt-10">
          <h3 className="font-bold">
            Guessed Countries: ({guessedCountries.length})
          </h3>
          <div className="flex flex-wrap ">
            {guessedCountries.map(({ name, code }) => (
              <div key={code} className="flex border h-6 w-1/12 items-center">
                <img
                  className="h-full w-8"
                  alt={name}
                  src={flagUrl + code + ".svg"}
                />
                <p className="text-xs text-center w-full truncate">{name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {gameOver && (
        <div className="mt-10">
          <h3 className="font-bold">
            Remaining Countries: ({remainingCountries.length})
          </h3>
          <div className="flex flex-wrap ">
            {remainingCountries.map(({ name, code }) => (
              <div key={code} className="flex border h-6 w-1/12 items-center">
                <img
                  className="h-full w-8"
                  alt={name}
                  src={flagUrl + code + ".svg"}
                />
                <p className="text-xs text-red-600 text-center w-full truncate">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
