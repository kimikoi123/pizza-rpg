import { GameObject, Person } from "./index"
import { withGrid } from "../utils/sign"

class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects

    this.lowerImage = new Image()
    this.lowerImage.src = config.lowerSrc

    this.upperImage = new Image()
    this.upperImage.src = config.upperSrc
  }

  drawLowerImage(ctx) {
    if (ctx) {
      ctx.drawImage(this.lowerImage, 0, 0)
    }
  }

  drawUpperImage(ctx) {
    if (ctx) {
      ctx.drawImage(this.upperImage, 0, 0)
    }
  }
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

export default OverworldMap
