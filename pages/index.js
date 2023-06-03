import { useEffect, useRef } from "react"
import { Overworld } from "../classes"
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
        id: "DemoRoom",
        lowerSrc: "/maps/DemoLower.png",
        upperSrc: "/maps/DemoUpper.png",
        configObjects: {
          hero: {
            type: "Person",
            isPlayerControlled: true,
            x: withGrid(5),
            y: withGrid(6),
          },
          npcA: {
            type: "Person",
            x: withGrid(10),
            y: withGrid(8),
            src: "/characters/people/npc1.png",
            behaviorLoop: [
              { type: "walk", direction: "left" },
              { type: "walk", direction: "down" },
              { type: "walk", direction: "right" },
              { type: "walk", direction: "up" },
              { type: "stand", direction: "up", time: 400 },
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
                  { type: "textMessage", text: "Go away!" },
                  //{ who: "npcB", type: "walk",  direction: "up" },
                ],
              },
            ],
          },
          npcC: {
            type: "Person",
            x: withGrid(4),
            y: withGrid(8),
            src: "/characters/people/npc1.png",
            behaviorLoop: [
              { type: "stand", direction: "left", time: 500 },
              { type: "stand", direction: "down", time: 500 },
              { type: "stand", direction: "right", time: 500 },
              { type: "stand", direction: "up", time: 500 },
              { type: "walk", direction: "left" },
              { type: "walk", direction: "down" },
              { type: "walk", direction: "right" },
              { type: "walk", direction: "up" },
            ],
          },
          npcB: {
            type: "Person",
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
          },
          pizzaStone: {
            type: "PizzaStone",
            x: withGrid(2),
            y: withGrid(7),
            storyFlag: "USED_PIZZA_STONE",
            pizzas: ["v001", "f001"],
          },
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
              events: [
                {
                  type: "changeMap",
                  map: "Kitchen",
                  x: withGrid(2),
                  y: withGrid(2),
                  direction: "down",
                },
              ],
            },
          ],
        },
      },
      Kitchen: {
        id: "Kitchen",
        lowerSrc: "/maps/KitchenLower.png",
        upperSrc: "/maps/KitchenUpper.png",
        configObjects: {
          hero: {
            type: "Person",
            isPlayerControlled: true,
            x: withGrid(10),
            y: withGrid(5),
          },
          kitchenNpcA: {
            type: "Person",
            x: withGrid(9),
            y: withGrid(5),
            direction: "up",
            src: "/characters/people/npc8.png",
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "** They don't want to talk to you **",
                  },
                ],
              },
            ],
          },
          kitchenNpcB: {
            type: "Person",
            x: withGrid(3),
            y: withGrid(6),
            src: "/characters/people/npc3.png",
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "People take their jobs here very seriously.",
                    faceHero: "kitchenNpcB",
                  },
                ],
              },
            ],
            behaviorLoop: [
              { type: "walk", direction: "right" },
              { type: "walk", direction: "right" },
              { type: "walk", direction: "down" },
              { type: "walk", direction: "down" },
              { type: "walk", direction: "left" },
              { type: "walk", direction: "left" },
              { type: "walk", direction: "up" },
              { type: "walk", direction: "up" },
              { type: "stand", direction: "up", time: 500 },
              { type: "stand", direction: "left", time: 500 },
            ],
          },
        },
        cutsceneSpaces: {
          [asGridCoord(5, 10)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "DiningRoom",
                  x: withGrid(7),
                  y: withGrid(3),
                  direction: "down",
                },
              ],
            },
          ],
          [asGridCoord(10, 6)]: [
            {
              disqualify: ["SEEN_INTRO"],
              events: [
                { type: "addStoryFlag", flag: "SEEN_INTRO" },
                {
                  type: "textMessage",
                  text: "* You are chopping ingredients on your first day as a Pizza Chef at a famed establishment in town. *",
                },
                { type: "walk", who: "kitchenNpcA", direction: "down" },
                {
                  type: "stand",
                  who: "kitchenNpcA",
                  direction: "right",
                  time: 200,
                },
                { type: "stand", who: "hero", direction: "left", time: 200 },
                { type: "textMessage", text: "Ahem. Is this your best work?" },
                {
                  type: "textMessage",
                  text: "These pepperonis are completely unstable! The pepper shapes are all wrong!",
                },
                {
                  type: "textMessage",
                  text: "Don't even get me started on the mushrooms.",
                },
                {
                  type: "textMessage",
                  text: "You will never make it in pizza!",
                },
                {
                  type: "stand",
                  who: "kitchenNpcA",
                  direction: "right",
                  time: 200,
                },
                { type: "walk", who: "kitchenNpcA", direction: "up" },
                {
                  type: "stand",
                  who: "kitchenNpcA",
                  direction: "up",
                  time: 300,
                },
                { type: "stand", who: "hero", direction: "down", time: 400 },
                {
                  type: "textMessage",
                  text: "* The competition is fierce! You should spend some time leveling up your Pizza lineup and skills. *",
                },
                {
                  type: "changeMap",
                  map: "Street",
                  x: withGrid(5),
                  y: withGrid(10),
                  direction: "down",
                },
              ],
            },
          ],
        },
        walls: {
          [asGridCoord(2, 4)]: true,
          [asGridCoord(3, 4)]: true,
          [asGridCoord(5, 4)]: true,
          [asGridCoord(6, 4)]: true,
          [asGridCoord(7, 4)]: true,
          [asGridCoord(8, 4)]: true,
          [asGridCoord(11, 4)]: true,
          [asGridCoord(11, 5)]: true,
          [asGridCoord(12, 5)]: true,
          [asGridCoord(1, 5)]: true,
          [asGridCoord(1, 6)]: true,
          [asGridCoord(1, 7)]: true,
          [asGridCoord(1, 9)]: true,
          [asGridCoord(2, 9)]: true,
          [asGridCoord(6, 7)]: true,
          [asGridCoord(7, 7)]: true,
          [asGridCoord(9, 7)]: true,
          [asGridCoord(10, 7)]: true,
          [asGridCoord(9, 9)]: true,
          [asGridCoord(10, 9)]: true,
          [asGridCoord(3, 10)]: true,
          [asGridCoord(4, 10)]: true,
          [asGridCoord(6, 10)]: true,
          [asGridCoord(7, 10)]: true,
          [asGridCoord(8, 10)]: true,
          [asGridCoord(11, 10)]: true,
          [asGridCoord(12, 10)]: true,

          [asGridCoord(0, 8)]: true,
          [asGridCoord(5, 11)]: true,

          [asGridCoord(4, 3)]: true,
          [asGridCoord(9, 4)]: true,
          [asGridCoord(10, 4)]: true,

          [asGridCoord(13, 6)]: true,
          [asGridCoord(13, 7)]: true,
          [asGridCoord(13, 8)]: true,
          [asGridCoord(13, 9)]: true,
        },
      },
      Street: {
        id: "Street",
        lowerSrc: "/maps/StreetLower.png",
        upperSrc: "/maps/StreetUpper.png",
        configObjects: {
          hero: {
            type: "Person",
            isPlayerControlled: true,
            x: withGrid(30),
            y: withGrid(10),
          },
          streetNpcA: {
            type: "Person",
            x: withGrid(9),
            y: withGrid(11),
            src: "/characters/people/npc2.png",
            behaviorLoop: [
              { type: "stand", direction: "right", time: 1400 },
              { type: "stand", direction: "up", time: 900 },
            ],
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "All ambitious pizza chefs gather on Anchovy Avenue.",
                    faceHero: "streetNpcA",
                  },
                ],
              },
            ],
          },
          streetNpcB: {
            type: "Person",
            x: withGrid(31),
            y: withGrid(12),
            src: "/characters/people/npc7.png",
            behaviorLoop: [
              { type: "stand", direction: "up", time: 400 },
              { type: "stand", direction: "left", time: 800 },
              { type: "stand", direction: "down", time: 400 },
              { type: "stand", direction: "left", time: 800 },
              { type: "stand", direction: "right", time: 800 },
            ],
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "I can't decide on my favorite toppings.",
                    faceHero: "streetNpcB",
                  },
                ],
              },
            ],
          },
          streetNpcC: {
            type: "Person",
            x: withGrid(22),
            y: withGrid(10),
            src: "/characters/people/npc8.png",
            talking: [
              {
                required: ["streetBattle"],
                events: [
                  {
                    type: "textMessage",
                    text: "You are quite capable.",
                    faceHero: "streetNpcC",
                  },
                ],
              },
              {
                events: [
                  {
                    type: "textMessage",
                    text: "You should have just stayed home!",
                    faceHero: "streetNpcC",
                  },
                  { type: "battle", enemyId: "streetBattle" },
                  { type: "addStoryFlag", flag: "streetBattle" },
                ],
              },
            ],
          },
        },
        walls: (function () {
          let walls = {}
          ;[
            "4,9",
            "5,8",
            "6,9",
            "7,9",
            "8,9",
            "9,9",
            "10,9",
            "11,9",
            "12,9",
            "13,8",
            "14,8",
            "15,7",
            "16,7",
            "17,7",
            "18,7",
            "19,7",
            "20,7",
            "21,7",
            "22,7",
            "23,7",
            "24,7",
            "24,6",
            "24,5",
            "26,5",
            "26,6",
            "26,7",
            "27,7",
            "28,8",
            "28,9",
            "29,8",
            "30,9",
            "31,9",
            "32,9",
            "33,9",
            "16,9",
            "17,9",
            "25,9",
            "26,9",
            "16,10",
            "17,10",
            "25,10",
            "26,10",
            "16,11",
            "17,11",
            "25,11",
            "26,11",
            "18,11",
            "19,11",
            "4,14",
            "5,14",
            "6,14",
            "7,14",
            "8,14",
            "9,14",
            "10,14",
            "11,14",
            "12,14",
            "13,14",
            "14,14",
            "15,14",
            "16,14",
            "17,14",
            "18,14",
            "19,14",
            "20,14",
            "21,14",
            "22,14",
            "23,14",
            "24,14",
            "25,14",
            "26,14",
            "27,14",
            "28,14",
            "29,14",
            "30,14",
            "31,14",
            "32,14",
            "33,14",
            "3,10",
            "3,11",
            "3,12",
            "3,13",
            "34,10",
            "34,11",
            "34,12",
            "34,13",
            "29,8",
            "25,4",
          ].forEach((coord) => {
            let [x, y] = coord.split(",")
            walls[asGridCoord(x, y)] = true
          })
          return walls
        })(),
        cutsceneSpaces: {
          [asGridCoord(5, 9)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "DiningRoom",
                  x: withGrid(6),
                  y: withGrid(12),
                  direction: "up",
                },
              ],
            },
          ],
          [asGridCoord(29, 9)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "Shop",
                  x: withGrid(5),
                  y: withGrid(12),
                  direction: "up",
                },
              ],
            },
          ],
          [asGridCoord(25, 5)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "StreetNorth",
                  x: withGrid(7),
                  y: withGrid(16),
                  direction: "up",
                },
              ],
            },
          ],
        },
      },
      Shop: {
        id: "Shop",
        lowerSrc: "/maps/PizzaShopLower.png",
        upperSrc: "/maps/PizzaShopUpper.png",
        configObjects: {
          hero: {
            type: "Person",
            isPlayerControlled: true,
            x: withGrid(3),
            y: withGrid(7),
          },
          shopNpcA: {
            type: "Person",
            x: withGrid(6),
            y: withGrid(5),
            src: "/characters/people/erio.png",
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "All of the chef rivalries have been good for business.",
                    faceHero: "shopNpcA",
                  },
                ],
              },
            ],
          },
          shopNpcB: {
            type: "Person",
            x: withGrid(5),
            y: withGrid(9),
            src: "/characters/people/npc2.png",
            behaviorLoop: [{ type: "stand", direction: "left", time: 400 }],
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "Which peel will make me a better chef?",
                    faceHero: "shopNpcB",
                  },
                ],
              },
            ],
          },
          pizzaStone: {
            type: "PizzaStone",
            x: withGrid(1),
            y: withGrid(4),
            storyFlag: "STONE_SHOP",
            pizzas: ["v002", "f002"],
          },
        },
        cutsceneSpaces: {
          [asGridCoord(5, 12)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "Street",
                  x: withGrid(29),
                  y: withGrid(9),
                  direction: "down",
                },
              ],
            },
          ],
        },
        walls: {
          [asGridCoord(2, 4)]: true,
          [asGridCoord(2, 5)]: true,
          [asGridCoord(2, 6)]: true,
          [asGridCoord(3, 6)]: true,
          [asGridCoord(4, 6)]: true,
          [asGridCoord(5, 6)]: true,
          [asGridCoord(7, 6)]: true,
          [asGridCoord(8, 6)]: true,
          [asGridCoord(9, 6)]: true,
          [asGridCoord(9, 5)]: true,
          [asGridCoord(9, 4)]: true,
          [asGridCoord(3, 8)]: true,
          [asGridCoord(3, 9)]: true,
          [asGridCoord(3, 10)]: true,
          [asGridCoord(4, 8)]: true,
          [asGridCoord(4, 9)]: true,
          [asGridCoord(4, 10)]: true,
          [asGridCoord(7, 8)]: true,
          [asGridCoord(7, 9)]: true,
          [asGridCoord(8, 8)]: true,
          [asGridCoord(8, 9)]: true,
          [asGridCoord(1, 12)]: true,
          [asGridCoord(2, 12)]: true,
          [asGridCoord(3, 12)]: true,
          [asGridCoord(4, 12)]: true,
          [asGridCoord(6, 12)]: true,
          [asGridCoord(7, 12)]: true,
          [asGridCoord(8, 12)]: true,
          [asGridCoord(9, 12)]: true,
          [asGridCoord(10, 12)]: true,
          [asGridCoord(0, 4)]: true,
          [asGridCoord(0, 5)]: true,
          [asGridCoord(0, 6)]: true,
          [asGridCoord(0, 7)]: true,
          [asGridCoord(0, 8)]: true,
          [asGridCoord(0, 9)]: true,
          [asGridCoord(0, 10)]: true,
          [asGridCoord(0, 11)]: true,
          [asGridCoord(11, 4)]: true,
          [asGridCoord(11, 5)]: true,
          [asGridCoord(11, 6)]: true,
          [asGridCoord(11, 7)]: true,
          [asGridCoord(11, 8)]: true,
          [asGridCoord(11, 9)]: true,
          [asGridCoord(11, 10)]: true,
          [asGridCoord(11, 11)]: true,

          [asGridCoord(1, 3)]: true,
          [asGridCoord(2, 3)]: true,
          [asGridCoord(3, 3)]: true,
          [asGridCoord(4, 3)]: true,
          [asGridCoord(5, 3)]: true,
          [asGridCoord(6, 3)]: true,
          [asGridCoord(7, 3)]: true,
          [asGridCoord(8, 3)]: true,
          [asGridCoord(9, 3)]: true,
          [asGridCoord(10, 3)]: true,

          [asGridCoord(5, 13)]: true,
        },
      },
      GreenKitchen: {
        id: "GreenKitchen",
        lowerSrc: "/maps/GreenKitchenLower.png",
        upperSrc: "/maps/GreenKitchenUpper.png",
        configObjects: {
          hero: {
            type: "Person",
            isPlayerControlled: true,
            x: withGrid(3),
            y: withGrid(8),
          },
          greenKitchenNpcA: {
            type: "Person",
            x: withGrid(8),
            y: withGrid(8),
            src: "/characters/people/npc2.png",
            behaviorLoop: [
              { type: "stand", direction: "up", time: 400 },
              { type: "stand", direction: "left", time: 800 },
              { type: "stand", direction: "down", time: 400 },
              { type: "stand", direction: "left", time: 800 },
            ],
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "Chef Rootie uses the best seasoning.",
                    faceHero: "greenKitchenNpcA",
                  },
                ],
              },
            ],
          },
          greenKitchenNpcB: {
            type: "Person",
            x: withGrid(1),
            y: withGrid(8),
            src: "/characters/people/npc3.png",
            behaviorLoop: [
              { type: "stand", direction: "up", time: 900 },
              { type: "walk", direction: "down" },
              { type: "walk", direction: "down" },
              { type: "stand", direction: "right", time: 800 },
              { type: "stand", direction: "down", time: 400 },
              { type: "stand", direction: "right", time: 800 },
              { type: "walk", direction: "up" },
              { type: "walk", direction: "up" },
              { type: "stand", direction: "up", time: 600 },
              { type: "stand", direction: "right", time: 900 },
            ],
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "Finally... a pizza place that gets me!",
                    faceHero: "greenKitchenNpcB",
                  },
                ],
              },
            ],
          },
          greenKitchenNpcC: {
            type: "Person",
            x: withGrid(3),
            y: withGrid(5),
            src: "/characters/people/secondBoss.png",
            talking: [
              {
                required: ["chefRootie"],
                events: [
                  {
                    type: "textMessage",
                    faceHero: ["greenKitchenNpcC"],
                    text: "My veggies need more growth.",
                  },
                ],
              },
              {
                events: [
                  {
                    type: "textMessage",
                    text: "Veggies are the fuel for the heart and soul!",
                    faceHero: "greenKitchenNpcC",
                  },
                  {
                    type: "battle",
                    enemyId: "chefRootie",
                    arena: "green-kitchen",
                  },
                  { type: "addStoryFlag", flag: "chefRootie" },
                ],
              },
            ],
          },
        },
        cutsceneSpaces: {
          [asGridCoord(5, 12)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "StreetNorth",
                  x: withGrid(7),
                  y: withGrid(5),
                  direction: "down",
                },
              ],
            },
          ],
        },
        walls: {
          [asGridCoord(1, 4)]: true,
          [asGridCoord(3, 4)]: true,
          [asGridCoord(4, 4)]: true,
          [asGridCoord(6, 4)]: true,
          [asGridCoord(7, 4)]: true,
          [asGridCoord(8, 5)]: true,
          [asGridCoord(9, 4)]: true,
          [asGridCoord(1, 6)]: true,
          [asGridCoord(2, 6)]: true,
          [asGridCoord(3, 6)]: true,
          [asGridCoord(4, 6)]: true,
          [asGridCoord(5, 6)]: true,
          [asGridCoord(6, 6)]: true,
          [asGridCoord(3, 7)]: true,
          [asGridCoord(4, 7)]: true,
          [asGridCoord(6, 7)]: true,
          [asGridCoord(2, 9)]: true,
          [asGridCoord(3, 9)]: true,
          [asGridCoord(4, 9)]: true,
          [asGridCoord(7, 10)]: true,
          [asGridCoord(8, 10)]: true,
          [asGridCoord(9, 10)]: true,
          [asGridCoord(1, 12)]: true,
          [asGridCoord(2, 12)]: true,
          [asGridCoord(3, 12)]: true,
          [asGridCoord(4, 12)]: true,
          [asGridCoord(6, 12)]: true,
          [asGridCoord(7, 12)]: true,
          [asGridCoord(8, 12)]: true,
          [asGridCoord(9, 12)]: true,
          [asGridCoord(0, 5)]: true,
          [asGridCoord(0, 6)]: true,
          [asGridCoord(0, 7)]: true,
          [asGridCoord(0, 8)]: true,
          [asGridCoord(0, 9)]: true,
          [asGridCoord(0, 10)]: true,
          [asGridCoord(0, 11)]: true,
          [asGridCoord(10, 5)]: true,
          [asGridCoord(10, 6)]: true,
          [asGridCoord(10, 7)]: true,
          [asGridCoord(10, 8)]: true,
          [asGridCoord(10, 9)]: true,
          [asGridCoord(10, 10)]: true,
          [asGridCoord(10, 11)]: true,
          [asGridCoord(5, 13)]: true,
        },
      },
      StreetNorth: {
        id: "StreetNorth",
        lowerSrc: "/maps/StreetNorthLower.png",
        upperSrc: "/maps/StreetNorthUpper.png",
        configObjects: {
          hero: {
            type: "Person",
            isPlayerControlled: true,
            x: withGrid(3),
            y: withGrid(8),
          },
          streetNorthNpcA: {
            type: "Person",
            x: withGrid(9),
            y: withGrid(6),
            src: "/characters/people/npc1.png",
            behaviorLoop: [
              { type: "walk", direction: "left" },
              { type: "walk", direction: "down" },
              { type: "walk", direction: "right" },
              { type: "stand", direction: "right", time: 800 },
              { type: "walk", direction: "up" },
              { type: "stand", direction: "up", time: 400 },
            ],
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "This place is famous for veggie pizzas!",
                    faceHero: "streetNorthNpcA",
                  },
                ],
              },
            ],
          },
          streetNorthNpcB: {
            type: "Person",
            x: withGrid(4),
            y: withGrid(12),
            src: "/characters/people/npc3.png",
            behaviorLoop: [
              { type: "stand", direction: "up", time: 400 },
              { type: "stand", direction: "left", time: 800 },
              { type: "stand", direction: "down", time: 400 },
              { type: "stand", direction: "left", time: 800 },
              { type: "stand", direction: "right", time: 800 },
            ],
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "I love the fresh smell of garlic in the air.",
                    faceHero: "streetNorthNpcB",
                  },
                ],
              },
            ],
          },
          streetNorthNpcC: {
            type: "Person",
            x: withGrid(12),
            y: withGrid(9),
            src: "/characters/people/npc8.png",
            talking: [
              {
                required: ["streetNorthBattle"],
                events: [
                  {
                    type: "textMessage",
                    text: "Could you be the Legendary one?",
                    faceHero: "streetNorthNpcC",
                  },
                ],
              },
              {
                events: [
                  {
                    type: "textMessage",
                    text: "This is my turf!",
                    faceHero: "streetNorthNpcC",
                  },
                  { type: "battle", enemyId: "streetNorthBattle" },
                  { type: "addStoryFlag", flag: "streetNorthBattle" },
                ],
              },
            ],
          },
          pizzaStone: {
            type: "PizzaStone",
            x: withGrid(2),
            y: withGrid(9),
            storyFlag: "STONE_STREET_NORTH",
            pizzas: ["v001", "f001"],
          },
        },
        walls: {
          [asGridCoord(2, 7)]: true,
          [asGridCoord(3, 7)]: true,
          [asGridCoord(3, 6)]: true,
          [asGridCoord(4, 5)]: true,
          [asGridCoord(5, 5)]: true,
          [asGridCoord(6, 5)]: true,
          [asGridCoord(8, 5)]: true,
          [asGridCoord(9, 5)]: true,
          [asGridCoord(10, 5)]: true,
          [asGridCoord(11, 6)]: true,
          [asGridCoord(12, 6)]: true,
          [asGridCoord(13, 6)]: true,
          [asGridCoord(7, 8)]: true,
          [asGridCoord(8, 8)]: true,
          [asGridCoord(7, 9)]: true,
          [asGridCoord(8, 9)]: true,
          [asGridCoord(7, 10)]: true,
          [asGridCoord(8, 10)]: true,
          [asGridCoord(9, 10)]: true,
          [asGridCoord(10, 10)]: true,
          [asGridCoord(2, 15)]: true,
          [asGridCoord(3, 15)]: true,
          [asGridCoord(4, 15)]: true,
          [asGridCoord(5, 15)]: true,
          [asGridCoord(6, 15)]: true,
          [asGridCoord(6, 16)]: true,
          [asGridCoord(8, 16)]: true,
          [asGridCoord(8, 15)]: true,
          [asGridCoord(9, 15)]: true,
          [asGridCoord(10, 15)]: true,
          [asGridCoord(11, 15)]: true,
          [asGridCoord(12, 15)]: true,
          [asGridCoord(13, 15)]: true,

          [asGridCoord(1, 8)]: true,
          [asGridCoord(1, 9)]: true,
          [asGridCoord(1, 10)]: true,
          [asGridCoord(1, 11)]: true,
          [asGridCoord(1, 12)]: true,
          [asGridCoord(1, 13)]: true,
          [asGridCoord(1, 14)]: true,

          [asGridCoord(14, 7)]: true,
          [asGridCoord(14, 8)]: true,
          [asGridCoord(14, 9)]: true,
          [asGridCoord(14, 10)]: true,
          [asGridCoord(14, 11)]: true,
          [asGridCoord(14, 12)]: true,
          [asGridCoord(14, 13)]: true,
          [asGridCoord(14, 14)]: true,

          [asGridCoord(7, 17)]: true,
          [asGridCoord(7, 4)]: true,
        },
        cutsceneSpaces: {
          [asGridCoord(7, 5)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "GreenKitchen",
                  x: withGrid(5),
                  y: withGrid(12),
                  direction: "up",
                },
              ],
            },
          ],
          [asGridCoord(7, 16)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "Street",
                  x: withGrid(25),
                  y: withGrid(5),
                  direction: "down",
                },
              ],
            },
          ],
        },
      },
      DiningRoom: {
        id: "DiningRoom",
        lowerSrc: "/maps/DiningRoomLower.png",
        upperSrc: "/maps/DiningRoomUpper.png",
        configObjects: {
          hero: {
            type: "Person",
            isPlayerControlled: true,
            x: withGrid(5),
            y: withGrid(8),
          },
          diningRoomNpcA: {
            type: "Person",
            x: withGrid(12),
            y: withGrid(8),
            src: "/characters/people/npc8.png",
            talking: [
              {
                required: ["diningRoomBattle"],
                events: [
                  {
                    type: "textMessage",
                    text: "Maybe I am not ready for this place.",
                    faceHero: "diningRoomNpcA",
                  },
                ],
              },
              {
                events: [
                  {
                    type: "textMessage",
                    text: "You think you have what it takes to cook here?!",
                    faceHero: "diningRoomNpcA",
                  },
                  {
                    type: "battle",
                    enemyId: "diningRoomBattle",
                    arena: "dining-room",
                  },
                  { type: "addStoryFlag", flag: "diningRoomBattle" },
                ],
              },
            ],
          },
          diningRoomNpcB: {
            type: "Person",
            x: withGrid(9),
            y: withGrid(5),
            src: "/characters/people/npc4.png",
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "People come from all over to dine here.",
                    faceHero: "diningRoomNpcB",
                  },
                ],
              },
            ],
          },
          diningRoomNpcC: {
            type: "Person",
            x: withGrid(2),
            y: withGrid(8),
            src: "/characters/people/npc7.png",
            behaviorLoop: [
              { type: "stand", direction: "right", time: 800 },
              { type: "stand", direction: "down", time: 700 },
              { type: "stand", direction: "right", time: 800 },
            ],
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "I was so lucky to score a reservation!",
                    faceHero: "diningRoomNpcC",
                  },
                ],
              },
            ],
          },
          diningRoomNpcD: {
            type: "Person",
            x: withGrid(8),
            y: withGrid(9),
            src: "/characters/people/npc1.png",
            behaviorLoop: [
              { type: "stand", direction: "right", time: 1200 },
              { type: "stand", direction: "down", time: 900 },
              { type: "stand", direction: "left", time: 800 },
              { type: "stand", direction: "down", time: 700 },
              { type: "stand", direction: "right", time: 400 },
              { type: "stand", direction: "up", time: 800 },
            ],
            talking: [
              {
                events: [
                  {
                    type: "textMessage",
                    text: "I've been dreaming of this pizza for weeks!",
                    faceHero: "diningRoomNpcD",
                  },
                ],
              },
            ],
          },
        },
        cutsceneSpaces: {
          [asGridCoord(7, 3)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "Kitchen",
                  x: withGrid(5),
                  y: withGrid(10),
                  direction: "up",
                },
              ],
            },
          ],
          [asGridCoord(6, 12)]: [
            {
              events: [
                {
                  type: "changeMap",
                  map: "Street",
                  x: withGrid(5),
                  y: withGrid(9),
                  direction: "down",
                },
              ],
            },
          ],
        },
        walls: {
          [asGridCoord(6, 3)]: true,
          [asGridCoord(7, 2)]: true,
          [asGridCoord(6, 13)]: true,
          [asGridCoord(1, 5)]: true,
          [asGridCoord(2, 5)]: true,
          [asGridCoord(3, 5)]: true,
          [asGridCoord(4, 5)]: true,
          [asGridCoord(4, 4)]: true,
          [asGridCoord(5, 3)]: true,
          [asGridCoord(6, 4)]: true,
          [asGridCoord(6, 5)]: true,
          [asGridCoord(8, 3)]: true,
          [asGridCoord(9, 4)]: true,
          [asGridCoord(10, 5)]: true,
          [asGridCoord(11, 5)]: true,
          [asGridCoord(12, 5)]: true,
          [asGridCoord(11, 7)]: true,
          [asGridCoord(12, 7)]: true,
          [asGridCoord(2, 7)]: true,
          [asGridCoord(3, 7)]: true,
          [asGridCoord(4, 7)]: true,
          [asGridCoord(7, 7)]: true,
          [asGridCoord(8, 7)]: true,
          [asGridCoord(9, 7)]: true,
          [asGridCoord(2, 10)]: true,
          [asGridCoord(3, 10)]: true,
          [asGridCoord(4, 10)]: true,
          [asGridCoord(7, 10)]: true,
          [asGridCoord(8, 10)]: true,
          [asGridCoord(9, 10)]: true,
          [asGridCoord(1, 12)]: true,
          [asGridCoord(2, 12)]: true,
          [asGridCoord(3, 12)]: true,
          [asGridCoord(4, 12)]: true,
          [asGridCoord(5, 12)]: true,
          [asGridCoord(7, 12)]: true,
          [asGridCoord(8, 12)]: true,
          [asGridCoord(9, 12)]: true,
          [asGridCoord(10, 12)]: true,
          [asGridCoord(11, 12)]: true,
          [asGridCoord(12, 12)]: true,
          [asGridCoord(0, 4)]: true,
          [asGridCoord(0, 5)]: true,
          [asGridCoord(0, 6)]: true,
          [asGridCoord(0, 8)]: true,
          [asGridCoord(0, 9)]: true,
          [asGridCoord(0, 10)]: true,
          [asGridCoord(0, 11)]: true,
          [asGridCoord(13, 4)]: true,
          [asGridCoord(13, 5)]: true,
          [asGridCoord(13, 6)]: true,
          [asGridCoord(13, 8)]: true,
          [asGridCoord(13, 9)]: true,
          [asGridCoord(13, 10)]: true,
          [asGridCoord(13, 11)]: true,
        },
      },
    }
    const overworld = new Overworld({
      element: document.querySelector(".game-container"),
      canvas: document.querySelector(".game-canvas"),
      OVERWORLD_MAP: OVERWORLD_MAP,
    })
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
