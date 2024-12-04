import React, { useState, useEffect } from 'react';
import './HangmanGame.css'; // Importăm fișierul CSS
import { words } from '../data/wordsList'; // Ajustează calea în funcție de locația fișierului

const HangmanGame: React.FC = () => {
    const [word, setWord] = useState<string>("");
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [remainingAttempts, setRemainingAttempts] = useState<number>(7);
    const [gameStatus, setGameStatus] = useState<string>("");

    // Funcție auxiliară pentru a alege litere aleatorii
    const revealLetters = (word: string, count: number): string[] => {
        const uniqueLetters = Array.from(new Set(word.split("")));
        const revealed = new Set<string>();

        while (revealed.size < count && revealed.size < uniqueLetters.length) {
            const randomLetter = uniqueLetters[Math.floor(Math.random() * uniqueLetters.length)];
            revealed.add(randomLetter);
        }

        return Array.from(revealed);
    };

    const handleRestart = () => {
        const newWord = words[Math.floor(Math.random() * words.length)];
        setWord(newWord);
        setGuessedLetters([]);

        // Dezvăluim literele în funcție de lungimea cuvântului
        const revealCount = newWord.length <= 5 ? 1 : 2;
        const revealedLetters = revealLetters(newWord, revealCount);
        setGuessedLetters(revealedLetters);

        setRemainingAttempts(7);
        setGameStatus("");
    };

    useEffect(() => {
        handleRestart();
    }, []);

    const handleLetterGuess = (letter: string) => {
        if (guessedLetters.includes(letter)) return;
        setGuessedLetters((prevGuesses) => [...prevGuesses, letter]);

        if (!word.includes(letter)) {
            setRemainingAttempts((prevAttempts) => prevAttempts - 1);
        }
    };

    useEffect(() => {
        if (remainingAttempts === 0) {
            setGameStatus("Ai pierdut! Cuvântul era: " + word);
        } else if (word.split("").every(letter => guessedLetters.includes(letter))) {
            setGameStatus("Felicitări! Ai câștigat!");
        }
    }, [remainingAttempts, guessedLetters, word]);

    return (
        <div>
            {/* Afișăm imaginea spânzurătoarei în colțul din dreapta sus al paginii */}
            <div className="hangman-image">
                <img
                    src={`/s${7 - remainingAttempts}.png`}
                    alt="Spânzurătoare"
                />
            </div>

            {/* Containerul jocului */}
            <div className="hangman-container">
                <h1>Spânzurătoarea</h1>

                {gameStatus ? (
                    <div className="hangman-status">
                        <h2>{word}</h2>
                        <p className={gameStatus.includes("câștigat") ? "win" : "lose"}>{gameStatus}</p>
                        <div className="hangman-restart">
                            <button onClick={handleRestart}>Începe un joc nou</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Afișăm cuvântul ghicit */}
                        <div className="hangman-word">
                            {word.split("").map((letter, index) => (
                                <span
                                    key={index}
                                    className={guessedLetters.includes(letter) ? "guessed" : ""}
                                >
                                    {guessedLetters.includes(letter) ? letter : "_"}
                                </span>
                            ))}
                        </div>

                        {/* Afișăm numărul de încercări rămase */}
                        <div className="hangman-status">
                            <p>Încercări rămase: {remainingAttempts}</p>
                        </div>

                        {/* Butoane pentru fiecare literă */}
                        <div className="hangman-buttons">
                            {"aăâbcdefghiîjklmnopqrsștțuvwxyz".split("").map(letter => (
                                <button
                                    key={letter}
                                    onClick={() => handleLetterGuess(letter)}
                                    disabled={guessedLetters.includes(letter) || gameStatus !== ""}
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HangmanGame;
