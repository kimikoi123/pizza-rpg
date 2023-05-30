import { oppositeDirection, withGrid, asGridCoord } from "../utils/helpers"
import { TextMessage, Person, SceneTransition } from "./index"

class OverworldEvent {
  constructor({ map, event }) {
    this.map = map
    this.event = event
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who]
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    )

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler)
        resolve()
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who]
    who.startBehavior(
      {
        map: this.map,
      },
      {
        type: "walk",
        direction: this.event.direction,
        retry: true,
      }
    )

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler)
        resolve()
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero]
      obj.direction = oppositeDirection(
        this.map.gameObjects["hero"].direction
      )
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    })
    message.init(document.querySelector(".game-container"))
  }

  changeMap(resolve) {
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
                events: [
                  {
                    type: "textMessage",
                    text: "I'm busy...",
                    faceHero: "npcA",
                  },
                  { type: "textMessage", text: "Go away!" },
                  { who: "hero", type: "walk", direction: "up" },
                ],
              },
            ],
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
                    text: "You made it!",
                    faceHero: "npcB",
                  },
                ],
              },
            ],
          }),
        },
      },
    }
    const sceneTransition = new SceneTransition()
    sceneTransition.init(document.querySelector(".game-container"), () => {
        this.map.overworld.startMap(OVERWORLD_MAP[this.event.map])
        resolve()
        sceneTransition.fadeOut()
    })
   
  }

  init() {
    return new Promise((resolve) => {
      this[this.event.type](resolve)
    })
  }
}

export default OverworldEvent