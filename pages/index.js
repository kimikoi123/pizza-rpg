import { useState, useEffect, useRef } from "react"
import { signMessage } from "../utils/sign"
import Link from "next/link"
import Metamask from "../components/metamask"
import { GameObject, OverworldMap, DirectionInput } from "../classes"

const Index = () => {
  const canvasRef = useRef(null)
  let map = null
  let directionInput = null

  const startGameLoop = () => {
    const canvas = canvasRef.current.getContext("2d")
    const step = () => {
      //Clear off the canvas
      canvas.clearRect(0, 0, canvas.width, canvas.height)

      if (map) {
        //Draw Lower layer
        map.drawLowerImage(canvas)

        //Draw Game Objects
        Object.values(map.gameObjects).forEach((object) => {
          object.update({
            arrow: directionInput.direction,
          })
          object.sprite.draw(canvas)
        })

        //Draw Upper layer

        map.drawUpperImage(canvas)
      }

      requestAnimationFrame(() => {
        step()
      })
    }
    step()
  }

  const init = () => {
    map = new OverworldMap(window.OverworldMaps.Kitchen)
    directionInput = new DirectionInput()
    directionInput.init()
    startGameLoop()
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="h-screen">
      <div className="bg-[#333] overflow-hidden h-full grid place-items-center">
        <div className="relative w-[352px] h-[198px] outline outline-white outline-[1px] scale-[3]">
          <canvas
            className="game-canvas"
            ref={canvasRef}
            width="352"
            height="198"
          />
        </div>
      </div>
    </div>
  )
}

export default Index
