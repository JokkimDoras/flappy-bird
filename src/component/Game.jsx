import { useState,useEffect,useRef } from 'react';
import flappy from '../assets/flappy.png'


export default function Game () {
    const [birdPosition, setBirdPosition] = useState(400);
    const [pipeX, setPipeX] = useState(600);
    const [pipeHeight, setPipeHeight] = useState(400);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [passed, setPassed] = useState(false);
    const[gone,setGone]=useState(false);
    const[highScore,setHighScore]=useState(0);


    const birdRef = useRef(birdPosition);
    const currentPipeXRef = useRef(pipeX);

    useEffect(() => {
        birdRef.current = birdPosition;
    }, [birdPosition]);
    
    useEffect(() => {
        currentPipeXRef.current = pipeX;
    }, [pipeX]);
    



const GAP = 150;


useEffect(() => {
    if(gameOver){
        if(score>highScore){

            setHighScore(score);
        }
        return;
    };
   const gravity = setInterval(() => {
        setBirdPosition(prev => prev + 3)
    },30)

    return () => clearInterval(gravity)
},[gameOver]);


const randomHeight = () => {
    setPipeHeight(Math.floor(Math.random()*300)+50);
}



useEffect(() => {
    if(!gameOver){
        const handleJump = (e) => {
            if(e.code == 'Space'){
             setBirdPosition(prev => prev -50)
            }
         }
         window.addEventListener('keydown',handleJump);
         return () => window.removeEventListener('keydown',handleJump)
    }
   
},[gameOver])

useEffect(() => {
    if(gameOver){
return;}else{
    
}
    const pipeMovement = setInterval(() => {
      setPipeX(prev => {
  
        if (prev <= -60) {
          randomHeight();
          setPassed(false)
          setGone(false)
          return 600;
        }
        
  const newX = prev - 5;
     
//for img 
const BIRD_SIZE = 70;
const HITBOX = 40;
const OFFSET = 15;

const birdLeft = 250 + OFFSET;
const birdRight = birdLeft + HITBOX;

const birdTop = birdRef.current + OFFSET;
const birdBottom = birdTop + HITBOX;


    const pipeLeft = newX;
    const pipeRight = newX+60;

  
    const topPipeBottom = pipeHeight;
    //for h
    const horizontal = pipeLeft < birdRight && pipeRight > birdLeft;

     const topCollision = birdTop < pipeHeight;

    
    const bottomPipeTop = pipeHeight + GAP;
    const bottomCollision = birdBottom > bottomPipeTop;
 
        if((horizontal && topCollision ) || (horizontal && bottomCollision)){

            setGameOver(true);
        }
    
    return newX;
});
}, 30);
  
  
    return () => clearInterval(pipeMovement);
  }, [gameOver,pipeHeight]);

  useEffect(() => {

      if(currentPipeXRef.current == -60){
        setGone(false);
        console.log('completely OUt')
      }
     
    if(currentPipeXRef.current == -10){
        setGone(true)
    console.log('start the color change')}
  },[pipeX])

useEffect(() => {
    const newX = pipeX;
    const birdLeft = 250;

if (!passed && newX + 60 < birdLeft) {
        setScore((prev) => prev + 1);
        setPassed(true);
    }

}, [pipeX, passed]);

useEffect(() => {
    if(birdPosition >= 700){
        setGameOver(true);
    }
},[birdPosition])
const handleReset = () => {
    setBirdPosition(250);
    setPipeX(600);
    setPipeHeight(400);
    setScore(0)
    setGameOver(false);
}


let BG = '';
if(gone){
    BG='#121212';
}else{
    BG='green'
}
 


    return <div style={{
        position:'relative',
        backgroundColor:'skyblue',
        border:'2px solid black',
        width:'600px',
        height:'700px',
        fontFamily:'fangsong'
    }}><h1 style={{
        position:'absolute',
        top:'5px',
        left:'20px',
        color:'black',
        zIndex:2,
    }}>Score:{score}</h1>
    <h1 style={{
        position:'relative',
        left:'390px',
        color:'yellow',
        zIndex:2,
        boxShadow:'initial'
    }}> HighScore:{highScore}</h1>
    
        {gameOver && (
            <div style={{
                position:'absolute',
                top:'300px',
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "20px",
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "10px",
                textAlign: "center",
                zIndex: 1000
            }}>
                <h2 >Game Over</h2>
                <button onClick={handleReset}>Restart</button>
            </div>
        )}
        <img src={flappy} style={{
            position:'absolute',
            left:'250px',
            top:birdPosition,
            borderRadius:'50%',
            width:'70px',
            height:'70px',
              transition: "top 0.05s linear",
        }}/>
            
        <div style={{
            position:'absolute',
            top:'0px',
            left:pipeX,
            backgroundColor:BG,
            transition: "background-color 0.2s ease",
            width:'60px',
            height:pipeHeight,

        }}></div>
            
        
        <div style={{
            position:'absolute',
            bottom:'0px',
            left:pipeX,
            backgroundColor:BG,
            transition:'background-color 0.2s ease',
            width:'60px',
            height:700- pipeHeight - GAP
        }}></div>


        
    </div>
};  