import { useEffect, useState } from "react"
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'
import ScoreBoard from "./components/ScoreBoard"
import HeaderGame from "./components/HeaderGame"



const width = 8
const candyColors = [
  blueCandy,
  orangeCandy,
  purpleCandy,
  greenCandy,
  redCandy,
  yellowCandy
]

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)



  const checkForColumnOfFour = () =>{
    for (let i =0; i<39; i++){
      const columnOfFour = [i, i+width, i+width*2, i+width*3]
      const decidedColor=currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if(columnOfFour.every(square=>currentColorArrangement[square]===decidedColor && !isBlank)){
        columnOfFour.forEach(square=>currentColorArrangement[square]=blank)
        return true
      }
    }
  }

  const checkForColumnOfThree = () =>{
    for (let i =0; i<47; i++){
      const columnOfTree = [i, i+width, i+width*2]
      const decidedColor=currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank

      if(columnOfTree.every(square=>currentColorArrangement[square]===decidedColor && !isBlank)){
        columnOfTree.forEach(square=>currentColorArrangement[square]=blank)
        return true
      }
    }
  }
  const checkForRowOfFour = () =>{
    for (let i =0; i<64; i++){
      const rowOfFour = [i, i+1, i+2, i+3]
      const decidedColor=currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      if (notValid.includes(i)) continue
      if(rowOfFour.every(square=>currentColorArrangement[square]===decidedColor && !isBlank)){
        rowOfFour.forEach(square=>currentColorArrangement[square]=blank)
        return true
      }
    }
  }

  const checkForRowOfThree = () =>{
    for (let i =0; i<64; i++){
      const rowOfTree = [i, i+1, i+2]
      const decidedColor=currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === blank
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      if (notValid.includes(i)) continue
      if(rowOfTree.every(square=>currentColorArrangement[square]===decidedColor && !isBlank)){
       
        rowOfTree.forEach(square=>currentColorArrangement[square]=blank)
        return true
      }
    }
  }

  const moveIntoSquareBelow = ()=> {
    for (let i = 0; i<=55; i++){
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)
      
      if (isFirstRow && currentColorArrangement[i]===blank){
        let randomNumber = Math.floor(Math.random()*candyColors.length)
        currentColorArrangement[i]=candyColors[randomNumber]
      }

      if((currentColorArrangement[i+width])===blank){
        currentColorArrangement[i+width]=currentColorArrangement[i]
        currentColorArrangement[i]=blank
      }
    }
  }



  const dragStart =(e)=>{
    setSquareBeingDragged(e.target)
  }

  const dragDrop=(e)=>{
    setSquareBeingReplaced(e.target)
  }

  const dragEnd=(e)=>{
    
     const squareBeingDraggedId =Number(squareBeingDragged.name)
     const squareBeingReplacedId = Number(squareBeingReplaced.name)

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.src
    

    
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.src
  



    const validMoves = [
      squareBeingDraggedId-1,
      squareBeingDraggedId-width,
      squareBeingDraggedId+ 1,
      squareBeingDraggedId+width
    ]

    const validMove=validMoves.includes(squareBeingReplacedId)

    const isColumnOfFour = checkForColumnOfFour()
    const isRowOfFour = checkForRowOfFour()
    const isColumnOfTree = checkForColumnOfThree()
    const isRowOfTree = checkForRowOfThree()

    if(squareBeingReplacedId && validMove && (isColumnOfFour || isColumnOfTree || isRowOfFour || isRowOfTree)){
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
      if(isColumnOfFour || isRowOfFour){
        setScoreDisplay((score)=>score + 4)
      } else if (isColumnOfTree || isRowOfTree){
        setScoreDisplay((score)=>score + 3)
      }

    } else {
      currentColorArrangement[squareBeingReplacedId]=squareBeingReplaced.src
      currentColorArrangement[squareBeingDraggedId]=squareBeingDragged.src
      setCurrentColorArrangement([...currentColorArrangement])
    }

  }

  const createBoard = () => {
    const randomColorArrangment = []
    for (let i=0; i<width*width; i++){
      const randomColor = candyColors[Math.floor(Math.random()*candyColors.length)]
      randomColorArrangment.push(randomColor)
    }
    setCurrentColorArrangement(randomColorArrangment)
  }
  useEffect(()=>{
    createBoard()
  },[])

  useEffect(()=>{
    const timer = setInterval(()=>{
      checkForColumnOfFour()
      checkForColumnOfThree()
      checkForRowOfFour()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setCurrentColorArrangement([...currentColorArrangement])
    }, 100)
    return ()=> clearInterval(timer)
  }, [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfFour, checkForRowOfThree, moveIntoSquareBelow, scoreDisplay, currentColorArrangement])


  return (
  <div className="app">
    <HeaderGame/>
    <div className="game">
      {currentColorArrangement.map((candyColor, index)=>(
        <img
           key={index} 
           src={candyColor}
           alt={candyColor}
           data-id={index}
           name = {index}
           draggable={true}
           onDragStart={dragStart}
           onDragOver={(e)=>e.preventDefault()}
           onDragEnter={(e)=>e.preventDefault()}
           onDragLeave={(e)=>e.preventDefault()}
           onDrop={dragDrop}
           onDragEnd={dragEnd}
        />
      ))}
    </div>
      <ScoreBoard score={scoreDisplay}/>
  </div>
  );
}


export default App
