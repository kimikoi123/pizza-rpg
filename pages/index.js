import { useEffect, useRef, useState } from "react"
import { Person, Overworld, PizzaStone } from "../classes"
import { withGrid, asGridCoord } from "../utils/helpers"
import { signInAnonymously, onAuthStateChanged } from "firebase/auth"
import { auth, database } from "../utils/firebase"
import {
  ref,
  set,
  onDisconnect,
  onValue,
  onChildAdded,
  update,
  remove,
} from "firebase/database"

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
              { type: "stand", direction: "left", time: 800 },
              { type: "stand", direction: "up", time: 800 },
              { type: "stand", direction: "right", time: 1200 },
              { type: "stand", direction: "up", time: 300 },
            ],
            talking: [
              {
                required: ["TALKED_TO_ERIO"],
                events: [
                  {
                    type: "textMessage",
                    text: "Isn't Erio the coolest?",
                    faceHero: "npcA",
                  },
                ],
              },
              {
                events: [
                  {
                    type: "textMessage",
                    text: "I'm going to crush you!",
                    faceHero: "npcA",
                  },
                  { type: "battle", enemyId: "beth" },
                  { type: "addStoryFlag", flag: "DEFEATED_BETH" },
                  {
                    type: "textMessage",
                    text: "You crushed me like weak pepper.",
                    faceHero: "npcA",
                  },
                  // { type: "textMessage", text: "Go away!"},
                  //{ who: "hero", type: "walk",  direction: "up" },
                ],
              },
            ],
          }),
          npcB: new Person({
            x: withGrid(8),
            y: withGrid(5),
            src: "/characters/people/erio.png",
            talking: [
              {
                events: [
                  { type: "textMessage", text: "Bahaha!", faceHero: "npcB" },
                  { type: "addStoryFlag", flag: "TALKED_TO_ERIO" },
                  //{ type: "battle", enemyId: "erio" }
                ],
              },
            ],
            // behaviorLoop: [
            //   { type: "walk",  direction: "left" },
            //   { type: "stand",  direction: "up", time: 800 },
            //   { type: "walk",  direction: "up" },
            //   { type: "walk",  direction: "right" },
            //   { type: "walk",  direction: "down" },
            // ]
          }),
          pizzaStone: new PizzaStone({
            x: withGrid(2),
            y: withGrid(7),
            storyFlag: "USED_PIZZA_STONE",
            pizzas: ["v001", "f001"],
          }),
        },
        walls: {
          [asGridCoord(7, 6)]: true,
          [asGridCoord(8, 6)]: true,
          [asGridCoord(7, 7)]: true,
          [asGridCoord(8, 7)]: true,
        },
        cutsceneSpaces: {
          [asGridCoord(7, 4)]: [
            {
              events: [
                { who: "npcB", type: "walk", direction: "left" },
                { who: "npcB", type: "stand", direction: "up", time: 500 },
                { type: "textMessage", text: "You can't be in there!" },
                { who: "npcB", type: "walk", direction: "right" },
                { who: "hero", type: "walk", direction: "down" },
                { who: "hero", type: "walk", direction: "left" },
              ],
            },
          ],
          [asGridCoord(5, 10)]: [
            {
              events: [{ type: "changeMap", map: "Kitchen" }],
            },
          ],
        },
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
                  {
                    type: "textMessage",
                    text: "You made it! This video is going to be such a good time!",
                    faceHero: "npcB",
                  },
                ],
              },
            ],
          }),
        },
      },
    }
    const overworld = new Overworld({
      element: document.querySelector(".game-container"),
      canvas: document.querySelector(".game-canvas"),
    })
    overworld.startMap(OVERWORLD_MAP.DemoRoom)
    overworld.init()
  }

  const initGame = (id) => {
    const allPlayersRef = ref(database, "players")

    onValue(allPlayersRef, (snapshot) => {
      const players = snapshot.val() || {}
      const currentPlayer = players[id]
    })

    onChildAdded(allPlayersRef, (snapshot) => {
      const addedPlayer = snapshot.val()
    })

    // enableMovement()
    // placeCoin()
  }

  const initFirebase = () => {
    signInAnonymously(auth).catch((error) => {
      const errorMessage = error.message
      console.log(errorMessage)
    })

    onAuthStateChanged(auth, (user) => {
      if (user.uid) {
        const userId = user.uid
        const playerRef = ref(database, `players/${user.uid}`)
        set(playerRef, {
          id: userId,
          isPlayerControlled: true,
          x: 5,
          y: 6,
        })
        initGame(userId)
        onDisconnect(playerRef).remove()
      }
    })
  }

  useEffect(() => {
    // initFirebase()
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
