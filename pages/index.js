import { useState, useEffect, useRef } from "react"
import { signMessage } from "../utils/sign"
import Link from "next/link"
import Metamask from "../components/metamask"
import { GameObject, OverworldMap, DirectionInput } from "../classes"

const OVERWORLD_MAPS = [
  {
    name: "DemoRoom",
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
  {
    name: "Kitchen",
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
]

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
        if (directionInput) {
          Object.values(map.gameObjects).forEach((object) => {
            object.update({
              arrow: directionInput.direction,
            })
            object.sprite.draw(canvas)
          })
        }
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



// if (typeof window !== "undefined") {
//   window.OverworldMaps = {
//     DemoRoom: {
//       lowerSrc: "/maps/DemoLower.png",
//       upperSrc: "/maps/DemoUpper.png",
//       gameObjects: {
//         hero: new Person({
//           isPlayerControlled: true,
//           x: withGrid(5),
//           y: withGrid(6),
//         }),
//         npc1: new Person({
//           x: withGrid(7),
//           y: withGrid(9),
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
//           y: 5,}),
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
