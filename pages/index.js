import { useState, useEffect, useRef } from "react"
import { signMessage } from "../utils/helpers"
import Link from "next/link"
import Metamask from "../components/metamask"
import { GameObject, OverworldMap, DirectionInput, Person } from "../classes"
import { withGrid } from "../utils/helpers"

const Index = () => {
  const canvasRef = useRef(null)

  // let map = null
  // let directionInput = null
  // let cameraPerson = null

  const startGameLoop = () => {
    const OVERWORLD_MAPS = {
      DemoRoom: {
        lowerSrc: "/maps/DemoLower.png",
        upperSrc: "/maps/DemoUpper.png",
        gameObjects: {
          hero: new Person({
            isPlayerControlled: true,
            x: withGrid(5),
            y: withGrid(6),
          }),
          npc1: new Person({
            x: withGrid(7),
            y: withGrid(9),
            src: "/characters/people/npc1.png",
          }),
        },
      },
      Kitchen: {
        lowerSrc: "/maps/KitchenLower.png",
        upperSrc: "/maps/KitchenUpper.png",
        gameObjects: {
          hero: new GameObject({
            x: 3,
            y: 5,
          }),
          npcA: new GameObject({
            x: 9,
            y: 6,
            src: "/characters/people/npc2.png",
          }),
          npcB: new GameObject({
            x: 10,
            y: 8,
            src: "/characters/people/npc3.png",
          }),
        },
      },
    }
    const canvas = canvasRef.current.getContext("2d")
    const map = new OverworldMap(OVERWORLD_MAPS.DemoRoom)
    const directionInput = new DirectionInput()
    directionInput.init()
    const cameraPerson = map.gameObjects.hero
    const step = () => {
      //Clear off the canvas
      canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height)

      //Draw Lower layer
      map.drawLowerImage(canvas, cameraPerson)

      //Draw Game Objects

      Object.values(map.gameObjects).forEach((object) => {
        object.update({
          arrow: directionInput.direction,
        })
        object.sprite.draw(canvas, cameraPerson)
      })

      //Draw Upper layer
      map.drawUpperImage(canvas, cameraPerson)

      requestAnimationFrame(() => {
        step()
      })
    }
    step()
  }

  useEffect(() => {
    const init = () => {
      // map = new OverworldMap(OVERWORLD_MAPS.DemoRoom)
      // directionInput = new DirectionInput()
      // directionInput.init()
      // cameraPerson = map.gameObjects.hero
      startGameLoop()
    }
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

// if (typeof window !== 'undefined') {
//   window.OverworldMaps = {
//     DemoRoom: {
//       lowerSrc: "/maps/DemoLower.png",
//       upperSrc: "/maps/DemoUpper.png",
//       gameObjects: {
//         hero: new Person({
//           isPlayerControlled: true,
//           x: utils.withGrid(5),
//           y: utils.withGrid(6),
//         }),
//         npc1: new Person({
//           x: utils.withGrid(7),
//           y: utils.withGrid(9),
//           src: "/characters/people/npc1.png"
//         })
//       }
//     },
//     Kitchen: {
//       lowerSrc: "/maps/KitchenLower.png",
//       upperSrc: "/maps/KitchenUpper.png",
//       gameObjects: {
//         hero: new GameObject({
//           x: 3,
//           y: 5,
//         }),
//         npcA: new GameObject({
//           x: 9,
//           y: 6,
//           src: "/characters/people/npc2.png"
//         }),
//         npcB: new GameObject({
//           x: 10,
//           y: 8,
//           src: "/characters/people/npc3.png"
//         })
//       }
//     },
//   }
// }

export default Index
