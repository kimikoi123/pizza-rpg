import { useState, useEffect, useRef } from "react"
import { signMessage } from "../utils/helpers"
import Link from "next/link"
import Metamask from "../components/metamask"
import {
  Person,
  Overworld,
} from "../classes"
import { withGrid, asGridCoord } from "../utils/helpers"

const Index = () => {
  const canvasRef = useRef(null)

  const init = () => {
    const OVERWORLD_MAP = {
      DemoRoom: {
        lowerSrc: "/maps/DemoLower.png",
        upperSrc: "/maps/DemoUpper.png",
        gameObjects: {
          hero: new Person({
            isPlayerControlled: true,
            x: withGrid(5),
            y: withGrid(6),
          }),
          npcA: new Person({
            x: withGrid(7),
            y: withGrid(9),
            src: "/characters/people/npc1.png",
            behaviorLoop: [
              { type: "stand",  direction: "left", time: 800 },
              { type: "stand",  direction: "up", time: 800 },
              { type: "stand",  direction: "right", time: 1200 },
              { type: "stand",  direction: "up", time: 300 },
            ],
            talking: [
              {
                events: [
                  { type: "textMessage", text: "I'm busy...", faceHero: "npcA" },
                  { type: "textMessage", text: "Go away!"},
                  { who: "hero", type: "walk",  direction: "up" },
                ]
              }
            ]
          }),
          npcB: new Person({
            x: withGrid(8),
            y: withGrid(5),
            src: "/characters/people/npc2.png",
            // behaviorLoop: [
            //   { type: "walk",  direction: "left" },
            //   { type: "stand",  direction: "up", time: 800 },
            //   { type: "walk",  direction: "up" },
            //   { type: "walk",  direction: "right" },
            //   { type: "walk",  direction: "down" },
            // ]
          }),
        },
        walls: {
          [asGridCoord(7,6)] : true,
          [asGridCoord(8,6)] : true,
          [asGridCoord(7,7)] : true,
          [asGridCoord(8,7)] : true,
        },
        cutsceneSpaces: {
          [asGridCoord(7,4)]: [
            {
              events: [
                { who: "npcB", type: "walk",  direction: "left" },
                { who: "npcB", type: "stand",  direction: "up", time: 500 },
                { type: "textMessage", text:"You can't be in there!"},
                { who: "npcB", type: "walk",  direction: "right" },
                { who: "hero", type: "walk",  direction: "down" },
                { who: "hero", type: "walk",  direction: "left" },
              ]
            }
          ],
          [asGridCoord(5,10)]: [
            {
              events: [
                { type: "changeMap", map: "Kitchen" }
              ]
            }
          ]
        }
        
      },
      Kitchen: {
        lowerSrc: "/maps/KitchenLower.png",
        upperSrc: "/maps/KitchenUpper.png",
        gameObjects: {
          hero: new Person({
            isPlayerControlled: true,
            x: withGrid(5),
            y: withGrid(5),
          }),
          npcB: new Person({
            x: withGrid(10),
            y: withGrid(8),
            src: "/characters/people/npc3.png",
            talking: [
              {
                events: [
                  { type: "textMessage", text: "You made it!", faceHero:"npcB" },
                ]
              }
            ]
          })
        }
      },
    }
    const overworld = new Overworld({
      element: document.querySelector(".game-container"),
      canvas: document.querySelector('.game-canvas'),
      initialMap: OVERWORLD_MAP
    })

    overworld.init()
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="h-screen">
      <div className="bg-[#333] overflow-hidden h-full grid place-items-center">
        <div className="game-container relative w-[352px] h-[198px] outline outline-white outline-[1px] scale-[3]">
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
