import React, { useState, useEffect, useReducer } from "react"
import shuffle from "./utils/shuffle"
import countries from "./countries.json"

const flagUrl = "https://restcountries.eu/data/"

const CountriesList = ({ title, countries }) => (
  <div className="mt-5">
    <h3 className="font-bold">
      {title}: ({countries.length})
    </h3>
    <div className="flex flex-wrap ">
      {countries.map(({ name, code }) => (
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
)

const countriesReducer = (state, { type }) => {
  const {
    remainingCountries,
    guessedCountries,
    currentIndex,
    currentCountry,
  } = state

  switch (type) {
    case "GUESSED":
      const newRemainingCountries = remainingCountries.filter(
        ({ code }) => code !== currentCountry.code
      )
      const newIndex =
        (currentIndex + newRemainingCountries.length) %
        newRemainingCountries.length
      return {
        guessedCountries: [
          ...guessedCountries,
          ...remainingCountries.filter(
            ({ code }) => code === currentCountry.code
          ),
        ],
        currentIndex: newIndex,
        remainingCountries: newRemainingCountries,
        currentCountry: newRemainingCountries[newIndex],
      }

    case "NEXT":
      let nextIndex =
        (currentIndex + 1 + remainingCountries.length) %
        remainingCountries.length
      return {
        guessedCountries,
        remainingCountries,
        currentIndex: newIndex,
        currentCountry: remainingCountries[nextIndex],
      }
    case "PREV":
      const prevIndex =
        (currentIndex - 1 + remainingCountries.length) %
        remainingCountries.length
      return {
        guessedCountries,
        remainingCountries,
        currentIndex: prevIndex,
        currentCountry: remainingCountries[prevIndex],
      }

    case "RESET":
      const shuffledCountries = shuffle(countries)
      return {
        guessedCountries: [],
        remainingCountries: shuffledCountries,
        currentIndex: 0,
        currentCountry: shuffledCountries[0],
      }
    default:
      return state
  }
}

function App() {
  const shuffledCountries = shuffle(countries)
  const [
    { remainingCountries, guessedCountries, currentCountry },
    dispatch,
  ] = useReducer(countriesReducer, {
    remainingCountries: shuffledCountries,
    guessedCountries: [],
    currentIndex: 0,
    currentCountry: shuffledCountries[0],
  })

  const [input, setInput] = useState("")
  const [gameOver, setGameOver] = useState(false)

  const startGame = () => {
    setGameOver(false)
    dispatch({ type: "RESET" })
  }

  const endGame = () => {
    setGameOver(true)
  }

  const prev = () => {
    dispatch({ type: "PREV" })
  }

  const next = () => {
    dispatch({ type: "NEXT" })
  }

  useEffect(() => {
    if (input.trim() === currentCountry.name.toLowerCase()) {
      setInput("")
      dispatch({ type: "GUESSED", payload: currentCountry })
    }
  }, [input, currentCountry])

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
        <button
          className="text-sm text-blue-500"
          onClick={gameOver ? startGame : endGame}
        >
          {gameOver ? "start" : "give up?"}
        </button>
      </div>
      {guessedCountries.length > 0 && (
        <CountriesList title="Guessed Countries" countries={guessedCountries} />
      )}
      {gameOver && (
        <CountriesList
          title="Remaining Countries"
          countries={remainingCountries}
        />
      )}
    </div>
  )
}

export default App
