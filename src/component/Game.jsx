import { useState, useEffect, useRef } from 'react';
import flappy from '../assets/flappy.png';

export default function Game() {
    const [birdPosition, setBirdPosition] = useState(400);
    const [pipeX, setPipeX] = useState(600);
    const [pipeHeight, setPipeHeight] = useState(400);
    const [gameOver, setGameOver] = useState(false);
    const [pause, setPause] = useState(false);
    const [score, setScore] = useState(0);
    const [passed, setPassed] = useState(false);
    const [gone, setGone] = useState(false);
    const [highScore, setHighScore] = useState(() => {
        return Number(localStorage.getItem('highscore')) || 0;
    });



    const birdRef = useRef(birdPosition);
    const currentPipeXRef = useRef(pipeX);

    // Mobile responsive bird position
    const BIRD_LEFT = window.innerWidth < 600 ? 140 : 250;

    useEffect(() => {
        birdRef.current = birdPosition;
    }, [birdPosition]);

    useEffect(() => {
        currentPipeXRef.current = pipeX;
    }, [pipeX]);

    const GAP = 150;

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('highscore', String(score))

        }
    }, [score, highScore])

    // Gravity
    useEffect(() => {

        if (gameOver) return;
        if (pause) return

        const gravity = setInterval(() => {
            setBirdPosition(prev => prev + 3);
        }, 30);

        return () => clearInterval(gravity);
    }, [gameOver, pause]);

    // Random pipe height
    const randomHeight = () => {
        setPipeHeight(Math.floor(Math.random() * 300) + 50);
    };


    useEffect(() => {
        const handleP = (e) => {
            if(gameOver) return
            if (e.key.toLowerCase() !== 'p') return;

           setPause((prev) => !prev )

        }
        window.addEventListener('keydown',handleP)

        return () => window.removeEventListener('keydown',handleP)
    },[gameOver])
    // Controls
    useEffect(() => {
        if (gameOver) return;
        if (pause) return;

        const jump = () => {
            setBirdPosition(prev => prev - 50);
        };

        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Works on mobile + desktop
        window.addEventListener('pointerdown', jump);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('pointerdown', jump);
        };
    }, [gameOver, pause]);

    // Pipe movement + collision
    useEffect(() => {
        if (gameOver) return;
        if (pause) return


        const pipeMovement = setInterval(() => {
            setPipeX(prev => {

                if (prev <= -60) {
                    randomHeight();
                    setPassed(false);
                    setGone(false);
                    return 600;
                }

                const newX = prev - 5;

                // Bird hitbox
                const HITBOX = 40;
                const OFFSET = 15;

                const birdLeft = BIRD_LEFT + OFFSET;
                const birdRight = birdLeft + HITBOX;

                const birdTop = birdRef.current + OFFSET;
                const birdBottom = birdTop + HITBOX;

                // Pipe
                const pipeLeft = newX;
                const pipeRight = newX + 60;

                const horizontal =
                    pipeLeft < birdRight &&
                    pipeRight > birdLeft;

                // Top collision
                const topCollision = birdTop < pipeHeight;

                // Bottom collision
                const bottomPipeTop = pipeHeight + GAP;
                const bottomCollision =
                    birdBottom > bottomPipeTop;

                if (
                    (horizontal && topCollision) ||
                    (horizontal && bottomCollision)
                ) {
                    setGameOver(true);
                }

                return newX;
            });
        }, 30);

        return () => clearInterval(pipeMovement);
    }, [gameOver, pipeHeight, pause]);

    // Pipe color effect
    useEffect(() => {
        if (currentPipeXRef.current === -60) {
            setGone(false);
        }

        if (currentPipeXRef.current === -10) {
            setGone(true);
        }
    }, [pipeX]);

    // Score
    useEffect(() => {
        const newX = pipeX;
        const birdLeft = BIRD_LEFT;

        if (!passed && newX + 60 < birdLeft) {
            setScore(prev => prev + 1);
            setPassed(true);
        }
    }, [pipeX, passed]);

    // Ground collision
    useEffect(() => {
        if (birdPosition >= 700) {
            setGameOver(true);
        }
    }, [birdPosition]);

    // Reset game
    const handleReset = () => {
        setBirdPosition(250);
        setPipeX(600);
        setPipeHeight(400);
        setScore(0);
        setGameOver(false);
    };

    let BG = gone ? '#121212' : 'green';

    return (
        <div
            style={{
                position: 'relative',
                backgroundColor: 'skyblue',
                border: '2px solid black',

                width: '100vw',
                maxWidth: '600px',

                height: '700px',
                margin: '0 auto',

                overflow: 'hidden',

                fontFamily: 'fangsong',

                // IMPORTANT FOR MOBILE
                touchAction: 'none'
            }}
        >
            {/* Score */}
            <h1
                style={{
                    position: 'absolute',
                    top: '5px',
                    left: '20px',
                    color: 'black',
                    zIndex: 2,
                    fontSize: '28px'
                }}
            >
                Score: {score}
            </h1>

            {/* High Score */}
            <h1
                style={{
                    position: 'absolute',
                    right: '20px',
                    top: '5px',
                    color: 'yellow',
                    zIndex: 2,
                    fontSize: '28px'
                }}
            >
                HighScore: {highScore}
            </h1>


            {/* Game Over */}
            {gameOver && (
                <div
                    style={{
                        position: 'absolute',
                        top: '300px',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        backgroundColor: 'white',
                        border: '2px solid black',
                        borderRadius: '10px',
                        textAlign: 'center',
                        zIndex: 1000
                    }}
                >
                    <h2>Game Over</h2>

                    <button onClick={handleReset}>
                        Restart
                    </button>
                </div>
            )}

            {pause && (
                <div
                    style={{
                        position: 'absolute',
                        top: '300px',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        backgroundColor: 'white',
                        border: '2px solid black',
                        borderRadius: '10px',
                        textAlign: 'center',
                        zIndex: 1000
                    }}
                >
                    <h2>Paused ▶️</h2>

                    <button
                        onPointerDown={(e) => e.stopPropagation()}

                        onClick={() => setPause(false)}>
                        Play
                    </button>
                </div>
            )}

            {/* Bird */}
            <img
                src={flappy}
                style={{
                    position: 'absolute',
                    left: `${BIRD_LEFT}px`,
                    top: birdPosition,
                    borderRadius: '50%',
                    width: '70px',
                    height: '70px',
                    transition: 'top 0.05s linear'
                }}
            />

            {/* Top Pipe */}
            <div
                style={{
                    position: 'absolute',
                    top: '0px',
                    left: pipeX,
                    backgroundColor: BG,
                    transition: 'background-color 0.2s ease',
                    width: '60px',
                    height: pipeHeight
                }}
            ></div>

            {/* Bottom Pipe */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '0px',
                    left: pipeX,
                    backgroundColor: BG,
                    transition: 'background-color 0.2s ease',
                    width: '60px',
                    height: 700 - pipeHeight - GAP
                }}
            ></div>

            <div
                onPointerDown={(e) => e.stopPropagation()}

                onClick={(e) => {

                    if (gameOver) return
                    setPause((prev) => !prev)
                }}
                style={{
                    fontSize: '50px',
                    position: 'absolute',
                    bottom: '30px',

                }}>{pause && !gameOver ? '▶️' : '⏸️'}</div>
                
                <p style={{
                    
                    position: 'absolute',
                    bottom: '-10px',
                    color:'black',
                    fontWeight:'bold',
                    fontFamily:'math',
                    fontSize:'15px'

                }}>Press p</p>

        </div>
    );
}